import { EmployeeAssignment } from "./employe-assignment.model";

export interface Employee {
  
    id: number;
    name: string;
    firstName: string;
    lastName: string;
    position: string;
    base: string;
    isAvailable: boolean;
    assignments?: EmployeeAssignment[];
    status: number;
    workDays: number;
    DaysOff: number;
    workDaysPerMonth: number;  
    daysOffPerMonth: number;
  
}