import cx from "classnames";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
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

function LoadingScreen() {
  return (
    <div
      className={cx(
        "min-h-screen",
        "flex flex-col items-center justify-center",
        "bg-cream-50",
      )}
    >
      <div
        className={cx(
          "w-8 h-8",
          "border-4 border-cream-300 border-t-terracotta-500",
          "rounded-full animate-spin",
        )}
      />
      <p className={cx("mt-4", "text-charcoal-700 font-medium")}>
        Initializing...
      </p>
    </div>
  );
}

function AppContent() {
  const { isError, isLoading } = useAuthContext();

  if (isError) {
    return (
      <div
        className={cx(
          "min-h-screen",
          "flex items-center justify-center",
          "bg-cream-50",
        )}
      >
        <p className={cx("text-terracotta-600 font-medium")}>
          Failed to initialize. Please refresh the page.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingScreen />;
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
