import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { OrderService } from "../../domain/Entities/order-service/order-service.model";

@Injectable({
    
    
    providedIn: 'root'
    
})


export class OrderServiceService {
    
    
    
    private http = inject(HttpClient);
    
    
    
    getLastOds() {
        
        return this.http.get<OrderService>("http://localhost:5271/api/OrderService")
        
    }
    
    createNewOds() {
        
        return this.http.post<OrderService>("http://localhost:5271/api/OrderService", {})
        
    }
    
    
    
    
}