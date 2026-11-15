#!/usr/bin/env python3
"""Проверка правил для ИИ-агентов: python3 -I scripts/check-agent-rules.py [корень репозитория].
Скиллы по спецификации agentskills.io, симлинки для Claude Code, размеры AGENTS.md (Codex: 32 КиБ на цепочку,
Claude: до 200 строк), CLAUDE.md рядом с AGENTS.md, относительные ссылки, ссылки на скиллы, запрещённые символы."""
import json, os, re, sys

ROOT = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
CHAIN_LIMIT = 32 * 1024
RESERVE = 2 * 1024        # место под блоки, которые впишут Next.js и Turborepo
problems, notes = [], []
FORBIDDEN_CHARS = ''.join(map(chr, (0x2014, 0x2013, 0x2026)))  # длинное и короткое тире, многоточие: не по стилю текстов


def rel(p):
    return os.path.relpath(p, ROOT)


def md_files():
    for d, dirs, files in os.walk(ROOT):
        dirs[:] = [x for x in dirs if x not in ('node_modules', '.git')]
        for f in files:
            if f.endswith('.md'):
                yield os.path.join(d, f)


# 1. скиллы
skills_dir = os.path.join(ROOT, '.agents', 'skills')
skills = sorted(os.listdir(skills_dir)) if os.path.isdir(skills_dir) else []
NAME_RE = re.compile(r'^[a-z0-9]+(-[a-z0-9]+)*$')
for s in skills:
    p = os.path.join(skills_dir, s, 'SKILL.md')
    if not os.path.isfile(p):
        problems.append(f'скилл {s}: нет SKILL.md'); continue
    text = open(p, encoding='utf-8').read()
    m = re.match(r'^---\n(.*?)\n---\n(.*)$', text, re.S)
    if not m:
        problems.append(f'скилл {s}: нет frontmatter'); continue
    fm, body = m.group(1), m.group(2)
    fields = dict(re.findall(r'^([a-z-]+):\s*(.*)$', fm, re.M))
    extra = set(fields) - {'name', 'description', 'license', 'compatibility', 'metadata', 'allowed-tools'}
    if extra:
        problems.append(f'скилл {s}: поля вне спецификации {sorted(extra)}')
    name, desc = fields.get('name', ''), fields.get('description', '')
    if name != s or not NAME_RE.match(name) or len(name) > 64:
        problems.append(f'скилл {s}: name «{name}» не совпадает с папкой или не по формату')
    if not desc or len(desc) > 1024:
        problems.append(f'скилл {s}: description пустой или длиннее 1024 ({len(desc)})')
    if 'Use when' not in desc:
        notes.append(f'скилл {s}: в description нет «Use when»')
    if body.count('\n') > 500:
        problems.append(f'скилл {s}: тело длиннее 500 строк')
    notes.append(f'скилл {s}: description {len(desc)} симв., тело {body.count(chr(10))} строк')

# 2. симлинки для Claude Code
cdir = os.path.join(ROOT, '.claude', 'skills')
links = sorted(os.listdir(cdir)) if os.path.isdir(cdir) else []
if set(links) != set(skills):
    problems.append(f'.claude/skills не совпадает с .agents/skills: {sorted(set(links) ^ set(skills))}')
for l in links:
    lp = os.path.join(cdir, l)
    if not os.path.islink(lp) or os.path.realpath(lp) != os.path.realpath(os.path.join(skills_dir, l)):
        problems.append(f'.claude/skills/{l}: не симлинк на .agents/skills/{l}')

# 3. JSON
for j in ['.claude/settings.json']:
    try:
        json.load(open(os.path.join(ROOT, j)))
    except Exception as e:
        problems.append(f'{j}: {e}')

# 4 и 5. AGENTS.md: размеры, CLAUDE.md рядом
agents = sorted(p for p in md_files() if os.path.basename(p) == 'AGENTS.md')
root_agents = os.path.join(ROOT, 'AGENTS.md')
root_bytes = os.path.getsize(root_agents)
for a in agents:
    lines = open(a, encoding='utf-8').read().count('\n')
    size = os.path.getsize(a)
    chain = size + (root_bytes if a != root_agents else 0)
    notes.append(f'{rel(a)}: {lines} строк, {size} байт, цепочка для Codex {chain} байт')
    if lines > 200:
        problems.append(f'{rel(a)}: {lines} строк, больше 200')
    if chain > CHAIN_LIMIT - RESERVE:
        problems.append(f'{rel(a)}: цепочка {chain} байт, нужен запас {RESERVE} до {CHAIN_LIMIT}')
    c = os.path.join(os.path.dirname(a), 'CLAUDE.md')
    if not os.path.isfile(c) or not open(c, encoding='utf-8').read().startswith('@AGENTS.md'):
        problems.append(f'{rel(a)}: рядом нет CLAUDE.md с @AGENTS.md в первой строке')

# 6, 7 и 8. ссылки, скиллы, символы
skill_refs = set()
for p in md_files():
    if '/.claude/skills/' in p:
        continue  # те же файлы через симлинк
    t = open(p, encoding='utf-8').read()
    for target in re.findall(r'\]\(([^)\s]+)\)', t):
        if re.match(r'^(https?:|mailto:|#)', target):
            continue
        path = os.path.normpath(os.path.join(os.path.dirname(p), target.split('#')[0]))
        if not os.path.exists(path):
            problems.append(f'{rel(p)}: ссылка на несуществующий {target}')
    skill_refs |= set(re.findall(r'`[$/]?(project-[a-z0-9-]+)`', t))
    # Текст Next.js менять запрещено; стиль проверяем только у авторских правил.
    authored = re.sub(
        r'^<!-- BEGIN:nextjs-agent-rules -->\n.*?^<!-- END:nextjs-agent-rules -->[ \t]*(?:\n|$)',
        '', t, flags=re.M | re.S,
    )
    bad = [c for c in authored if c in FORBIDDEN_CHARS]
    if bad:
        problems.append(f'{rel(p)}: символы {sorted(set(bad))} ({len(bad)} шт.)')
missing = skill_refs - set(skills)
if missing:
    problems.append(f'ссылки на несуществующие скиллы: {sorted(missing)}')
unused = set(skills) - skill_refs
if unused:
    notes.append(f'скиллы без триггера в AGENTS.md: {sorted(unused)}')

print('\n'.join(notes))
print('\nПРОБЛЕМЫ:' if problems else '\nПроблем нет')
for p in problems:
    print(' -', p)
sys.exit(1 if problems else 0)
