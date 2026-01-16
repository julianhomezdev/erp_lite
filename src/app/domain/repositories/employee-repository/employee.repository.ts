
import { Observable } from "rxjs";
import { Employee } from "../../Entities/employee/employee.model";



export abstract class EmployeeRepository {
    
    abstract getAll(): Observable<Employee[]>;
    
    
}