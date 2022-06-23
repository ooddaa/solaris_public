import { Mango, } from "mango";

export const engineConfig = {
  username: "neo4j",
  password: "pass",
  ip: "0.0.0.0",
  port: "7687",
  database: "neo4j",
};

export const mango = new Mango({ engineConfig });
