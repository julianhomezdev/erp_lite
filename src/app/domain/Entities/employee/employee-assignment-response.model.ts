import { Employee } from "./employee.model";

export interface EmployeeAssignmentResponse {
  id: number;
  employee: Employee;
  hoursPerMonth: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}