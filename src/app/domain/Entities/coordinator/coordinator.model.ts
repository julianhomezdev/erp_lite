import { Employee } from "../employee/employee.model";

export interface Coordinator {
    
    coordinator: Employee;
    supervisor?: Employee;
    
}