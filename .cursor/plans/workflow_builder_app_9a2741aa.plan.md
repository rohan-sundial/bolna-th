---
name: Workflow Builder App
overview: Build a visual flow builder SPA with React + TypeScript + React Flow. Features include a dashboard to manage workflows, a canvas to build flows with nodes/edges, inline editing, validation, and JSON export. Data persists to localStorage. Phased implementation for clean, atomic commits.
todos:
  - id: phase-1
    content: "Phase 1: Project scaffolding - Vite + React + TS + Tailwind with Claude palette"
    status: completed
  - id: phase-2
    content: "Phase 2: Routing and layout shell - React Router, RootLayout, Sidebar placeholder, routes"
    status: completed
  - id: phase-3
    content: "Phase 3: Auth hook and app initialization - useAuth, AuthContext, loading state"
    status: completed
  - id: phase-4
    content: "Phase 4: Sidebar component - Nav item, active state, styling"
    status: completed
  - id: phase-5
    content: "Phase 5: Flows list page static UI - Header, cards, empty state"
    status: completed
  - id: phase-6
    content: "Phase 6: LocalStorage service and CRUD - Storage abstraction, create/delete wiring"
    status: completed
  - id: phase-7
    content: "Phase 7: Builder page shell - Header with inline edit, JSON panel placeholder, layout"
    status: completed
  - id: phase-8
    content: "Phase 8: React Flow basic canvas - Integration, Zustand store, pan/zoom/drag"
    status: completed
  - id: phase-9
    content: "Phase 9: Node types and library - Start/Action/Condition nodes, floating palette"
    status: completed
  - id: phase-10
    content: "Phase 10: Edges and connections - Custom edge with labels, connection handling"
    status: completed
  - id: phase-11
    content: "Phase 11: Node sidebar editing - Edit ID, description, manage edges"
    status: completed
  - id: phase-12
    content: "Phase 12: JSON preview panel - Live export, syntax highlighting"
    status: completed
  - id: phase-13
    content: "Phase 13: Validation - Panel with error list, inline node indicators, real-time validation"
    status: completed
  - id: phase-14
    content: "Phase 14: Import JSON - Reconstruct flow from exported JSON with auto-layout"
    status: completed
isProject: false
---

# Workflow Builder - Detailed Implementation Plan

## Architecture Overview

```mermaid
graph TB
    subgraph app [Application Layer]
        App[App.tsx]
        AuthProvider[AuthProvider]
        RouterProvider[RouterProvider]
    end

    subgraph pages [Pages]
        FlowsPage["/flows - Dashboard"]
        BuilderPage["/flows/:id - Builder"]
    end

    subgraph layout [Layout Components]
        RootLayout[RootLayout]
        Sidebar[Sidebar]
        MainContent[MainContent]
    end

    subgraph builder [Builder Components]
        Canvas[ReactFlow Canvas]
        NodeSidebar[Node Edit Sidebar]
        JSONPanel[JSON Preview Panel]
        NodeLibrary[Component Library]
    end

    subgraph state [State Management]
        WorkflowStore[Zustand Store]
        LocalStorage[localStorage Service]
    end

    App --> AuthProvider
    AuthProvider --> RouterProvider
    RouterProvider --> RootLayout
    RootLayout --> Sidebar
    RootLayout --> MainContent
    MainContent --> FlowsPage
    MainContent --> BuilderPage
    BuilderPage --> Canvas
    BuilderPage --> NodeSidebar
    BuilderPage --> JSONPanel
    BuilderPage --> NodeLibrary
    Canvas --> WorkflowStore
    WorkflowStore --> LocalStorage
```



## Data Model

```typescript
// src/types/workflow.ts

type NodeId = string;
type EdgeId = string;
type WorkflowId = string;

interface Position {
  x: number;
  y: number;
}

interface WorkflowNode {
  id: NodeId;
  type: 'start' | 'default';
  label: string;
  description: string;
  position: Position;
}

interface WorkflowEdge {
  id: EdgeId;
  source: NodeId;
  target: NodeId;
  condition: string;
}

interface Workflow {
  id: WorkflowId;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface ValidationError {
  field: string;
  nodeId?: NodeId;
  edgeId?: EdgeId;
  message: string;
}
```

