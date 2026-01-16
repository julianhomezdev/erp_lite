import { Employee } from "../employee/employee.model";

export interface RoleGroup {
    
    role: string;
    count: number;
    employees: Employee[];
    
}