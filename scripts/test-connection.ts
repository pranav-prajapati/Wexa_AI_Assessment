import { config } from "dotenv";
import neo4j from "neo4j-driver";

config({ path: ".env.local" });

const uri = process.env.COGNODB_URI;
const user = process.env.COGNODB_USER;
const password = process.env.COGNODB_PASSWORD;

if (!uri || !user || !password) {
  throw new Error("Missing CognoDB credentials in .env.local");
}

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

async function main() {
  const session = driver.session();

  try {
    const result = await session.run(
      'CREATE (p:Person {name: $name}) RETURN p',
      { name: "Test Person" }
    );

    const createdNode = result.records[0].get("p");
    console.log("Connection successful. Created node:");
    console.log(createdNode.properties);
  } catch (error) {
    console.error("Failed to connect or run query:");
    console.error(error);
  } finally {
    await session.close();
    await driver.close();
  }
}

main();