## Folder Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── RootLayout.tsx
│   │   ├── Sidebar.tsx
│   │   └── MainContent.tsx
│   ├── flows/
│   │   ├── WorkflowCard.tsx
│   │   ├── WorkflowGrid.tsx
│   │   └── EmptyState.tsx
│   ├── builder/
│   │   ├── BuilderCanvas.tsx
│   │   ├── NodeSidebar.tsx
│   │   ├── JSONPreviewPanel.tsx
│   │   ├── NodeLibrary.tsx
│   │   ├── nodes/
│   │   │   ├── StartNode.tsx
│   │   │   └── DefaultNode.tsx
│   │   └── edges/
│   │       └── ConditionalEdge.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── InlineEdit.tsx
│       └── ErrorMessage.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useWorkflow.ts
│   └── useValidation.ts
├── lib/
│   ├── storage.ts
│   ├── validation.ts
│   └── utils.ts
├── pages/
│   ├── FlowsPage.tsx
│   └── BuilderPage.tsx
├── store/
│   └── workflowStore.ts
├── types/
│   └── workflow.ts
├── App.tsx
├── main.tsx
└── index.css
```

---

## Phase 1: Project Scaffolding

**Goal:** Initialize the project with Vite, React, TypeScript, and Tailwind CSS v4 with a Claude-inspired color palette.

**Files to create/modify:**

- `package.json` - dependencies (renamed to "workflow-builder")
- `vite.config.ts` - Vite configuration
- `postcss.config.js` - PostCSS with `@tailwindcss/postcss`
- `src/index.css` - Tailwind v4 import + `@theme` for custom colors
- `src/main.tsx` - Entry point
- `src/App.tsx` - Minimal shell
- `index.html` - Updated title to "Workflow Builder"

**Tailwind v4 CSS-based configuration:**

```css
/* src/index.css */
@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700&display=swap');

@theme {
  --color-cream-50: #FDFBF7;
  --color-cream-100: #FAF6EE;
  --color-cream-200: #F5EDE0;
  --color-cream-300: #E8DCC8;

  --color-clay-400: #C4A77D;
  --color-clay-500: #B8956C;
  --color-clay-600: #A67C52;

  --color-terracotta-500: #D4785C;
  --color-terracotta-600: #C4603D;
  --color-terracotta-700: #A84E32;

  --color-charcoal-700: #4A4540;
  --color-charcoal-800: #353330;
  --color-charcoal-900: #1F1E1C;

  --font-family-sans: 'Work Sans', system-ui, sans-serif;
}
```

**Commands:**

```bash
npm install -D tailwindcss postcss autoprefixer @tailwindcss/postcss
```

---

## Phase 2: Routing and Layout Shell

**Goal:** Set up React Router with root layout containing sidebar placeholder and content area.

**Dependencies:** `react-router-dom`

**Files:**

- `src/App.tsx` - Router setup using `createBrowserRouter`
- `src/components/layout/RootLayout.tsx` - Sidebar placeholder + MainContent
- `src/components/layout/MainContent.tsx` - Wraps `<Outlet />` in `<main>`
- `src/pages/FlowsPage.tsx` - Placeholder
- `src/pages/BuilderPage.tsx` - Placeholder with `useParams` for workflow ID

**Router structure (modern data router API):**

```typescript
// src/App.tsx
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/flows" replace />,
      },
      {
        path: 'flows',
        element: <FlowsPage />,
      },
      {
        path: 'flows/:id',
        element: <BuilderPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}
```

**Routing decisions:**

- `/` → `/flows`: Uses `replace` (not `push`) because `/` isn't a real page, prevents back-button loop
- All other navigation: Uses `push` (default behavior of `<Link>` and `navigate()`)

**Layout structure:**

```
┌──────────────────────────────────────────┐
│ RootLayout                               │
│ ┌────────┬──────────────────────────────┐│
│ │Sidebar │  MainContent (Outlet)        ││
│ │        │                              ││
│ │        │                              ││
│ └────────┴──────────────────────────────┘│
└──────────────────────────────────────────┘
```

---

## Phase 3: Auth Hook and App Initialization

**Goal:** Create dummy auth hook with loading/error states, wrap app in auth context.

**Files:**

- `src/hooks/useAuth.ts` - Dummy auth hook
- `src/context/AuthContext.tsx` - Auth provider
- `src/App.tsx` - Wrap with AuthProvider, show loading

**Types:**

```typescript
interface IUser {
  id: string;
  name: string;
  email: string;
}

