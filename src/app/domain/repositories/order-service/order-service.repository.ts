
import { Observable } from "rxjs";
import { OrderService } from "../../Entities/order-service/order-service.model";



export abstract class OrderServiceRepository {
    
    abstract getAll(): Observable<OrderService[]>;
    
    
}