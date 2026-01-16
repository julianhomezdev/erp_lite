import { Observable } from 'rxjs';
import { ProjectResponse } from '../../Entities/project/project-response.model';
import { CreateProject } from '../../Entities/project/project.model';
import { EmployeeAvailability } from '../../Entities/employee/employee-availability.model';

export abstract class ProjectRepository {
    
  abstract create(dto: CreateProject): Observable<ProjectResponse>;
  abstract getById(id: number): Observable<ProjectResponse>;
  abstract getAll(): Observable<ProjectResponse[]>;

  abstract checkEmployeeAvailability(
    
    employeeId: number,
    year: number,
    month: number
    
  ): Observable<EmployeeAvailability>;
  
}