interface IAuthState {
  user: IUser | null;
  isLoading: boolean;
  isError: boolean;
}
```

**Naming conventions:**

- Interfaces: `I` prefix (e.g., `IUser`, `IAuthState`)
- Component props: `ComponentNameProps` (e.g., `AuthProviderProps`)

**useAuth behavior:**

```typescript
// Returns after 800ms simulated delay
// Always returns success for now (isError: false)
{
  user: {
    id: 'usr_1234567890',
    name: 'Rohan',
    email: 'rohan@example.com',
  },
  isLoading: false,
  isError: false,
}
```

**Loading screen:** Simple centered spinner with "Initializing..." text on cream background.

---

## Phase 4: Sidebar Component

**Goal:** Build the sidebar with Workflows nav item and active state styling.

**Files:**

- `src/components/layout/Sidebar.tsx` - Full implementation

**Features:**

- App logo/title at top
- "Workflows" nav item with graph icon
- Active state: terracotta background, cream text
- Inactive state: charcoal text, hover effect
- Fixed width (240px)

---

## Phase 5: Flows List Page - Static UI

**Goal:** Build the dashboard page with static UI (no data wiring yet).

**Files:**

- `src/pages/FlowsPage.tsx` - Page layout
- `src/components/flows/FlowsHeader.tsx` - Centered header with title, subtitle, create button
- `src/components/flows/FlowsToolbar.tsx` - Search bar + sort dropdown
- `src/components/flows/WorkflowCard.tsx` - Card component
- `src/components/flows/WorkflowGrid.tsx` - Grid container
- `src/components/flows/EmptyState.tsx` - No workflows state
- `src/components/ui/Button.tsx` - Reusable button

**Page layout:**

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                   Create a workflow                     │  <- centered title
│         Build a custom workflow with ease               │  <- centered subtitle
│                                                         │
│                      [+ Create]                         │  <- centered button
│                                                         │
│  [🔍 Search workflows...        ]  [Sort by ▼]          │  <- search + sort
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │  [icon]  │ │  [icon]  │ │  [icon]  │ │  [icon]  │   │  <- responsive grid
│  │  Name    │ │  Name    │ │  Name    │ │  Name    │   │
│  │  Desc... │ │  Desc... │ │  Desc... │ │  Desc... │   │
│  │          │ │          │ │          │ │          │   │
│  │ created  │ │ created  │ │ created  │ │ created  │   │
│  │ updated  │ │ updated  │ │ updated  │ │ updated  │   │
│  │     user │ │     user │ │     user │ │     user │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**FlowsHeader:**

- Centered layout
- Title: "Create a workflow" (large, bold)
- Subtitle: "Build a custom workflow with ease" (smaller, muted)
- "+ Create" button below (outlined style)

**FlowsToolbar:**

- Left side: Search input (filters by workflow name)
- Right side: Sort dropdown with options:
  - "Last edited" (default) - sorts by updatedAt descending
  - "Date created" - sorts by createdAt descending
- Timestamps include timezone handling

**WorkflowCard content:**

- Icon in top-left (workflow/graph icon in colored circle)
- Workflow name below icon (bold, truncated if long)
- Description below name (smaller text, 1-2 lines, truncated) - mandatory field
- Created date (small, muted) - e.g., "Created: 4 Mar, 16:46"
- Last updated date (small, muted) - e.g., "Updated: 4 Mar, 18:23"
- Creator name (bottom-right, small text)
- Hover: subtle shadow/border lift
- Delete button appears on hover (top-right corner)

---

## Phase 6: Workflow Service and CRUD

**Goal:** Implement a service abstraction for workflow persistence with localStorage implementation, wire up create/delete.

**Architecture:**

The service layer uses dependency inversion - we define an interface (contract) and provide a localStorage implementation. This allows swapping to an API-based implementation later without changing consuming code.

```
┌─────────────────────────────────────────┐
│  Components / Hooks                     │
│  (import workflowService directly)      │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  IWorkflowService (interface/type)      │
│  - All methods return Promises          │
│  - Defines the contract                 │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  localStorageWorkflowService            │
│  (current implementation)               │
│  - Implements the interface             │
│  - Uses localStorage under the hood     │
│  - Returns Promises (for API compat)    │
└─────────────────────────────────────────┘
```

**Files:**

- `src/types/workflow.ts` - Update with service types
- `src/services/workflowService.ts` - Interface + localStorage implementation
- `src/hooks/useWorkflows.ts` - Hook for fetching/listing workflows
- `src/hooks/useCreateWorkflow.ts` - Hook for creating a workflow
- `src/hooks/useUpdateWorkflow.ts` - Hook for updating a workflow
- `src/hooks/useDeleteWorkflow.ts` - Hook for deleting a workflow
- `src/pages/FlowsPage.tsx` - Wire up CRUD using the hooks
- `src/components/flows/DeleteWorkflowDialog.tsx` - Confirmation modal for delete
- `src/App.tsx` - Add Toaster provider

**Dependencies to add:**

```bash
npx shadcn@latest add sonner alert-dialog
```

**Service interface (type, not class):**

```typescript
// src/types/workflow.ts

// Input type for updating a workflow
type UpdateWorkflowInput = Partial<Pick<IWorkflow, 'name' | 'description'>>;

