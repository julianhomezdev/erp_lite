import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ProjectRequest {
  contract: {
    contractCode: string;
    contractName: string;
    clientName: string;
    contractValue: number;
    startDate: string;
    endDate: string;
  };
  coordinator: {
    coordinatorId: number;
    zone: string;
    volume: number;
  };
  project: {
    projectName: string;
    projectDescription: string;
    priority: string;
  };
  resources: {
    base: string;
    personnel: string[];
    equipment: string[];
    vehicles: string[];
  };
}

export interface ProjectResponse {
  projectId: number;
  odsCode: string;
  samplingPlanCode: string;
  contractCode: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5271/api'; // Ajusta según tu API
  
  /**
   * Crea un proyecto completo incluyendo ODS y Plan de Muestreo
   */
  createCompleteProject(projectData: ProjectRequest): Observable<ProjectResponse> {
    return this.http.post<ProjectResponse>(`${this.apiUrl}/Projects/complete`, projectData);
  }
  
  /**
   * Obtiene todos los proyectos
   */
  getAllProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Projects`);
  }
  
  /**
   * Obtiene un proyecto por ID
   */
  getProjectById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Projects/${id}`);
  }
  
  /**
   * Obtiene coordinadores disponibles
   */
  getCoordinators(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Coordinators`);
  }
  
  /**
   * Obtiene bases disponibles
   */
  getBases(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/Bases`);
  }
  
  /**
   * Obtiene zonas disponibles
   */
  getZones(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/Zones`);
  }
  
  /**
   * Valida disponibilidad de código de contrato
   */
  validateContractCode(code: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/Contracts/validate/${code}`);
  }
}