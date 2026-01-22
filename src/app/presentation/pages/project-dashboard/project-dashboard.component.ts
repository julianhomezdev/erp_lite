import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ProjectDashboardComponent } from "../../components/project-dashboard/project-dashboard.component";

@Component ({
    
    selector: 'dashboard-page',
    standalone: true,
    imports: [CommonModule, ProjectDashboardComponent],
    templateUrl: './project-dashboard.component.html'
    
    
    
})

export class DashboardPage {}