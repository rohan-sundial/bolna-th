import { Play, Zap, GitBranch } from "lucide-react";

export interface NodeData {
  label?: string;
  description?: string;
  prompt?: string;
  branches?: string[];
}

export const nodeTypeStyles: Record<
  string,
  {
    icon: React.ElementType;
    label: string;
    colorScheme: "green" | "clay" | "amber";
    bgColor: string;
    textColor: string;
    iconFill: string;
  }
> = {
  start: {
    icon: Play,
    label: "Start",
    colorScheme: "green",
    bgColor: "bg-green-500",
    textColor: "text-green-700",
    iconFill: "white",
  },
  action: {
    icon: Zap,
    label: "Action",
    colorScheme: "clay",
    bgColor: "bg-clay-500",
    textColor: "text-clay-700",
    iconFill: "white",
  },
  condition: {
    icon: GitBranch,
    label: "Condition",
    colorScheme: "amber",
    bgColor: "bg-amber-500",
    textColor: "text-amber-700",
    iconFill: "none",
  },
};
