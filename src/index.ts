import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import * as Express from "express";
import { buildSchema, Resolver, Query } from "type-graphql";
import { createConnection } from "typeorm";
import { RegisterResolver } from "./modules/customer/authResolver";

@Resolver()
class HelloResolver {
  @Query(() => String)
  async helloWorld() {
    return "Hello World!";
  }
}

const main = async () => {
  await createConnection();
  const schema = await buildSchema({
    resolvers: [HelloResolver, RegisterResolver],
  });

  const app = Express();
  const apolloServer = new ApolloServer({ schema });

  

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("server started on http://localhost:4000/graphql");
  });
};

main();
