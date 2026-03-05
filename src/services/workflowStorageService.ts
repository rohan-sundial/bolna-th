import { v4 as uuidv4 } from 'uuid';
import { IWorkflow, IWorkflowStorageService, UpdateWorkflowInput } from '@/types/workflow';

const STORAGE_KEY = 'flowbuilder_workflows';
const SIMULATED_DELAY_MS = 1000;

const getCurrentUser = () => 'Rohan';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const parseWorkflow = (workflow: IWorkflow): IWorkflow => ({
  ...workflow,
  createdAt: new Date(workflow.createdAt),
  updatedAt: new Date(workflow.updatedAt),
});

export const workflowStorageService: IWorkflowStorageService = {
  getAll: async () => {
    await delay(SIMULATED_DELAY_MS);
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const workflows = JSON.parse(data) as IWorkflow[];
    return workflows.map(parseWorkflow);
  },

  getById: async (id: string) => {
    await delay(SIMULATED_DELAY_MS);
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    const workflows = (JSON.parse(data) as IWorkflow[]).map(parseWorkflow);
    return workflows.find((w) => w.id === id) ?? null;
  },

  create: async () => {
    await delay(SIMULATED_DELAY_MS);
    const data = localStorage.getItem(STORAGE_KEY);
    const workflows = data ? (JSON.parse(data) as IWorkflow[]).map(parseWorkflow) : [];
    const now = new Date();
    const newWorkflow: IWorkflow = {
      id: uuidv4(),
      name: 'Untitled Workflow',
      description: '',
      nodes: [],
      edges: [],
      createdAt: now,
      updatedAt: now,
      createdBy: getCurrentUser(),
    };
    workflows.push(newWorkflow);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows));
    return newWorkflow;
  },

  update: async (id: string, input: UpdateWorkflowInput) => {
    await delay(SIMULATED_DELAY_MS);
    const data = localStorage.getItem(STORAGE_KEY);
    const workflows = data ? (JSON.parse(data) as IWorkflow[]).map(parseWorkflow) : [];
    const index = workflows.findIndex((w) => w.id === id);
    if (index === -1) {
      throw new Error(`Workflow ${id} not found`);
    }
    const updated: IWorkflow = {
      ...workflows[index],
      ...input,
      updatedAt: new Date(),
    };
    workflows[index] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows));
    return updated;
  },

  delete: async (id: string) => {
    await delay(SIMULATED_DELAY_MS);
    const data = localStorage.getItem(STORAGE_KEY);
    const workflows = data ? (JSON.parse(data) as IWorkflow[]).map(parseWorkflow) : [];
    const filtered = workflows.filter((w) => w.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },
};