// Service interface - all methods return Promises
type IWorkflowService = {
  getAll: () => Promise<IWorkflow[]>;
  getById: (id: string) => Promise<IWorkflow | null>;
  create: () => Promise<IWorkflow>;  // Creates with defaults
  update: (id: string, input: UpdateWorkflowInput) => Promise<IWorkflow>;
  delete: (id: string) => Promise<void>;
};
```

**localStorage implementation (functional, not class):**

```typescript
// src/services/workflowService.ts
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'flowbuilder_workflows';

// Helper to get current user (from auth context or mock)
const getCurrentUser = () => 'Rohan'; // TODO: wire to auth

export const workflowService: IWorkflowService = {
  getAll: async () => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const workflows = JSON.parse(data) as IWorkflow[];
    // Parse date strings back to Date objects
    return workflows.map(w => ({
      ...w,
      createdAt: new Date(w.createdAt),
      updatedAt: new Date(w.updatedAt),
    }));
  },

  getById: async (id) => {
    const workflows = await workflowService.getAll();
    return workflows.find(w => w.id === id) ?? null;
  },

  create: async () => {
    const workflows = await workflowService.getAll();
    const now = new Date();
    const newWorkflow: IWorkflow = {
      id: uuidv4(),
      name: 'Untitled Workflow',
      description: '',
      createdAt: now,
      updatedAt: now,
      createdBy: getCurrentUser(),
    };
    workflows.push(newWorkflow);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows));
    return newWorkflow;
  },

  update: async (id, input) => {
    const workflows = await workflowService.getAll();
    const index = workflows.findIndex(w => w.id === id);
    if (index === -1) throw new Error(`Workflow ${id} not found`);

    const updated: IWorkflow = {
      ...workflows[index],
      ...input,
      updatedAt: new Date(),
    };
    workflows[index] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows));
    return updated;
  },

  delete: async (id) => {
    const workflows = await workflowService.getAll();
    const filtered = workflows.filter(w => w.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },
};
```

**Hooks (separate concerns):**

Each hook is explicit about what it does. Mutation hooks accept an `onSuccess` callback for coordinating list updates.

```typescript
// src/hooks/useWorkflows.ts - Fetching/listing only
import { useState, useEffect, useCallback } from 'react';
import { workflowService } from '@/services/workflowService';
import { IWorkflow } from '@/types/workflow';

export function useWorkflows() {
  const [workflows, setWorkflows] = useState<IWorkflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWorkflows = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const data = await workflowService.getAll();
      setWorkflows(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch workflows'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  return {
    workflows,
    isLoading,
    error,
    refetch: fetchWorkflows,
  };
}
```

```typescript
// src/hooks/useCreateWorkflow.ts
import { useState, useCallback } from 'react';
import { workflowService } from '@/services/workflowService';
import { IWorkflow } from '@/types/workflow';
import { toast } from 'sonner';

interface UseCreateWorkflowOptions {
  onSuccess?: (workflow: IWorkflow) => void;
}

