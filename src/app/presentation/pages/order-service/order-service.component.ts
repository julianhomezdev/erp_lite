import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { OrderServiceComponent } from "../../components/order-service/order-service.component";

@Component ({
    
    selector: 'contract-page',
    standalone: true,
    imports: [CommonModule, OrderServiceComponent],
    templateUrl: './order-service.component.html'
    
    
    
})

export class OrderServicePage {}