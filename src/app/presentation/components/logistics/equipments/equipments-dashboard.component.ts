import { CommonModule } from "@angular/common";
import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { EquipmentService } from "../../../../core/services/equipment.service";
import { Equipment } from "../../../../domain/Entities/Equipment/equipment.model";
import { forkJoin, Subject, takeUntil } from "rxjs";

@Component({


    selector: 'equipments-dashboard',
    
    standalone: true,
    
    imports: [CommonModule],
    
    templateUrl: './equipments-dashboard.component.html'


})



export class EquipmentsDashboard implements OnInit, OnDestroy {


    loading = false;
    error : string | null = null;

    private equipmentService =  inject(EquipmentService)


    equipmentsTotal = 0;   
    equipments: Equipment[] = [];
    filteredEquipments: Equipment[] = [];
    
    selectedFilter: string = 'TODOS';
    availableCategories: string[] = [];

    private destroy$ = new Subject<void>();



    ngOnDestroy(): void {
        
        this.destroy$.next();
        
        this.destroy$.complete();

    }


    ngOnInit(): void {
        
        this.loadAllData();

    }


    loadAllData() {
        
        this.loading= true;
        
        this.error = null;
        
        forkJoin({

            equipments: this.equipmentService.getAllEquipment(),
      
        })
        
        .pipe(takeUntil(this.destroy$))
        
        .subscribe({
            
            next: (response) => {

                this.equipmentsTotal = response.equipments.length;
                
                this.equipments = response.equipments;
                
                this.filteredEquipments = response.equipments;
                
                this.extractCategories();
                                
                this.loading = false;
                
            },
            error: (err) => {
                
                console.error('Error cargando datos de equipos:', err);
                
                this.error= 'Error cargando datos de equipos';
                
                this.loading = false;
                
            }
            
        });
        
        
    }
    
    
    extractCategories() {
        
        const categoriesSet = new Set(this.equipments.map(eq => eq.name));
        
        this.availableCategories = Array.from(categoriesSet).sort();
        
    }
    
    filterByCategory(category: string) {
        
        
        this.selectedFilter = category;
        
        if(category === 'TODOS') {
            
            this.filteredEquipments = this.equipments;
            
        } else {
            
            this.filteredEquipments = this.equipments.filter(eq => eq.name === category);
            
        }
        
    }
    
    
    getCategoryCount(category: string): number {
        
        if (category === 'TODOS') {
            
            return this.equipments.length;
            
        }
        
        return this.equipments.filter(eq => eq.name === category).length;
        
    }

}