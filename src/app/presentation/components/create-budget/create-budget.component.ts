import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component ({
    
    selector: 'create-budget',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './create-budget.component.html'
    
    
    
})

export class BudgetComponent implements OnInit, OnDestroy {
    
    
    loading = false;
    errorMessage= '';
    successMessage = '';
    
    
    selectedClient: string | null = null;
    selectedCoordinator: string | null = null;
    selectedZone: string | null = null;
    selectedBudget: string | null = null;
    
    
    ngOnDestroy(): void {
    }
    ngOnInit(): void {
    }
    
    
    onCancel() {
    this.selectedClient = null;
    this.selectedCoordinator = null;
    this.selectedZone = null;
    this.selectedBudget = null;
    this.errorMessage = '';
    this.successMessage = '';
  }
  
    onSubmit() {
        
    }
}