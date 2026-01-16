import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ProjectRepository } from "../../../domain/repositories/project-repository/project.repository";
import { Observable } from "rxjs";
import { EmployeeAvailability } from "../../../domain/Entities/employee/employee-availability.model";
import { ProjectResponse } from "../../../domain/Entities/project/project-response.model";
import { CreateProject } from "../../../domain/Entities/project/project.model";

@Injectable({ providedIn: 'root' })


export class ProjectRepositoryImpl extends ProjectRepository {
    
    apiUrl = 'http://localhost:5271/api/Projects';
    
    
    constructor(private http: HttpClient) {
        
        super();
        
    }
    
    
    override create(dto: CreateProject): Observable<ProjectResponse> {
        return this.http.post<ProjectResponse>(this.apiUrl, dto);
    }
    
    
    override getById(id: number): Observable<ProjectResponse> {
        throw new Error("Method not implemented.");
    }
    
    
    override getAll(): Observable<ProjectResponse[]> {
        throw new Error("Method not implemented.");
    }
    
    
    override checkEmployeeAvailability(employeeId: number, year: number, month: number): Observable<EmployeeAvailability> {
        
        const params = new HttpParams()
            .set('year', year)
            .set('month', month);
        
            
            return this.http.get<EmployeeAvailability>(
                
                `${this.apiUrl}/employees/${employeeId}/availability`,
                { params }
                
                
            )
    }
    
    
    
    
    
    
}