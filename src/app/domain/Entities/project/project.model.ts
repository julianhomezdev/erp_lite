import { EmployeeAssignment } from "../employee/employe-assignment.model";
import { VehicleAssignment } from "../vehicle/vehicle-assignment.model";
import { ProjectBudget } from "./project-budget.model";

export interface CreateProject  {
    
    
    name: string;
    startDate: Date;
    endDate: Date;
    clientId: number;
    contractId?: number;
    serviceOrderId?: number;
    operationalBaseId?: number;
    coordinatorEmployeeId: number;
    supervisorEmployeeId?: number;
    employeeAssignments: EmployeeAssignment[];
    vehicleAssignments: VehicleAssignment[];
    budget?: ProjectBudget;
    
}