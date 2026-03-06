# Visual Flow Builder

A visual workflow builder for creating and managing flowcharts with conditional transitions.

## Live Demo

🔗 **[https://bolna-th.vercel.app/](https://bolna-th.vercel.app/)**

📦 **[GitHub Repository](https://github.com/rohan-sundial/bolna-th)**

## Getting Started

```bash
# Clone the repository
git clone https://github.com/rohan-sundial/bolna-th.git
cd bolna-th

# Install dependencies
npm install

# Run development server
npm run dev

# Or build for production
npm run build
npm run preview
```

## Some Features

### Canvas
- ✅ Drag or click to add nodes from library
- ✅ Connect nodes by drawing edges
- ✅ Edge labels
- ✅ Auto-layout with Dagre algorithm
- ✅ Pan/Select interaction modes
- ✅ Delete key removes selected nodes/edges

### Node Details Panel
- ✅ Markdown prompt editor
- ✅ Manage incoming/outgoing connections
- ✅ Condition nodes with dynamic branches

### JSON Preview
- ✅ Live-generated JSON as you edit
- ✅ Syntax highlighting (Monaco Editor)
- ✅ Copy to clipboard
- ✅ Download JSON file

### Validation
- ✅ Required fields validation (name, prompt)
- ✅ Start node existence check
- ✅ Disconnected node warnings
- ✅ Inline error display with click-to-focus
- ✅ Real-time validation panel

### Bonus Features
- ✅ Import JSON to reconstruct flows
- ✅ Multiple workflows with persistent storage (localStorage)
- ✅ Auto-save functionality

## Tech Stack

- **React 19** + **TypeScript**
- **React Flow** - Canvas and node management
- **Tailwind CSS** - Styling
- **Monaco Editor** - JSON preview with syntax highlighting
- **Tiptap** - Rich text editor for descriptions
- **Dagre** - Auto-layout algorithm
- **Vite** - Build tool


## Design Choices

1. **Component Architecture**: Heavy use of custom hooks to separate logic from presentation. Each major feature (validation panel, JSON preview, node details) has its own hook directory with a main config hook composing smaller specialized hooks.

2. **State Management**: React Context for cross-cutting concerns (validation errors), local state for component-specific data, React Flow for canvas state.

3. **Validation**: Real-time validation with a dedicated panel showing all errors. Clicking an error focuses the relevant node on the canvas.

4. **Persistence**: localStorage-based workflow storage with auto-save, allowing multiple workflows to be managed.

5. **UX**: Resizable panels, keyboard shortcuts (Delete to remove), drag-and-drop from node library, and auto-layout for quick organization.

## Screenshots

<!-- Add your screenshots here -->
<!-- ![Flow Builder](./screenshots/builder.png) -->
<!-- ![Workflows List](./screenshots/flows.png) -->
