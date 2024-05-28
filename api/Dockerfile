FROM oven/bun:latest

WORKDIR /app
COPY . .

RUN bun i --no-save
RUN bun build src/index.ts --compile --outfile build/server

CMD [ "./build/server" ]