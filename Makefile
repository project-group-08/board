.DEFAULT_GOAL := help

COMPOSE ?= docker compose --project-directory . --profile local -f docker-compose.yml

.PHONY: help build up down logs

help:
	@echo Available commands:
	@echo   make build - build the API Docker image
	@echo   make up    - start containers in the background
	@echo   make down  - stop containers and preserve volumes
	@echo   make logs  - follow container logs

build:
	$(COMPOSE) build

up:
	$(COMPOSE) up -d

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs -f
