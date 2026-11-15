#!/usr/bin/env node
// Каркас репозитория проекта: папки по архитектуре (доска, разделы 3, 5 и 7), package.json пакетов,
// catalog версий в pnpm-workspace.yaml и зависимости фронтенда и бэкенда (NestJS 12, Prisma 7). Код и схему базы не пишет.
// Существующие файлы не перезаписывает, поэтому повторный запуск безопасен.
// Запуск из корня репозитория: node .agents/skills/project-setup/scripts/scaffold.mjs [--no-install]
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "..",
  "..",
);
const args = process.argv.slice(2);
if (args.includes("-h") || args.includes("--help")) {
  console.log(
    "Использование: node .agents/skills/project-setup/scripts/scaffold.mjs [--no-install]\n\n  --no-install  создать папки и файлы, но не ставить зависимости",
  );
  process.exit(0);
}
const NO_INSTALL = args.includes("--no-install");
const unknown = args.filter((a) => a !== "--no-install");
if (unknown.length) fail(`неизвестный параметр: ${unknown.join(" ")}`);

// Структура как на доске: apps/web (раздел 3), packages/contracts (раздел 5), packages/board-engine (раздел 7).
// Модули бэкенда повторяют ресурсы REST из packages/contracts/src/http.
const DIRS = [
  "apps/web/app/(marketing)",
  "apps/web/app/(auth)/login",
  "apps/web/app/(auth)/register",
  "apps/web/app/(app)/w/[workspaceId]/trash",
  "apps/web/app/(app)/settings",
  "apps/web/app/b/[boardId]",
  "apps/web/app/invite/[token]",
  "apps/web/src/_app/providers",
  "apps/web/src/_app/layouts",
  "apps/web/src/_app/styles",
  ...[
    "landing",
    "login",
    "register",
    "workspaces",
    "workspace",
    "trash",
    "settings",
    "board",
    "invite",
  ].map((s) => `apps/web/src/_pages/${s}`),
  "apps/web/src/widgets/app-shell",
  "apps/web/src/features",
  ...["session", "user", "workspace", "board"].map(
    (s) => `apps/web/src/entities/${s}`,
  ),
  ...["api", "ui", "lib", "config", "routes"].map(
    (s) => `apps/web/src/shared/${s}`,
  ),
  ...[
    "auth",
    "workspaces",
    "members",
    "boards",
    "comments",
    "versions",
    "invites",
    "files",
    "ai",
  ].map((s) => `apps/api/src/modules/${s}`),
  "apps/api/src/common",
  "apps/api/prisma",
  "apps/api/test",
  ...["common", "http", "ws", "board", "ai"].map(
    (s) => `packages/contracts/src/${s}`,
  ),
  "packages/board-doc/src",
  ...[
    "model",
    "undo",
    "camera",
    "spatial",
    "ordering",
    "bindings",
    "tools",
    "clipboard",
    "elements",
    "render",
    "text",
    "sync",
  ].map((s) => `packages/board-engine/src/${s}`),
];

