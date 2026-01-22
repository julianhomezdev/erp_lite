import { CommonModule } from "@angular/common";
import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { VehicleService } from "../../../../core/services/vehicle.service";
import { forkJoin, Subject, takeUntil } from "rxjs";
import { EmployeeService } from "../../../../core/services/employee.service";

@Component({
    
    selector: 'logistics-dashbaord-view',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dashboard-view.component.html'
    
})



export class LogisticsDashboard implements OnInit, OnDestroy {
    
    // Camionetas
    vehiclesTotal = 0;
    avaibleVehicles = 0;
    
    // Personas
    employeesTotal = 0;
    
    
    
    loading = false;
    error : string | null = null;
    
    
    private vehicleService = inject(VehicleService)
    private employeeService = inject(EmployeeService)
    
    
    private destroy$ = new Subject<void>();
    
    
    ngOnDestroy(): void {
        
        
        
    }
    
    
    
    ngOnInit(): void {
        
        
        this.loadAllData();
        
        
    }
    
 
    
    
    loadAllData() {
        
        this.loading= true;
        
        this.error = null;
        
        forkJoin({
            
            allVehicles: this.vehicleService.getAllVehicles(),
            
            avaibleVehicles: this.vehicleService.getAvailableVehicles(),
            
            allEmployees: this.employeeService.getAllEmployees()
            
        })
        
        .pipe(takeUntil(this.destroy$))
        
        .subscribe({
            
            next: (response) => {
                
                this.vehiclesTotal = response.allVehicles.length;
                
                this.avaibleVehicles = response.avaibleVehicles.length;
                
                this.employeesTotal = response.allEmployees.length;
                
                this.loading = false;
                
            },
            error: (err) => {
                
                console.error('Error cargando datos:', err);
                
                this.error= 'Error al cargar datos';
                
                this.loading = false;
                
            }
            
        });
        
        
    }
    
    
    
    
    
    
    
    
    
  
    
    
    
    
}