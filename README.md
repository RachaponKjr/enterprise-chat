# Rust + NestJS + NATS Microservices Starter

## Requirements
- Docker Compose
- Node.js 20+
- pnpm
- Rust / Cargo

## Run
```bash
docker compose up -d
cd apps/chat-service && cargo run
# In a second terminal, from repository root:
cd apps/api-gateway && pnpm install && pnpm start:dev
```

## Test
```bash
curl -X POST http://localhost:3000/chat/send -H 'Content-Type: application/json' -d '{"message":"Hello Rust"}'
curl http://localhost:8080/health
```

Expected POST response:
```json
{"ok":true,"service":"rust-chat","received":{"message":"Hello Rust"}}
```

## Architecture notes
- This is a minimal communication proof-of-concept, not a production chat system.
- NATS request/reply uses Core NATS, not JetStream persistence. JetStream is enabled but not used in this demo.
- Auth and chat Postgres containers are provisioned but not yet wired to services.
- The auth-service folder is reserved for the future NestJS authentication app.
- No JWT, rate limiting, WebSocket, persistent messages, retries or distributed tracing yet.
- Use separate DB credentials, environment variables, TLS, NATS auth, JetStream durable consumers, and an outbox pattern before production.
