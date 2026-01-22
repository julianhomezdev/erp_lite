import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ProjectDraftComponent } from "../../components/project-draft/project-draft.component";

@Component({
    
    selector: 'project-draft-page',
    standalone: true,
    imports: [CommonModule, ProjectDraftComponent],
    templateUrl: './project-draft.component.html'
    
    
})

export class ProjectDraftsPage {}