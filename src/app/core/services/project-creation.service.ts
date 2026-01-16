import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateProject, ProjectCreationResult } from '../../domain/Entities/project/project-creation.model';
import { environment } from '../../environments/development.environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectCreationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/projectcreation`;

  createCompleteProject(project: CreateProject): Observable<ProjectCreationResult> {
    return this.http.post<ProjectCreationResult>(`${this.apiUrl}/create-complete`, project);
  }
}