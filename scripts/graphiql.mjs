import { serveEncodedDefinition } from "@composedb/devtools-node";

/**
 * Runs GraphiQL server to view & query composites.
 */
const server = await serveEncodedDefinition({
  ceramicURL: "http://localhost:7007",
  graphiql: true,
  path: "./src/__generated__/definition.json",
  port: 5001,
});

// @ts-ignore
console.log(`Server started on ${server.url}`);

process.on("SIGTERM", () => {
  // @ts-ignore
  server.close(() => {
    console.log("Server stopped");
  });
});
