import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit, NgZone } from "@angular/core";
import { interval, Subscription } from 'rxjs';


@Component({
    selector: 'main-page',
    imports: [CommonModule],
    standalone: true,
    templateUrl: './main-page.component.html',
    styleUrl: './main-page.component.css'
})
export class MainPage {
    
}