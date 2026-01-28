import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { OrderService } from "../../domain/Entities/order-service/order-service.model";
import { environment } from "../../environments/development.environment";

@Injectable({
    
    
    providedIn: 'root'
    
})


export class OrderServiceService {
    
    
    
    private http = inject(HttpClient);
    
    private apiUrl = `${environment.apiUrl}/OrderService`;
    
    
    
    getLastOds() {
        
        return this.http.get<OrderService>(this.apiUrl)
        
    }
    
    createNewOds() {
        
        return this.http.post<OrderService>(this.apiUrl, {})
        
    }
    
    
    
    
}