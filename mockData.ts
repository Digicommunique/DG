
import { Site, DGEquipment, Job, JobStatus, Priority } from './types.ts';

export const MOCK_SITES: Site[] = [
  { id: 'S-101', name: 'Downtown Telecom Hub', lat: 12.9716, lng: 77.5946, instructions: 'Key at security gate B', connectorType: 'Type 2 Industrial' },
  { id: 'S-102', name: 'Westside Data Center', lat: 12.9800, lng: 77.6400, instructions: 'Ring buzzer at rear entrance', connectorType: 'Cam-Lock 400A' },
  { id: 'S-103', name: 'Airport Perimeter Tower', lat: 13.1986, lng: 77.7066, instructions: 'Requires ID verification at main gate', connectorType: 'Pin & Sleeve' },
];

export const MOCK_DG_UNITS: DGEquipment[] = [
  { id: 'DG-001', capacity: 62.5, operatorName: 'Rajesh Kumar', lat: 12.9500, lng: 77.5800, status: 'Available' },
  { id: 'DG-002', capacity: 125, operatorName: 'PowerSwift Logistics', lat: 12.9900, lng: 77.6100, status: 'Available' },
  { id: 'DG-003', capacity: 25, operatorName: 'City Power Rentals', lat: 12.9300, lng: 77.5500, status: 'Busy' },
];

export const MOCK_JOBS: Job[] = [
  {
    id: 'JOB-9001',
    siteId: 'S-101',
    customerId: 'CUST-1',
    operatorId: 'DG-002',
    requestedKVA: 125,
    status: JobStatus.SUPPLYING,
    priority: Priority.CRITICAL,
    createdAt: Date.now() - 3600000,
    startMeter: 1450.5
  }
];
