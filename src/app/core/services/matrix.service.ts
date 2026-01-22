import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/development.environment';
import { Matrix } from '../../domain/Entities/matrix/matrix.model';


@Injectable({
  providedIn: 'root'
})

export class MatrixService {
  
  
  private http = inject(HttpClient);
  
  
  private apiUrl = `${environment.apiUrl}/Matrix`;

  getAllMatrix(): Observable<Matrix[]> {
    
    
    return this.http.get<Matrix[]>(this.apiUrl);
    
    
  }

  
}