
export enum Role {
  CUSTOMER = 'Customer',
  OPERATOR = 'Operator',
  ADMIN = 'Admin'
}

export enum JobStatus {
  REQUESTED = 'Requested',
  CONFIRMED = 'Confirmed',
  MOVING = 'Moving',
  AT_GATE = 'At Gate',
  CONNECTED = 'Connected',
  SUPPLYING = 'Supplying',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled'
}

export enum Priority {
  CRITICAL = 'Critical',
  HIGH = 'High',
  NORMAL = 'Normal'
}

export interface Site {
  id: string;
  name: string;
  lat: number;
  lng: number;
  instructions: string;
  connectorType: string;
}

export interface DGEquipment {
  id: string;
  capacity: number; // in kVA
  operatorName: string;
  lat: number;
  lng: number;
  status: 'Available' | 'Busy' | 'Maintenance';
}

export interface Job {
  id: string;
  siteId: string;
  customerId: string;
  operatorId?: string;
  requestedKVA: number;
  status: JobStatus;
  priority: Priority;
  createdAt: number;
  startMeter?: number;
  endMeter?: number;
  fuelUsed?: number;
}
