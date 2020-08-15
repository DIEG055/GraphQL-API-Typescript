import { createConnection } from "typeorm";

export async function connect() {
  const connection = await createConnection({
    name: "default",
    type: "postgres",
    host: process.env.NODE_DATABASE_HOST || "localhost",
    port: 5432,
    username: process.env.NODE_POSTGRES_USER || "graphql_user",
    password: process.env.NODE_POSTGRES_PASSWORD || "graphql_user",
    database: process.env.NODE_POSTGRES_DB || "graphql_db",
    synchronize: true,
    logging: true,
    entities: ["src/entity/**/*.ts", "dist/entity/**/*.js"],
    migrations: ["src/migration/**/*.ts", "dist/migration/**/*.js"],
    subscribers: ["src/subscriber/**/*.ts", "dist/migration/**/*.js"],
  });
  await connection.synchronize();
  console.log("Database is Connected");
}
