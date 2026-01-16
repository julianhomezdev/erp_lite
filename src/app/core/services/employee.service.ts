import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../../domain/Entities/employee/employee.model';



@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5271/api/Employees';
  
  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }
  
  getAvailableEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/available`);
  }
  
  getEmployeesByBase(base: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/base/${base}`);
  }
}