// Мажорные версии задаёт архитектура (AGENTS.md, ADR); «latest» значит последнюю версию на момент запуска.
const CATALOG = [
  ["next", "^16"],
  ["react", "^19"],
  ["react-dom", "^19"],
  ["@tanstack/react-query", "^5"],
  ["zustand", "^5"],
  ["zod", "^4"],
  ["react-hook-form", "^7"],
  ["@hookform/resolvers", "latest"],
  ["socket.io-client", "^4"],
  ["yjs", "~13.6"],
  ["y-protocols", "^1"],
  ["typescript", "~6.0"],
  ["@types/node", "^24"],
  ["@types/react", "^19"],
  ["@types/react-dom", "^19"],
  ["tailwindcss", "^4"],
  ["@tailwindcss/postcss", "^4"],
  ["postcss", "^8"],
  ["oxlint", "latest"],
  ["oxfmt", "latest"],
  ["steiger", "latest"],
  ["@feature-sliced/steiger-plugin", "latest"],
  ["vitest", "latest"],
  ["jsdom", "latest"],
  ["@testing-library/react", "latest"],
  ["@testing-library/dom", "latest"],
  ["@testing-library/user-event", "latest"],
  ["@vitejs/plugin-react", "latest"],
  ["msw", "latest"],
  // бэкенд: NestJS 12 (ADR-0009)
  ["@nestjs/common", "^12"],
  ["@nestjs/core", "^12"],
  ["@nestjs/platform-express", "^12"],
  ["@nestjs/platform-socket.io", "^12"],
  ["@nestjs/websockets", "^12"],
  ["@nestjs/swagger", "^12"],
  ["@nestjs/config", "^12"],
  ["@nestjs/bullmq", "^12"],
  ["@nestjs/testing", "^12"],
  ["@nestjs/cli", "^12"],
  ["socket.io", "^4"],
  ["bullmq", "^6"],
  ["reflect-metadata", "^0.2"],
  ["rxjs", "^7"],
  // Prisma 7: у CLI метка latest указывает на 8.0 RC, поэтому мажор задаём явно
  ["prisma", "^7"],
  ["@prisma/client", "^7"],
];
// Бета-инструменты закрепляем точно (ADR-0007), TypeScript и Yjs держим в пределах минорной ветки.
const EXACT = new Set([
  "oxlint",
  "oxfmt",
  "steiger",
  "@feature-sliced/steiger-plugin",
]);
const TILDE = new Set(["typescript", "yjs"]);
// Пакеты со скриптами установки, которые известны заранее (pnpm allowBuilds): нативным модулям и Prisma скрипт нужен,
// телеметрии (@scarf/scarf приходит со Swagger) и MSW нет.
const ALLOW_BUILDS = [
  ["esbuild", true],
  ["sharp", true],
  ["msw", false],
  ["prisma", true],
  ["@prisma/engines", true],
  ["msgpackr-extract", true],
  ["@scarf/scarf", false],
];

const pkg = (name, deps, devDeps, extra = {}) => ({
  name,
  version: "0.0.0",
  private: true,
  ...extra,
  dependencies: Object.fromEntries(
    deps.map((d) => [d, d.startsWith("@tabula/") ? "workspace:*" : "catalog:"]),
  ),
  devDependencies: Object.fromEntries(devDeps.map((d) => [d, "catalog:"])),
});
const PACKAGES = {
  "apps/web/package.json": pkg(
    "@tabula/web",
    [
      "@hookform/resolvers",
      "@tabula/board-engine",
      "@tabula/contracts",
      "@tanstack/react-query",
      "next",
      "react",
      "react-dom",
      "react-hook-form",
      "socket.io-client",
      "y-protocols",
      "yjs",
      "zod",
      "zustand",
    ],
    [
      "@feature-sliced/steiger-plugin",
      "@tailwindcss/postcss",
      "@testing-library/dom",
      "@testing-library/react",
      "@testing-library/user-event",
      "@types/node",
      "@types/react",
      "@types/react-dom",
      "@vitejs/plugin-react",
      "jsdom",
      "msw",
      "postcss",
      "steiger",
      "tailwindcss",
      "typescript",
      "vitest",
    ],
  ),
  "apps/api/package.json": pkg(
    "@tabula/api",
    [
      "@nestjs/bullmq",
      "@nestjs/common",
      "@nestjs/config",
      "@nestjs/core",
      "@nestjs/platform-express",
      "@nestjs/platform-socket.io",
      "@nestjs/swagger",
      "@nestjs/websockets",
      "@prisma/client",
      "@tabula/board-doc",
      "@tabula/contracts",
      "bullmq",
      "reflect-metadata",
      "rxjs",
      "socket.io",
      "y-protocols",
      "yjs",
      "zod",
    ],
    [
      "@nestjs/cli",
      "@nestjs/testing",
      "@types/node",
      "prisma",
      "typescript",
      "vitest",
    ],
  ),
  "packages/contracts/package.json": pkg(
    "@tabula/contracts",
    ["zod"],
    ["typescript"],
    { type: "module" },
  ),
  "packages/board-doc/package.json": pkg(
    "@tabula/board-doc",
    ["@tabula/contracts", "yjs"],
    ["typescript", "vitest"],
    { type: "module" },
  ),
  "packages/board-engine/package.json": pkg(
    "@tabula/board-engine",
    ["@tabula/board-doc", "@tabula/contracts", "yjs"],
    ["typescript", "vitest"],
    { type: "module" },
  ),
};
const GITIGNORE = [
  "node_modules/",
  ".next/",
  "out/",
  "dist/",
  "coverage/",
  ".turbo/",
  "*.log",
  ".DS_Store",
  ".env",
  ".env.*",
  "!.env.example",
];

