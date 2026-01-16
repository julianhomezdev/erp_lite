import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { BudgetComponent } from "../../components/create-budget/create-budget.component";

@Component ({
    
    selector: 'budget-page',
    standalone: true,
    imports: [CommonModule, BudgetComponent],
    templateUrl: './budget.component.html'
    
    
    
})

export class BudgetPage {}