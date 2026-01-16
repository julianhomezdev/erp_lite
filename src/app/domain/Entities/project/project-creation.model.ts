import { Employee } from "../employee/employee.model";
import { Equipment } from "../Equipment/equipment.model";
import { Vehicle } from "../vehicle/vehicle.model";

export interface CreateProject {
  contract: ContractInfo;
  coordinator: CoordinatorInfo;
  projectDetails: ProjectDetails;
  resources: Resources;
  budget: Budget;
}

export interface ContractInfo {
  contractCode: string;
  contractName: string;
  clientName: string;
  contractValue: number;
  startDate: string;
  endDate: string;
}

export interface CoordinatorInfo {
  coordinatorId: number;
  zone: string;
  volume: number;
}

export interface ProjectDetails {
  projectName: string;
  projectDescription: string;
  estimatedDuration: number;
  priority: string;
}

export interface Resources {
  base: string;
  selectedEmployeeIds: number[];
  selectedEquipmentIds: number[];
  selectedVehicleIds: number[];
}

export interface Budget {
  personalCost: number;
  equipmentCost: number;
  transportCost: number;
  materialsCost: number;
  otherCosts: number;
  notes: string;
}

export interface ProjectCreationResult {
  projectCode: string;
  odsCode: string;
  budgetCode: string;
  samplingPlanCode: string;
  summary: ProjectSummary;
}

export interface ProjectSummary {
  contractCode: string;
  projectName: string;
  coordinatorName: string;
  zone: string;
  selectedEmployees: Employee[];
  selectedEquipment: Equipment[];
  selectedVehicles: Vehicle[];
  totalBudget: number;
}