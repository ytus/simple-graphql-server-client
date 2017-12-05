import express from "express";
import graphqlHTTP from "express-graphql";
import cors from "cors";

// Error: listen EADDRINUSE :::4000
// ->
// fuser -k 4000/tcp

export const startServer = (path, port, schema, dao, dataLoaders) => {
  const app = express();

  app.use(cors());

  app.use(
    path,
    graphqlHTTP({
      schema,
      context: {
        dao,
        dataLoaders
      },
      rootValue: {},
      graphiql: true
    })
  );

  app.listen(port);
  console.log(`server started at localhost:${port}${path}`);
};
