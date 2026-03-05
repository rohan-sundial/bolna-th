export interface IWorkflow {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export type UpdateWorkflowInput = Partial<
  Pick<IWorkflow, "name" | "description">
>;

export type IWorkflowStorageService = {
  getAll: () => Promise<IWorkflow[]>;
  getById: (id: string) => Promise<IWorkflow | null>;
  create: () => Promise<IWorkflow>;
  update: (id: string, input: UpdateWorkflowInput) => Promise<IWorkflow>;
  delete: (id: string) => Promise<void>;
};
