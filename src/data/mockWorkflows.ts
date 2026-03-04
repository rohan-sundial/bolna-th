import { IWorkflow } from '@/types/workflow';

export const MOCK_WORKFLOWS: IWorkflow[] = [
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    name: 'Customer Onboarding',
    description: 'Automated workflow for onboarding new customers with email sequences and task assignments.',
    createdAt: new Date('2026-03-01T10:30:00'),
    updatedAt: new Date('2026-03-04T14:22:00'),
    createdBy: 'Rohan',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Data Processing Pipeline',
    description: 'ETL workflow for processing daily data imports from external sources.',
    createdAt: new Date('2026-02-28T09:00:00'),
    updatedAt: new Date('2026-03-03T16:45:00'),
    createdBy: 'Rohan',
  },
  {
    id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    name: 'Approval Flow',
    description: 'Multi-stage approval process for document reviews and sign-offs.',
    createdAt: new Date('2026-02-25T11:15:00'),
    updatedAt: new Date('2026-03-02T10:30:00'),
    createdBy: 'Rohan',
  },
  {
    id: '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
    name: 'Notification Service',
    description: 'Handles sending notifications across multiple channels based on user preferences.',
    createdAt: new Date('2026-02-20T14:00:00'),
    updatedAt: new Date('2026-02-28T09:15:00'),
    createdBy: 'Rohan',
  },
];
