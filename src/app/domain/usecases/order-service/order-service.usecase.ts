import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { OrderService } from "../../Entities/order-service/order-service.model";
import { OrderServiceRepository } from "../../repositories/order-service/order-service.repository";

@Injectable({
    
    
    providedIn: 'root'
    
})


export class GetOrderServiceUseCase {
    
    
    constructor(private repository: OrderServiceRepository) {}
    
    
    execute(): Observable<OrderService[]> {
        
        return this.repository.getAll();   
        
    }
    
    
    
}