# SkillGraph — Wexa AI Assessment

## 1. Project Goal

Build a SkillGraph application using Next.js and CognoDB.

The application connects:

- Companies
- Jobs
- Skills
- Related skills

The user can select skills they know, discover matching jobs, view skill gaps, and explore skill relationships through the graph.

---

## 2. Technology Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- CognoDB
- Neo4j JavaScript Driver
- Cypher

---

## 3. Project Structure

Current important structure:

Wexa_AI_Assessment/
├── app/
│ ├── api/
│ │ ├── graph/
│ │ │ └── route.ts
│ │ └── jobs/
│ │ ├── route.ts
│ │ └── [id]/
│ │ └── route.ts
│ │
│ ├── jobs/
│ │ └── [id]/
│ │ └── page.tsx
│ │
│ ├── globals.css
│ ├── layout.tsx
│ └── page.tsx
│
├── lib/
│ └── db.ts
│
├── scripts/
│ ├── test-connection.ts
│ └── seed.ts
│
├── public/
├── docs/
│ └── PROJECT_NOTES.md
├── .env.local
├── .gitignore
├── package.json
├── package-lock.json
├── next.config.ts
└── tsconfig.json

.env.local contains database credentials and must never be committed.

---

## 4. Database Setup

A CognoDB instance has been created and connected successfully.

The project uses the Neo4j JavaScript driver to communicate with CognoDB.

Environment variables:

- COGNODB_URI
- COGNODB_USER
- COGNODB_PASSWORD

The database connection was verified successfully.

The database was also tested directly through the CognoDB UI.

---

## 5. Graph Data Model

### Nodes

- Company
- Job
- Skill

### Relationships

- Company -[:POSTED]-> Job
- Job -[:REQUIRES]-> Skill
- Skill -[:RELATED_TO]-> Skill

Conceptually:

Company
|
| POSTED
v
Job
|
| REQUIRES
v
Skill
|
| RELATED_TO
v
Skill

The graph allows the application to connect companies to jobs, jobs to required skills, and skills to related skills.

---

## 6. Seed Data

A seed script exists at:

scripts/seed.ts

The seed creates:

- Companies
- Jobs
- Skills
- Company → Job relationships
- Job → Skill relationships
- Skill → Skill relationships

Current example companies:

- Acme Technologies
- TechNova
- CloudPeak

Current example jobs:

- Frontend Engineer
- React Developer
- Full Stack Engineer

Current example skills:

- JavaScript
- TypeScript
- React
- Next.js
- Node.js
- GraphQL
- CSS
- Jest

The seed uses MERGE to avoid intentionally creating duplicate entities based on the same properties.

The seed can be run using:

npm run seed

---

## 7. CognoDB / Cypher Concepts Learned

### CREATE

Creates nodes or relationships.

Example:

CREATE (p:Person {name: "Pranav"})

### MATCH

Finds existing nodes and relationships.

Example:

MATCH (n)
RETURN n

### MERGE

Finds an existing pattern or creates it if it does not exist.

### Relationships

Example:

CREATE (p)-[:KNOWS]->(s)

### Properties

Example:

CREATE (s:Skill {name: "React"})

### Parameterized Queries

Application queries use parameters instead of directly inserting user input into Cypher.

Example:

WHERE skill.name IN $skills

The values are passed separately from the query.

---

## 8. API Routes

### Job Search API

GET /api/jobs?skills=React,TypeScript

The endpoint:

1. Reads selected skills.
2. Finds jobs that require those skills.
3. Finds the company that posted each job.
4. Calculates matched skills.
5. Calculates missing skills.
6. Calculates a basic match percentage.
7. Returns the results to the frontend.

The response contains:

- Job information
- Company
- Required skills
- Matched skills
- Missing skills
- Match percentage

### Individual Job API

GET /api/jobs/:id

Example:

GET /api/jobs/19

Returns information about an individual job, including its company and required skills.

### Skill Graph API

GET /api/graph?skill=React

The endpoint performs a two-hop graph traversal and returns skill paths.

Example result:

{
"skill": "React",
"paths": [
["React", "TypeScript", "JavaScript"],
["React", "TypeScript", "Node.js"],
["React", "Next.js", "TypeScript"]
]
}

---

## 9. Multi-Hop Graph Traversal

A two-hop traversal was successfully tested directly in CognoDB.

