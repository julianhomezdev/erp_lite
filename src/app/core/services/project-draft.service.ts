import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/development.environment';




@Injectable({
  providedIn: 'root'
})


export class ProjectDraftService {
 
    private apiUrl = `${environment.apiUrl}/ProjectDraft`;
    
    
    constructor(private http: HttpClient) {}
    
    
    
    saveDraft(draftData: any): Observable<any> {
        
        return this.http.post<any>(this.apiUrl, draftData);
        
    }
    
        
    
    getDrafts(): Observable<any[]> {
        
        return this.http.get<any[]>(this.apiUrl);
    
    }
    
    getDraftById(id: number): Observable<any> {
        
        return this.http.get<any>(`${this.apiUrl}/${id}`);
        
    }

    
    deleteDraft(id: number): Observable<void> {
        
        
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
        
    }
}

  
  