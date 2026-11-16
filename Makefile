COMPOSE = docker compose -f docker-compose.yml -f docker-compose.local.yml

.PHONY: up down logs

up:
	$(COMPOSE) up --build -d

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs -f