import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { AppInitScreen } from "./components/AppInitScreen";
import { RootLayout } from "./components/layout/RootLayout";
import { AuthProvider, useAuthContext } from "./context/AuthContext";
import { BuilderPage } from "./pages/BuilderPage";
import { FlowsPage } from "./pages/FlowsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/flows" replace />,
      },
      {
        path: "flows",
        element: <FlowsPage />,
      },
      {
        path: "flows/:id",
        element: <BuilderPage />,
      },
    ],
  },
]);

function AppContent() {
  const { isError, isLoading } = useAuthContext();

  if (isError) {
    return (
      <AppInitScreen
        variant="error"
        message="Failed to initialize. Please refresh the page."
      />
    );
  }

  if (isLoading) {
    return <AppInitScreen variant="loading" message="Initializing..." />;
  }

  return <RouterProvider router={router} />;
}

function App() {
  return (
    <TooltipProvider delayDuration={300}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
      <Toaster position="bottom-right" />
    </TooltipProvider>
  );
}

export default App;
