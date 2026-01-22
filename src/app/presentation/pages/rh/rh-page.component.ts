import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RhComponent } from "../../components/rh/rh.component";

@Component({
    
    selector: 'rh-page',
    standalone: true,
    imports: [CommonModule, RhComponent],
    templateUrl: './rh-page.component.html'
    
    
})



export class RhPage {}