The query traverses:

Skill
↓
Related Skill
↓
Related Skill

Example:

React
↓
TypeScript
↓
Node.js

Another example:

React
↓
Next.js
↓
TypeScript

The application uses these paths to show indirect skill connections.

---

## 10. Job Matching Logic

The current matching algorithm is intentionally simple and transparent.

Formula:

matched required skills / total required skills × 100

Example:

User skills:

- React
- TypeScript

Job requirements:

- React
- TypeScript
- JavaScript
- CSS

Calculation:

2 / 4 × 100 = 50%

The application also identifies missing skills.

Example:

Matched:

- React
- TypeScript

Missing:

- JavaScript
- CSS

The match percentage represents the percentage of the job's required skills that match the user's selected skills.

It is not presented as an AI prediction.

---

## 11. Frontend Features Completed

The homepage currently supports:

- Skill selection
- Skill deselection
- Job search
- Job recommendation cards
- Match percentage
- Matched skills
- Missing skills
- Job detail navigation
- Skill graph exploration

---

## 12. Job Details Page

Job detail pages are available at:

/jobs/[id]

Example:

/jobs/19

The page currently displays:

- Company
- Job title
- Location
- Work mode
- Experience
- Required skills
- User skill match
- Matched skills
- Skills to develop
- Skill graph paths

Selected skills are passed through the URL so the details page can calculate the personalized match.

Example:

/jobs/19?skills=React,TypeScript

---

## 13. Current User Flow

Homepage
↓
User selects skills
↓
Find matching jobs
↓
Next.js API
↓
Cypher query
↓
CognoDB
↓
Company → Job → Skill
↓
Job recommendations
↓
User opens a job
↓
Job details
↓
Skill match + missing skills
↓
Skill graph exploration
↓
Two-hop skill paths

This provides an end-to-end user → API → graph database → API → UI flow.

---

## 14. Important Implementation Decisions

### Why Next.js?

Next.js provides the frontend and server-side API layer in the same application.

This allows the project to use one framework for UI, routing, API endpoints, and server-side functionality.

### Why CognoDB?

The core domain contains naturally connected entities:

Company → Job → Skill → Related Skill

The skill-to-skill relationships allow the application to traverse the graph and discover indirect connections.

### Why Parameterized Cypher?

User-provided values are passed as Cypher parameters instead of being concatenated directly into query strings.

### Why RELATED_TO?

Skills can have relationships with other skills.

For example:

React → TypeScript
TypeScript → Node.js

This allows the application to explore possible skill connections beyond direct job requirements.

---

## 15. Git Checkpoint

The core MVP has been committed and pushed to GitHub.

Main MVP commit:

Build core SkillGraph MVP

A documentation checkpoint is also being maintained.

Sensitive database credentials are kept in .env.local and are not committed.

---

## 16. Current Status

### Completed

- [x] Next.js project
- [x] CognoDB instance
- [x] Database connection
- [x] Graph model
- [x] Seed script
- [x] Seed data
- [x] Job search API
- [x] Match percentage
- [x] Missing skills
- [x] Job details API
- [x] Job details page
- [x] Skill graph API
- [x] Two-hop traversal
- [x] Skill graph UI
- [x] GitHub repository
- [x] Project documentation started

### Remaining — 3 Major Phases

- [ ] Code quality and technical cleanup
- [ ] UI polish and final assignment requirements
- [ ] Submission preparation, deployment, and interview preparation

---

## 17. Interview Preparation

After the application is complete, prepare answers based on the actual implementation.

Topics include:

- Why Next.js?
- Why CognoDB?
- Why a graph database instead of a relational database?
- Explain the graph data model.
- Explain nodes, labels, properties, and relationships.
- Explain CREATE, MATCH, and MERGE.
- Explain parameterized Cypher.
- Explain the two-hop traversal.
- Explain the job matching algorithm.
- Explain match percentage.
- Explain Server Components vs Client Components.
- Explain the API architecture.
- Explain how the application could scale.
- Explain limitations and possible production improvements.

---

## 18. Development Approach

The project is being developed in this order:

Core functionality
↓
Code quality
↓
UI polish
↓
Assignment verification
↓
README and final documentation
↓
Deployment
↓
Submission
↓
Interview preparation

The goal is to complete a working submission first and then use the actual completed implementation to prepare for the interview.
