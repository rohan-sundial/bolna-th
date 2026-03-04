# Frontend Assignment

**Tech** Any modern frontend stack. React with TypeScript is common, but all are all fine. You may use any supporting libraries.

---

## **Goal**

You're building a simple visual flow builder — think of it like a lightweight flowchart tool where users connect steps (nodes) with conditional transitions (edges). This mirrors how many modern tools (Zapier, n8n, chatbot builders) work.


## **What to build**
It should be a single-page app where users can visually construct a flow and export it as JSON.

### 1. Canvas

- Add, delete, and drag nodes around
- Connect nodes by drawing edges between them
- Show a label on each edge (the transition condition)
- Visually mark one node as the "start" node

### 2. Node Sidebar
When a user clicks a node, show a panel to:

- Edit the node's name/ID (must be unique)
- Write a description
- Manage outgoing edges — add/remove, pick target node, write condition text

### 3. JSON Preview

- Show the live-generated JSON as the user edits
- Syntax highlight it if you'd like

The app should validate input as the user works and show a live preview of the schema.

---

## **Example of Schema**
Below is an example of schema. You're free to choose and define your own schema.
```
interface Edge {
  to_node_id: string;
  condition: string;
  parameters?: Record<string, string>; // optional key-value pairs
}

interface Node {
  id: string;
  description?: string;
  prompt: string;
  edges: Edge[];
}
```
Your exact structure may vary slightly depending on your implementation.


## Validations
### Basic

- Node IDs must be unique
- Description fields are required
- Starting node must exist
- Show inline errors, not just console warnings


### Bonus

- Import JSON to reconstruct a flow on canvas
- Copy/download JSON
- Delete key removes selected node/edge
- Warn about disconnected nodes
- Allow editing and removing properties at any time and validate the properties.

---

### UI Expectations
- Clean and modern interface
- Clear error messages and visual feedback when validation fails
- Easy, intuitive flow so users can figure it out without instructions


## **Deliverables**

- A hosted working version (Vercel, Netlify, CodeSandbox, Replit, or similar)
- A clean and readable codebase
- A short README explaining how to run the project and design choices
- Optional screenshots or a short demo video

## Submissions
**Please mail a zip file with the code and send a link to the hosted version to [<ins>`sse+submissions@bolna.ai`</ins>](mailto:sse+submissions@bolna.ai).**
