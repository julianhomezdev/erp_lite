import { Component } from "@angular/core";

import { RouterLink, RouterLinkActive } from "@angular/router";

import { CommonModule } from "@angular/common";

@Component ({
    
    selector: 'nav-bar-component',
    
    standalone: true,
    
    imports: [RouterLink, RouterLinkActive, CommonModule],
    
    templateUrl: './nav-bar.component.html',
    
    styleUrls: ['./nav-bar.component.css']
    
})

export class NavBarComponent {
  
  openMenus: { [key: string]: boolean } = {
    
    home: false,
    
    proyectos: false,
    
    rh: false,
    
    logistics: false
    
  };
  
  toggleSubmenu(menu: string): void {
    
    this.openMenus[menu] = !this.openMenus[menu];
    
  }
  
}