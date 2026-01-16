import { ProjectAssignmentInfo } from "../project/project-assignment-info.model";

export interface EmployeeAvailability {
  employeeId: number;
  fullName: string;
  role: string;
  year: number;
  month: number;
  totalAvailableHours: number;
  hoursAssigned: number;
  remainingHours: number;
  isAvailable: boolean;
  currentAssignments: ProjectAssignmentInfo[];
}