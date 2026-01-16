import { Injectable } from "@angular/core";
import { EmployeeRepository } from "../../../domain/repositories/employee-repository/employee.repository";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Employee } from "../../../domain/Entities/employee/employee.model";

@Injectable({
    
    providedIn: 'root'

})



export class EmployeeRepositoryImpl extends EmployeeRepository {
         
    constructor(private http: HttpClient) {
        
        super();
                
    }
        
    override getAll(): Observable<Employee[]> {
                
        return this.http.get<Employee[]>('http://localhost:5271/api/Employees');
        
    }
            
}