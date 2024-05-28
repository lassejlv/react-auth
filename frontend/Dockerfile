FROM oven/bun:latest

WORKDIR /app
COPY . .

RUN bun i --no-save
RUN bun run build


CMD ["bun", "serve.ts"]