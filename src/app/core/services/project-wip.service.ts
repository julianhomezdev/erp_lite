// core/services/project-wip.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ProjectWorkInProgress } from '../../domain/Entities/ProjectWorkInProgress/project-work-progress.mode';
import { environment } from '../../environments/development.environment';


@Injectable({
  providedIn: 'root'
})
export class ProjectWipService {
  private apiUrl = `${environment.apiUrl}/project-wip`;
  private localStorageKey = 'project_drafts';

  constructor(private http: HttpClient) {}

  // Guardar borrador en localStorage (temporal)
  saveDraft(draft: ProjectWorkInProgress): Observable<ProjectWorkInProgress> {
    const drafts = this.getDraftsFromStorage();
    const existingIndex = drafts.findIndex(d => d.draftId === draft.draftId);
    
    if (existingIndex >= 0) {
      drafts[existingIndex] = draft;
    } else {
      drafts.push(draft);
    }
    
    localStorage.setItem(this.localStorageKey, JSON.stringify(drafts));
    return of(draft);
  }

  // Guardar en backend
  saveDraftToBackend(draft: ProjectWorkInProgress): Observable<ProjectWorkInProgress> {
    return this.http.post<ProjectWorkInProgress>(this.apiUrl, draft);
  }

  // Obtener borrador por ID
  getDraft(draftId: string): Observable<ProjectWorkInProgress | null> {
    const drafts = this.getDraftsFromStorage();
    const draft = drafts.find(d => d.draftId === draftId);
    return of(draft || null);
  }

  // Obtener todos los borradores del usuario
  getUserDrafts(userId: string): Observable<ProjectWorkInProgress[]> {
    const drafts = this.getDraftsFromStorage();
    return of(drafts);
  }

  // Eliminar borrador
  deleteDraft(draftId: string): Observable<void> {
    const drafts = this.getDraftsFromStorage();
    const filteredDrafts = drafts.filter(d => d.draftId !== draftId);
    localStorage.setItem(this.localStorageKey, JSON.stringify(filteredDrafts));
    return of(void 0);
  }

  // Marcar como completado
  markAsCompleted(draftId: string): Observable<void> {
    const drafts = this.getDraftsFromStorage();
    const draftIndex = drafts.findIndex(d => d.draftId === draftId);
    
    if (draftIndex >= 0) {
      drafts[draftIndex].isCompleted = true;
      localStorage.setItem(this.localStorageKey, JSON.stringify(drafts));
    }
    
    return of(void 0);
  }

  // Helper para obtener borradores del localStorage
  private getDraftsFromStorage(): ProjectWorkInProgress[] {
    const draftsStr = localStorage.getItem(this.localStorageKey);
    return draftsStr ? JSON.parse(draftsStr) : [];
  }

  // Generar ID único para borrador
  generateDraftId(): string {
    return `DRAFT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}