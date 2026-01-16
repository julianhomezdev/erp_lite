import { CommonModule } from "@angular/common";
import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SamplingPlanService } from "../../../core/services/sampling.plan.service";
import { SamplingPlan } from "../../../domain/Entities/samplingPlan/sampling-plan.model";

@Component ({
    
    selector: 'create-sampling-plan',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './sampling-plan.component.html'
    
    
    
})

export class SamplingPlanComponent implements OnInit, OnDestroy {
    
    
    loading = false;
    errorMessage= '';
    successMessage = '';
    planId: string = '';
    lastPlanId: string | null = null;
    generatedPlan: string = '';
    
    
    private samplingPlanService = inject(SamplingPlanService);
    

    
    
    ngOnDestroy(): void {
        
        this.lastPlanId = ""
        
    }
    ngOnInit(): void {
        
        this.loadLastPlan();
        
    }
    
    
    onCancel() {
    
    this.errorMessage = '';
    this.successMessage = '';
    
    }
    
    generatePlan(): void {
        
        this.createNewPlan();
        
    }
  
    createNewPlan(): void {
        
        this.loading = true;
        this.errorMessage = '';
        this.successMessage = '';
        this.generatedPlan = '';
        
        this.samplingPlanService.createNewSamplingPlan().subscribe({
    
            next: (plan: SamplingPlan) => {
                
                this.successMessage = `Plan de muestreo ${plan.samplingPlanCode} creado`
                this.lastPlanId = plan.samplingPlanCode;
                this.loading = false;
                
            },
            
            error: (error) => {
                
                this.errorMessage = 'Error al crear el plan de muestreo';
                console.error('Error: ', error);
                this.loading = false;
                
            }
            
        })
        
        
    }
  
  
    
    
    loadLastPlan() {
        
        this.loading = true;
        this.errorMessage = '';
        
        this.samplingPlanService.getLastSamplingPlan(). subscribe({
            
            next: (plan: SamplingPlan) => {
                
                this.lastPlanId = plan.samplingPlanCode;
                this.loading = false
                
            },
            
            error: (error) => {
                
                this.errorMessage = "Error al cargar el ultimo plan de muestreo";
                console.error('Error: ', error);
                this.loading = false;
                
            }
            
            
        })
        
    }
}