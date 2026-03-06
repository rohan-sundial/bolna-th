import type { Node, Edge } from '@xyflow/react';

export type SortOption = 'updatedAt' | 'createdAt';

export interface IWorkflow {
  id: string;
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export type UpdateWorkflowInput = Partial<
  Pick<IWorkflow, 'name' | 'description' | 'nodes' | 'edges'>
>;

export type IWorkflowStorageService = {
  getAll: () => Promise<IWorkflow[]>;
  getById: (id: string) => Promise<IWorkflow | null>;
  create: (createdBy?: string) => Promise<IWorkflow>;
  update: (id: string, input: UpdateWorkflowInput) => Promise<IWorkflow>;
  delete: (id: string) => Promise<void>;
};
