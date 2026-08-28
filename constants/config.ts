// Server Components can't use relative fetch URLs, so route handler calls
// made from the server (e.g. app/jobs/[id]/page.tsx) need an absolute origin.
export const API_BASE_URL = "http://localhost:3000";

export const API_ROUTES = {
  jobs: "/api/jobs",
  graph: "/api/graph",
} as const;
