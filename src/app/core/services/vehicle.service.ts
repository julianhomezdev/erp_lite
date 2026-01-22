import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle } from '../../domain/Entities/vehicle/vehicle.model';
import { environment } from '../../environments/development.environment';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  
  
  private http = inject(HttpClient);
  
  
  private apiUrl = `${environment.apiUrl}/vehicle`;

  getAllVehicles(): Observable<Vehicle[]> {
    
    
    return this.http.get<Vehicle[]>(this.apiUrl);
    
    
  }

  getAvailableVehicles(): Observable<Vehicle[]> {
    
    
    return this.http.get<Vehicle[]>(`${this.apiUrl}/available`);
    
    
  }
}