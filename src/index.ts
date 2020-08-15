import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import * as Express from "express";
import { buildSchema, Resolver, Query } from "type-graphql";
import { AuthResolver } from "./modules/customer/authResolver";
import * as cors from "cors";
import * as session from "express-session";
import * as connectRedis from "connect-redis";
import { redis } from "./redis";
import { connect } from "./config/ormconfig";

@Resolver()
class HelloResolver {
  @Query(() => String)
  async helloWorld() {
    return "Hello World!";
  }
}

const main = async () => {
  // DB connection
  require("dotenv").config();
  await connect();
  const schema = await buildSchema({
    resolvers: [HelloResolver, AuthResolver],
    // resolvers: [__dirname + "modules/**/*.ts"]
  });

  const app = Express();
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }: any) => ({ req }),
  });

  const RedisStore = connectRedis(session);

  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000", // expected frontend IP
    })
  );

  app.use(
    session({
      store: new RedisStore({
        client: redis as any,
      }),
      name: "qid",
      secret: "env_variable_CHANGE!!",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // only works on https
        maxAge: 1000 * 60 * 60 * 24 * 365 * 0.5, // 0.5 years
      },
    })
  );

  apolloServer.applyMiddleware({ app });

  const port = process.env.NODE_PORT;
  app.listen(port, () => {
    console.log(`server started on http://localhost:${port}/graphql`);
  });
};

main();
