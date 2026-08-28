import { config } from "dotenv";
import neo4j from "neo4j-driver";

config({ path: ".env.local" });

const uri = process.env.COGNODB_URI;
const user = process.env.COGNODB_USER;
const password = process.env.COGNODB_PASSWORD;

if (!uri || !user || !password) {
  throw new Error("Missing CognoDB credentials in .env.local");
}

const driver = neo4j.driver(
  uri,
  neo4j.auth.basic(user, password)
);

async function seed() {
  const session = driver.session();

  try {
    console.log("Starting database seed...");

    await session.run(`
      MERGE (acme:Company {
        name: "Acme Technologies",
        industry: "Software",
        location: "Bengaluru"
      })

      MERGE (technova:Company {
        name: "TechNova",
        industry: "Technology",
        location: "Hyderabad"
      })

      MERGE (cloudpeak:Company {
        name: "CloudPeak",
        industry: "Cloud Computing",
        location: "Pune"
      })

      MERGE (frontend:Job {
        title: "Frontend Engineer",
        location: "Bengaluru",
        workMode: "Hybrid",
        experience: "2-4 years"
      })

      MERGE (reactDev:Job {
        title: "React Developer",
        location: "Hyderabad",
        workMode: "Remote",
        experience: "1-3 years"
      })

      MERGE (fullstack:Job {
        title: "Full Stack Engineer",
        location: "Pune",
        workMode: "Hybrid",
        experience: "3-5 years"
      })

      MERGE (javascript:Skill {name: "JavaScript"})
      MERGE (typescript:Skill {name: "TypeScript"})
      MERGE (react:Skill {name: "React"})
      MERGE (nextjs:Skill {name: "Next.js"})
      MERGE (nodejs:Skill {name: "Node.js"})
      MERGE (graphql:Skill {name: "GraphQL"})
      MERGE (css:Skill {name: "CSS"})
      MERGE (testing:Skill {name: "Jest"})

      MERGE (acme)-[:POSTED]->(frontend)
      MERGE (technova)-[:POSTED]->(reactDev)
      MERGE (cloudpeak)-[:POSTED]->(fullstack)

      MERGE (frontend)-[:REQUIRES]->(react)
      MERGE (frontend)-[:REQUIRES]->(typescript)
      MERGE (frontend)-[:REQUIRES]->(javascript)
      MERGE (frontend)-[:REQUIRES]->(css)

      MERGE (reactDev)-[:REQUIRES]->(react)
      MERGE (reactDev)-[:REQUIRES]->(javascript)
      MERGE (reactDev)-[:REQUIRES]->(typescript)
      MERGE (reactDev)-[:REQUIRES]->(testing)

      MERGE (fullstack)-[:REQUIRES]->(react)
      MERGE (fullstack)-[:REQUIRES]->(typescript)
      MERGE (fullstack)-[:REQUIRES]->(nodejs)
      MERGE (fullstack)-[:REQUIRES]->(graphql)

      MERGE (react)-[:RELATED_TO]->(javascript)
      MERGE (react)-[:RELATED_TO]->(nextjs)
      MERGE (react)-[:RELATED_TO]->(typescript)

      MERGE (typescript)-[:RELATED_TO]->(javascript)
      MERGE (typescript)-[:RELATED_TO]->(nodejs)

      MERGE (nextjs)-[:RELATED_TO]->(react)
      MERGE (nextjs)-[:RELATED_TO]->(typescript)

      MERGE (nodejs)-[:RELATED_TO]->(javascript)
      MERGE (nodejs)-[:RELATED_TO]->(typescript)

      MERGE (graphql)-[:RELATED_TO]->(nodejs)
      MERGE (jest:Skill {name: "Jest"})-[:RELATED_TO]->(javascript)

      RETURN count(*) AS created
    `);

    console.log("Database seed completed successfully.");
  } catch (error) {
    console.error("Database seed failed:");
    console.error(error);
    process.exitCode = 1;
  } finally {
    await session.close();
    await driver.close();
  }
}

seed();