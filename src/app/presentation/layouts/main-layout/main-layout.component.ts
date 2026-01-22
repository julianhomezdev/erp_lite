import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavBarComponent } from "../../components/common/nav-bar/nav-bar.component";

@Component({
    
    
    selector: 'app-main-layout',
    standalone: true,
    imports: [RouterOutlet, NavBarComponent],
    templateUrl: './main-layout.component.html'
    
})


export class MainLayoutComponent {}