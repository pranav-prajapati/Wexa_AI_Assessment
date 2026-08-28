import neo4j from "neo4j-driver";

const uri = process.env.COGNODB_URI;
const user = process.env.COGNODB_USER;
const password = process.env.COGNODB_PASSWORD;

if (!uri || !user || !password) {
  throw new Error("Missing CognoDB credentials");
}

export const driver = neo4j.driver(
  uri,
  neo4j.auth.basic(user, password)
);