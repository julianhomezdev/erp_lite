import { CommonModule } from "@angular/common";
import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Client } from "../../../domain/Entities/client/client.model";
import { ClientService } from "../../../core/services/client.service";
import { Subject } from "rxjs";
import { Router } from "@angular/router";


// Un contrato necesita Cliente, Fechas, Valor
// El valor igualmente se puede asignar desde proyecto o por ods
// En el valor debe tener valor total, valor consumido y restante



@Component ({
    
    selector: 'create-contract',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './create-contract.component.html'
    
    
    
})

export class ContractComponent implements OnInit, OnDestroy {
    
    
    
    private destroy$ = new Subject<void>();
    
    loading = false;
    errorMessage= '';
    successMessage = '';
    
    
    // Services
    private clientService= inject(ClientService);
    //private contractService = inject(ContractService);
    private router = inject(Router);
    
    clients: Client[] = [];
    
    
    selectedClient: string | null = null;
    selectedCoordinator: string | null = null;
    selectedZone: string | null = null;
    selectedBudget: string | null = null;
    contractName: string | null = null;
    startDate: string | null = null;
    endDate: string | null = null;
    totalValue: number  | null = null;
    
    
    
    ngOnDestroy(): void {
        
        this.destroy$.next();
        
        this.destroy$.complete();
    }
    
    ngOnInit(): void {
        
        this.loadClients();
    }
    
    
    
    loadClients() {
        
        this.loading = true;
        
        this.clientService.getAllClients().subscribe({
            
            
            next: (data) => {
                
                this.clients = data;
                this.loading = false;
            },
            
            error: (err) => {
                
                console.error("Error trayendo los clientes: ", err);
                
                this.errorMessage = err;
                
                this.loading = false;
            }
            
        })
        
    }
    
    getClientName(): void {
        
    }
    
    isFormValid(): Boolean {
        
        return false;
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