import { Mango, Engine } from "mango";

export const engineConfig = {
  username: "neo4j",
  password: "pass",
  ip: "0.0.0.0",
  port: "7687",
  database: "neo4j",
};

export const config = {
  neo4jUsername: "neo4j",
  neo4jPassword: "pass",
  ip: "0.0.0.0",
  port: "7687",
  database: "neo4j",
};

export const mango = new Mango({ engineConfig });
const engine = new Engine( config );
engine.startDriver();
export { engine }
