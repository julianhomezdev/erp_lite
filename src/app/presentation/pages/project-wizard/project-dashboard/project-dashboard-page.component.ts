import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ProjectDashboardComponent } from "../../../components/project-dashboard/project-dashboard.component";

@Component({
    
    selector: 'project-dashboard-page',
    standalone: true,
    imports: [CommonModule, ProjectDashboardComponent],
    templateUrl: './project-dashboard-page.component.html'
    
    
    
})

export class  ProjectDasboardPage {}