const isWin = process.platform === "win32";
const pnpm = (argv, opts = {}) =>
  spawnSync("pnpm", argv, {
    cwd: ROOT,
    encoding: "utf8",
    shell: isWin,
    ...opts,
  });
const at = (p) => join(ROOT, p);

function fail(msg) {
  console.error(`\nОшибка: ${msg}`);
  process.exit(1);
}

function writeIfMissing(path, content) {
  if (existsSync(at(path))) {
    console.log(`  пропущено: ${path} уже есть, не трогаю`);
    return false;
  }
  writeFileSync(at(path), content);
  console.log(`  создан: ${path}`);
  return true;
}

function cmpVersions(a, b) {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) if (pa[i] !== pb[i]) return pa[i] - pb[i];
  return 0;
}

function resolveVersion(name, range) {
  const r = pnpm(["view", `${name}@${range}`, "version", "--json"]);
  if (r.status !== 0 || !r.stdout.trim())
    fail(
      `не удалось узнать версию ${name}@${range}: ${(r.stderr || "").trim().split("\n").pop()}`,
    );
  const parsed = JSON.parse(r.stdout);
  const list = (Array.isArray(parsed) ? parsed : [parsed])
    .filter((v) => /^\d+\.\d+\.\d+$/.test(v))
    .sort(cmpVersions);
  if (!list.length) fail(`для ${name}@${range} нет стабильной версии`);
  return list.at(-1);
}

const quote = (s) => `'${String(s).replace(/'/g, "''")}'`;

// ---------------------------------------------------------------- проверки
console.log("==> Проверка инструментов");
const [major, minor] = process.versions.node.split(".").map(Number);
// Node 24 по архитектуре: в Node 25 и новее нет corepack, а @types/node в catalog от 24.
if (major !== 24 || minor < 15)
  fail(
    `нужен Node.js 24, не ниже 24.15, сейчас ${process.versions.node}. Переключитесь: nvm install 24 && nvm use 24`,
  );
if (!existsSync(at("AGENTS.md")))
  fail(
    "скрипт должен лежать в .agents/skills/project-setup/scripts репозитория проекта (рядом нет AGENTS.md)",
  );
const pv = pnpm(["--version"]);
if (pv.status !== 0)
  fail(
    "pnpm не найден. Включите его командой corepack enable pnpm или поставьте: https://pnpm.io/installation",
  );
const PNPM_VERSION = pv.stdout.trim();
if (Number(PNPM_VERSION.split(".")[0]) < 12)
  fail(`нужен pnpm 12 или новее, сейчас ${PNPM_VERSION}`);
console.log(`  Node.js ${process.versions.node}, pnpm ${PNPM_VERSION}`);

