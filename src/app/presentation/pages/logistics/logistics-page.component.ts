import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { LogisticsDashboard } from "../../components/logistics/dashboard-view/dashboard-view.component";

@Component({
    
    selector: 'logistics-page',
    standalone: true,
    imports: [CommonModule, LogisticsDashboard],
    templateUrl: './logistics-page.component.html'
            
})



export class LogisticsPage {}