import { Injectable } from "@angular/core";
import { EmployeeRepository } from "../../repositories/employee-repository/employee.repository";
import { Observable } from "rxjs";
import { Employee } from "../../Entities/employee/employee.model";

@Injectable({
    
    
    providedIn: 'root'
    
})


export class GetEmployeeUsecase {
    
    
    constructor(private repository: EmployeeRepository) {}
    
    
    execute(): Observable<Employee[]> {
        
        return this.repository.getAll();   
        
        
    }
    
    
    
}