// ---------------------------------------------------------------- папки
console.log("==> Папки");
let created = 0;
for (const d of DIRS) {
  if (!existsSync(at(d))) created++;
  mkdirSync(at(d), { recursive: true });
}
let kept = 0;
for (const d of DIRS) {
  if (readdirSync(at(d)).length === 0) {
    writeFileSync(at(`${d}/.gitkeep`), "");
    kept++;
  }
}
console.log(`  создано папок: ${created}, пустым добавлен .gitkeep: ${kept}`);

// ---------------------------------------------------------------- файлы
console.log("==> Файлы");
if (!existsSync(at("pnpm-workspace.yaml"))) {
  console.log("  подбираю версии в реестре npm");
  const lines = [
    "packages:",
    "  - 'apps/*'",
    "  - 'packages/*'",
    "",
    '# Версии всех зависимостей задаёт catalog: в package.json пишем "catalog:" (правило в AGENTS.md).',
    "catalog:",
  ];
  for (const [name, range] of CATALOG) {
    const v = resolveVersion(name, range);
    const spec = EXACT.has(name) ? v : TILDE.has(name) ? `~${v}` : `^${v}`;
    lines.push(`  ${quote(name)}: ${quote(spec)}`);
    console.log(`    ${name} ${spec}`);
  }
  lines.push(
    "",
    "# Скрипты установки разрешены только перечисленным пакетам (true), остальным запрещены (false).",
    "allowBuilds:",
  );
  for (const [name, allow] of ALLOW_BUILDS)
    lines.push(`  ${quote(name)}: ${allow}`);
  writeIfMissing("pnpm-workspace.yaml", `${lines.join("\n")}\n`);
} else {
  console.log("  пропущено: pnpm-workspace.yaml уже есть, версии не подбираю");
}
const root = {
  name: "project",
  private: true,
  packageManager: `pnpm@${PNPM_VERSION}`,
  engines: { node: ">=24.15 <25" },
  devDependencies: {
    oxfmt: "catalog:",
    oxlint: "catalog:",
    typescript: "catalog:",
  },
};
writeIfMissing("package.json", `${JSON.stringify(root, null, 2)}\n`);
for (const [path, content] of Object.entries(PACKAGES))
  writeIfMissing(path, `${JSON.stringify(content, null, 2)}\n`);
writeIfMissing(".nvmrc", `${process.versions.node}\n`);
const gi = existsSync(at(".gitignore"))
  ? readFileSync(at(".gitignore"), "utf8")
  : "";
const have = new Set(gi.split(/\r?\n/).map((l) => l.trim()));
const missing = GITIGNORE.filter((l) => !have.has(l));
if (missing.length) {
  writeFileSync(
    at(".gitignore"),
    `${gi}${gi && !gi.endsWith("\n") ? "\n" : ""}${gi ? "\n" : ""}# Каркас\n${missing.join("\n")}\n`,
  );
  console.log(`  .gitignore: добавлено строк ${missing.length}`);
} else {
  console.log("  пропущено: .gitignore уже содержит нужные строки");
}

// ---------------------------------------------------------------- зависимости
if (NO_INSTALL) {
  console.log(
    "\nГотово без установки зависимостей (параметр --no-install). Поставить: pnpm install",
  );
  process.exit(0);
}
console.log("==> Зависимости (pnpm install)");
const inst = spawnSync("pnpm", ["install"], {
  cwd: ROOT,
  stdio: "inherit",
  shell: isWin,
});
if (inst.status !== 0) {
  console.error(
    "\nУстановка не прошла. Если выше ERR_PNPM_IGNORED_BUILDS: pnpm дописал в allowBuilds (pnpm-workspace.yaml) пакеты\n" +
      "со скриптами установки. Поставьте каждому true или false (см. SKILL.md, шаг 3) и запустите pnpm install.",
  );
  process.exit(inst.status ?? 1);
}
console.log(
  "\nКаркас готов. Закоммитьте новые папки, package.json, pnpm-workspace.yaml, .nvmrc, .gitignore и pnpm-lock.yaml.",
);
