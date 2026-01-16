import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ContractComponent } from "../../components/create-contract/create-contract.component";

@Component ({
    
    selector: 'contract-page',
    standalone: true,
    imports: [CommonModule, ContractComponent],
    templateUrl: './contract.component.html'
    
    
    
})

export class ContractPage {}