export function useCreateWorkflow(options?: UseCreateWorkflowOptions) {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createWorkflow = useCallback(async () => {
    try {
      setError(null);
      setIsCreating(true);
      const newWorkflow = await workflowService.create();
      toast.success('Workflow created');
      options?.onSuccess?.(newWorkflow);
      return newWorkflow;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create workflow');
      setError(error);
      toast.error(error.message);
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, [options]);

  return { createWorkflow, isCreating, error };
}
```

```typescript
// src/hooks/useUpdateWorkflow.ts
import { useState, useCallback } from 'react';
import { workflowService } from '@/services/workflowService';
import { IWorkflow, UpdateWorkflowInput } from '@/types/workflow';
import { toast } from 'sonner';

interface UseUpdateWorkflowOptions {
  onSuccess?: (workflow: IWorkflow) => void;
}

export function useUpdateWorkflow(options?: UseUpdateWorkflowOptions) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateWorkflow = useCallback(async (id: string, input: UpdateWorkflowInput) => {
    try {
      setError(null);
      setIsUpdating(true);
      const updated = await workflowService.update(id, input);
      toast.success('Workflow updated');
      options?.onSuccess?.(updated);
      return updated;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update workflow');
      setError(error);
      toast.error(error.message);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [options]);

  return { updateWorkflow, isUpdating, error };
}
```

```typescript
// src/hooks/useDeleteWorkflow.ts
import { useState, useCallback } from 'react';
import { workflowService } from '@/services/workflowService';
import { toast } from 'sonner';

interface UseDeleteWorkflowOptions {
  onSuccess?: (id: string) => void;
}

export function useDeleteWorkflow(options?: UseDeleteWorkflowOptions) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteWorkflow = useCallback(async (id: string) => {
    try {
      setError(null);
      setIsDeleting(true);
      await workflowService.delete(id);
      toast.success('Workflow deleted');
      options?.onSuccess?.(id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete workflow');
      setError(error);
      toast.error(error.message);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  }, [options]);

  return { deleteWorkflow, isDeleting, error };
}
```

**Usage in FlowsPage:**

```typescript
// src/pages/FlowsPage.tsx
export function FlowsPage() {
  const { workflows, isLoading, refetch } = useWorkflows();
  const { createWorkflow, isCreating } = useCreateWorkflow({ onSuccess: refetch });
  const { deleteWorkflow, isDeleting } = useDeleteWorkflow({ onSuccess: refetch });

  // ...
}
```

**Create flow:**

1. User clicks "+ Create" button
2. Call `createWorkflow()` - service uses defaults ('Untitled Workflow', '')
3. Service generates UUID, timestamps, adds createdBy
4. Save to localStorage
5. Navigate to `/flows/[id]` with returned workflow ID

**Delete flow:**

1. User hovers card, clicks delete button
2. Show confirmation dialog (AlertDialog from shadcn)
3. User confirms → call `deleteWorkflow(id)`
4. Service removes from localStorage
5. UI updates via state
6. Toast shows "Workflow deleted"

**Delete confirmation dialog:**

```typescript
// src/components/flows/DeleteWorkflowDialog.tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteWorkflowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflowName: string;
  onConfirm: () => void;
}

export function DeleteWorkflowDialog({
  open,
  onOpenChange,
  workflowName,
  onConfirm,
}: DeleteWorkflowDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete workflow?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{workflowName}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

**Toast setup:**

```typescript
// src/App.tsx - Add Toaster to the app
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      <Toaster position="bottom-right" />
    </>
  );
}
```

**Why Promises for localStorage?**

Even though localStorage is synchronous, we return Promises because:

- Maintains consistent async interface
- Allows easy swap to API implementation later
- Components already handle loading/error states
- No refactoring needed when backend is added

---

## Phase 7: Flow Builder Page - Shell

**Goal:** Build the builder page layout with header, canvas placeholder, and collapsible JSON panel.

**Files:**

- `src/pages/BuilderPage.tsx` - Page layout
- `src/components/builder/BuilderHeader.tsx` - Header with editable name
- `src/components/builder/JSONPreviewPanel.tsx` - Collapsible panel (empty)
- `src/components/ui/InlineEdit.tsx` - Double-click editable text

**Layout:**

```
┌─────────────────────────────────────────────────────────┐
│ [Back] │ Workflow Name (dbl-click to edit) │            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                   Canvas Area                           │
│                   (placeholder)                         │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ ▼ JSON Preview  [collapsed by default]                  │
└─────────────────────────────────────────────────────────┘
```

**Features:**

- Back button → navigate to `/flows`
- Workflow name: double-click → inline input → blur/Enter saves
- Document title syncs with workflow name
- JSON panel: collapsed by default, click header to expand
- Auto-save workflow changes to localStorage

---

## Phase 8: React Flow - Basic Canvas

**Goal:** Integrate React Flow with basic canvas functionality.

**Dependencies:** `@xyflow/react` (React Flow v12)

**Files:**

- `src/components/builder/BuilderCanvas.tsx` - React Flow wrapper component
- `src/pages/BuilderPage.tsx` - Holds nodes/edges state, integrates canvas
- `src/types/workflow.ts` - Add node/edge types

**State management:**

Keep it simple - use `useState` in `BuilderPage` for nodes/edges. No Zustand for now.

```typescript
// In BuilderPage.tsx
const [nodes, setNodes] = useState<Node[]>([]);
const [edges, setEdges] = useState<Edge[]>([]);

// React Flow callbacks
const onNodesChange = useCallback((changes) => {
  setNodes((nds) => applyNodeChanges(changes, nds));
}, []);

const onEdgesChange = useCallback((changes) => {
  setEdges((eds) => applyEdgeChanges(changes, eds));
}, []);
```

**Auto-save:**

- Debounce saves (1-2 seconds after last change) using a `useEffect` watching nodes/edges
- React Flow fires events on every drag pixel, so debouncing is essential
- Use the existing `useUpdateWorkflow` hook - same one used for name/description
- Reuse the existing spinner → checkmark indicator in `BuilderHeader` (via `isUpdating` state)
- No separate "canvas saving" state - one source of truth

**Canvas features:**

- Pan and zoom (built-in)
- Node dragging (built-in)
- Background grid/dots
- Fit view on load

---

## Phase 9: Node Types and Node Library

**Goal:** Create custom node types and a floating library panel to add nodes to the canvas.

**Files:**

- `src/components/builder/nodes/StartNode.tsx` - Start/trigger node component
- `src/components/builder/nodes/ActionNode.tsx` - Generic action/step node component
- `src/components/builder/nodes/ConditionNode.tsx` - Branching node with multiple outputs
- `src/components/builder/nodes/index.ts` - Node type registry
- `src/components/builder/NodeLibrary.tsx` - Floating draggable node palette

**Node types (3):**

1. **Start Node:**
  - Green accent color
  - "Start" label (non-editable)
  - Single output handle (bottom)
  - No input handle (entry point)
  - Only one per workflow (validation in later phase)
2. **Action Node:**
  - Cream/neutral background
  - Editable label (default: "Action")
  - Single input handle (top)
  - Single output handle (bottom)
3. **Condition Node:**
  - Orange/amber accent color
  - Editable label (default: "Condition")
  - Single input handle (top)
  - Multiple output handles (configurable branches)
  - Default outputs: "Yes" and "No" (can add more via sidebar in Phase 11)

**Node Library panel:**

- Floating panel, vertically centered on the left side of the canvas
- Semi-transparent background with subtle shadow
- Contains items: "Start", "Action", "Condition"
- Each item shows icon + label
- Two ways to add nodes:
  1. **Click** - Adds node to the right of the rightmost existing node (or center if empty)
  2. **Drag** - Drop onto canvas at precise position
- Panel can be collapsed/minimized (toggle button)

**Implementation details:**

- Register custom node types with React Flow's `nodeTypes` prop
- Generate unique node IDs with uuid

**Adding nodes - Native HTML5 Drag and Drop (React Flow's recommended approach):**

```tsx
// Library item - both clickable and draggable
<div
  draggable
  onDragStart={(e) => {
    e.dataTransfer.setData('application/reactflow', nodeType);
    e.dataTransfer.effectAllowed = 'move';
  }}
  onClick={() => addNodeAtDefaultPosition(nodeType)}
>
  {label}
</div>

// Canvas wrapper
<div
  onDragOver={(e) => e.preventDefault()}
  onDrop={(e) => {
    const type = e.dataTransfer.getData('application/reactflow');
    const position = reactFlowInstance.screenToFlowPosition({
      x: e.clientX,
      y: e.clientY,
    });
    addNode(type, position);
  }}
>
  <ReactFlow ... />
</div>
```

- `screenToFlowPosition()` converts screen coords to flow coords (handles pan/zoom)
- Click-to-add: calculate position as rightmost node x + offset, or viewport center if empty

---

## Phase 10: Edges and Connections

**Goal:** Enable edge creation between nodes with labels.

**Files:**

- `src/components/builder/edges/DefaultEdge.tsx` - Custom edge with optional label
- `src/components/builder/BuilderCanvas.tsx` - Edge types registration, connection validation

**Edge features:**

- Arrow marker at target
- Optional label displayed on edge (for condition outputs like "Yes"/"No")
- Smooth bezier curve
- Selectable (for deletion)
- Connection validation: prevent invalid connections (e.g., output to output)

**Connection rules:**

- Start node: can only connect from output
- Action node: can receive input, can connect output
- Condition node: can receive input, multiple labeled outputs

---

## Phase 11: Node Sidebar - Editing

**Goal:** Build a floating right sidebar for editing selected node properties.

**Files:**

- `src/components/builder/NodeSidebar.tsx` - Floating sidebar component
- `src/pages/BuilderPage.tsx` - Integrate sidebar, track selected node

**Sidebar style:**

- Floating panel on the right side of the canvas (overlay, doesn't take up space)
- Semi-transparent background with shadow (similar to NodeLibrary panel)
- Appears when a node is selected, disappears when deselected

**Sidebar layout:**

```
┌─────────────────────────┐
│ [icon] Action    [🗑][X] │  <- Header: type icon, type name, delete, close
├─────────────────────────┤
│ ID                      │
│ [abc-123-def] (disabled)│  <- Auto-generated UUID, readonly
│                         │
│ Name                    │
│ [My Action Node    ]    │  <- Editable text input
│                         │
│ Description             │
│ [                  ]    │  <- Editable textarea
│ [                  ]    │
│                         │
│ ─── Condition only ──── │
│ Branches                │
│ [Yes              ] [×] │  <- Editable branch names
│ [No               ] [×] │
│ [+ Add Branch]          │
└─────────────────────────┘
```

**Features:**

- Appears when node is selected (via React Flow's `onSelectionChange` or node click)
- Close button deselects the node
- Delete button removes the node
- ID field: disabled/readonly, shows auto-generated UUID
- Name field: editable text input, updates node data on change
- Description field: editable textarea
- Branches (condition nodes only): list of editable branch names, can add/remove branches

**Implementation notes:**

- Track `selectedNode` state in BuilderPage or useBuilderPageConfig
- Listen to React Flow's selection changes
- Update node data via `setNodes` when fields change
- Changes auto-save via existing useCanvasAutoSave mechanism

---

## Phase 12: JSON Preview Panel

**Goal:** Implement live JSON preview with syntax highlighting.

**Dependencies:** `prism-react-renderer`

**Files:**

- `src/components/builder/JSONPreviewPanel.tsx` - Full implementation
- `src/lib/exportWorkflow.ts` - Convert canvas state to clean export format

**Export format (clean, no positions):**

```typescript
interface ExportedWorkflow {
  name: string;
    description: string;
  nodes: ExportedNode[];
  edges: ExportedEdge[];
}

type ExportedNode =
  | { id: string; type: 'start';     data: {} }
  | { id: string; type: 'action';    data: { label: string; description: string; prompt: string } }
  | { id: string; type: 'condition'; data: { label: string; description: string; prompt: string; branches: string[] } };

interface ExportedEdge {
    id: string;
    source: string;
    target: string;
  sourceHandle: string | null;
  label: string | null;
}
```

```

**Design decision:** Export is clean/minimal without node positions. On import, auto-layout (dagre) reconstructs positioning. This prioritizes readability over preserving manual layout.

**Features:**

- Collapsible/expandable panel (bottom or side)
- Syntax highlighted JSON via prism-react-renderer
- Line numbers
- Copy to clipboard button
- Updates live as user edits the canvas

---

## Phase 13: Validation and Error Display

**Goal:** Implement real-time validation with a dedicated validation panel and inline node indicators.

### Validation Panel (above JSON panel)

**Location:** Positioned above the JSON Preview panel in BuilderPage

**UI Features:**
- Expandable/collapsible (click header to toggle)
- Resizable with localStorage persistence (same pattern as JSON panel)
- Header shows: "X validation errors" or "0 validation errors"
- No copy button needed
- No separate expand/collapse button (just click header)

**Interaction:**
- Click on any error row → selects the node on canvas AND opens its sidebar panel
- Real-time updates as user edits

### Inline Node Indicators

**Visual:**
- Error icon/badge on nodes that have validation errors
- Small red indicator (e.g., alert circle icon)

**Interaction:**
- Hover on error icon → shows tooltip with error details for that specific node
- Click on error icon → opens node sidebar for editing

### Validation Rules

| Rule | Applies To |
|------|------------|
| Node IDs must be unique | All nodes |
| Start node must exist | Workflow |
| Start node must have ≥1 outgoing connection | Start node |
| `prompt` field is required | Action, Condition nodes |
| `description` field is required | Action, Condition nodes |
| Action node must have ≥1 incoming connection | Action nodes |
| Condition node must have ≥1 incoming connection | Condition nodes |
| Condition node must have ≥2 outgoing connections (for branches) | Condition nodes |
| Node must be reachable from Start (not orphaned) | All nodes except Start |

**Note:** All validation issues are errors (no warnings). Action nodes can be terminal (no outgoing connection required).

### Files

- `src/lib/validation.ts` - Validation functions and types
- `src/hooks/builder/useValidation.ts` - Hook to run validation (real-time, memoized)
- `src/components/builder/ValidationPanel.tsx` - The validation summary panel
- `src/components/builder/nodes/*.tsx` - Add error indicator to node components
- `src/pages/BuilderPage.tsx` - Integrate ValidationPanel

### Implementation Steps

1. Create validation types and functions in `src/lib/validation.ts`
2. Create `useValidation` hook that takes nodes/edges and returns validation results
3. Create `ValidationPanel` component (similar structure to JSONPreviewPanel)
4. Add error indicator to node components (StartNode, ActionNode, ConditionNode)
5. Wire up click-to-select-and-open-sidebar functionality
6. Integrate into BuilderPage layout (above JSON panel)

---

## Phase 14: Import JSON

**Goal:** Implement JSON import to reconstruct flows on canvas.

### Already Completed (in earlier phases)
- ✓ Copy JSON (JSON panel)
- ✓ Download JSON (JSON panel)
- ✓ Delete key removes selected node/edge (with confirmation)
- ✓ Disconnected node validation (moved to Phase 13)

### Import JSON Feature

**UI Components:**
- "Import JSON" menu item in BuilderHeader dropdown
- `ImportJSONDialog` modal with:
  - File picker button (styled, hidden native input)
  - Monaco editor (editable) showing JSON content
  - Validation status area (errors list or success indicator)
  - Cancel and Import buttons (Import disabled until valid)

### User Flow

```

1. Click "Import JSON" in header menu
  ↓
2. Modal opens (Monaco empty, Import disabled)
  ↓
3. Click "Choose File" → Select .json file
  ↓
4. JSON loads into Monaco editor
  ↓
5. Auto-validate with Zod (debounced on edit)
  ├── Errors? → Show error list, Import stays disabled
   └── Valid? → Show "Valid" indicator, Import enabled
   ↓
6. User can edit JSON in Monaco to fix errors
  ↓
7. Click "Import"
  ↓
8. Replace workflow nodes/edges, apply auto-layout, fit view
  ↓
9. Modal closes

```

### Zod Schema

```typescript
// Match our export format from exportWorkflow.ts
const ImportedNodeSchema = z.object({
  id: z.string(),
  type: z.enum(['start', 'action', 'condition']),
  data: z.object({
    label: z.string().optional(),
    description: z.string().optional(),
    prompt: z.string().optional(),
    branches: z.array(z.string()).optional(),
  }),
});

const ImportedEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().optional().nullable(),
  data: z.object({
    label: z.string().optional(),
  }).optional(),
});

const ImportedWorkflowSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  nodes: z.array(ImportedNodeSchema),
  edges: z.array(ImportedEdgeSchema),
});
```

### Conversion to React Flow

```typescript
function convertToReactFlow(imported: ImportedWorkflow): { nodes: Node[], edges: Edge[] } {
  // Convert nodes (set position to 0,0 - will be auto-layouted)
  const nodes = imported.nodes.map(n => ({
    id: n.id,
    type: n.type,
    position: { x: 0, y: 0 },
    data: n.data,
  }));

  // Convert edges (add marker, style)
  const edges = imported.edges.map(e => ({
    id: e.id,
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle,
    type: 'labeled',
    data: e.data,
    markerEnd: { type: MarkerType.ArrowClosed, color: '#9a8478' },
    style: { stroke: '#9a8478', strokeWidth: 1.5 },
  }));

  return { nodes, edges };
}
```

### Files


| File                                          | Purpose                                            |
| --------------------------------------------- | -------------------------------------------------- |
| `src/lib/importWorkflow.ts`                   | Zod schemas, validation, conversion functions      |
| `src/components/builder/ImportJSONDialog.tsx` | Modal with file picker, Monaco, validation display |
| `src/components/builder/BuilderHeader.tsx`    | Add "Import JSON" menu item                        |
| `src/pages/BuilderPage.tsx`                   | Add dialog state, handleImport callback            |


### Implementation Steps

1. Install Zod: `npm install zod`
2. Create `src/lib/importWorkflow.ts`:
  - Define Zod schemas
  - Export `validateImport(json: string)` → returns `{ success, data, errors }`
  - Export `convertToReactFlow(data)` → returns `{ nodes, edges }`
3. Create `src/components/builder/ImportJSONDialog.tsx`:
  - File input (hidden) + styled button
  - Monaco editor (editable, json language)
  - Validation status (error list or success)
  - Cancel/Import buttons
4. Update `BuilderHeader.tsx`:
  - Add "Import JSON" to dropdown menu
  - Add `onImport` prop
5. Update `BuilderPage.tsx`:
  - Add `importDialogOpen` state
  - Create `handleImport(nodes, edges)` that replaces workflow, runs auto-layout
  - Wire up dialog

### Completed Implementation

- ✅ Installed Zod for schema validation
- ✅ Created `src/lib/importWorkflow.ts` with Zod schemas and conversion functions
- ✅ Created `src/components/builder/ImportJSONDialog.tsx` with:
  - File picker button
  - Monaco editor (350px height, editable)
  - Real-time validation with debouncing
  - Schema errors panel (scrollable, max-h-24)
  - Workflow issues panel (warnings, don't block import)
  - Cancel/Import buttons
- ✅ Updated `BuilderHeader.tsx` with "Import JSON" menu item
- ✅ Updated `BuilderPage.tsx` with import dialog state and handler
- ✅ Auto-layout applied to imported nodes using dagre
- ✅ Fit view triggered after import

---

## Testing Checklist (Reviewer Script)

Before submission, verify:

- Create 5+ nodes quickly
- Drag nodes around
- Connect edges in multiple directions
- Rename a node ID → edges still valid
- Delete node with edges → edges removed
- Leave description empty → error shown
- Remove start node → validation error
- Import invalid JSON → error message
- Export JSON → valid structure
- Refresh page → data persists

```

```

