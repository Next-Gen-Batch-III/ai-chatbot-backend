import app from "../app.js";
import { env } from "../configs/env.js";

const testCases = [
  {
    name: "Document embedding",
    body: {
      text: "Students must submit their project before August 30.",
      inputType: "document",
      title: "Project submission",
    },
  },
  {
    name: "Query embedding",
    body: {
      text: "What is Git?",
      inputType: "query",
    },
  },
];

const server = await new Promise((resolve, reject) => {
  const instance = app.listen(0);
  instance.once("listening", () => resolve(instance));
  instance.once("error", reject);
});

try {
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  const testResponse = await fetch(`${baseUrl}/test`);
  if (!testResponse.ok) {
    throw new Error(`/test returned ${testResponse.status}`);
  }

  for (const { name, body } of testCases) {
    for (const path of ["/api/embeddings", "/api/v1/embeddings"]) {
      const response = await fetch(`${baseUrl}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();

      if (
        !response.ok ||
        data.dimension !== env.embeddingDimension ||
        !Array.isArray(data.embedding) ||
        !data.embedding.every(Number.isFinite)
      ) {
        throw new Error(`${name} at ${path} failed: ${JSON.stringify(data)}`);
      }

      console.log(`${name} at ${path}: passed (${data.dimension} dimensions)`);
    }
  }
} finally {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

console.log("All embedding tests passed");
