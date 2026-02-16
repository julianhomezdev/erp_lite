import { CommonModule } from "@angular/common";
import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { VehicleService } from "../../../../core/services/vehicle.service";
import { forkJoin, Subject, takeUntil } from "rxjs";
import { Vehicle } from "../../../../domain/Entities/vehicle/vehicle.model";
import { Router } from "@angular/router";
import { VehicleAssignment } from "../../../../domain/Entities/vehicle/vehicle-assignment.model";

@Component({

    selector: 'vehicles-dashboard',
    
    standalone: true,
    
    imports: [CommonModule, FormsModule],
    
    templateUrl: './vehicles-dashboard.component.html'



})

export class VehiclesDashboard implements OnInit, OnDestroy {


    // Camionetas
    vehiclesTotal = 0;
    avaibleVehiclesTotal = 0;
    maintenanceVehiclesTotal = 0;
    allVehicles: Vehicle[] = [];
    vehicles: Vehicle[] = [];
    
    // Búsqueda
    searchTerm: string = '';
    
    
    
    loading = false;
    error : string | null = null;
    
    
    private vehicleService = inject(VehicleService);
    private router = inject(Router);
    private destroy$ = new Subject<void>();
    
    
    
    ngOnDestroy(): void {
        
        this.destroy$.next();

        this.destroy$.complete();
        
    }
    
    
    
    ngOnInit(): void {
          
        this.loadAllData();
        
           
    }
    
    
    calculateAvailableVehicles(): number {
        
        return this.avaibleVehiclesTotal = this.allVehicles.filter(v => v.status === 0 ).length;    
        
    }
    
    calculateMaintenanceVehicles(): number {   
        
        return this.maintenanceVehiclesTotal = this.allVehicles.filter(v => v.status === 2).length;
        
    }   
    
    loadAllData() {
        
        this.loading = true;
        
        this.error = null;

        forkJoin({
            
            allVehicles: this.vehicleService.getAllVehicles(),
            
            avaibleVehicles: this.vehicleService.getAvailableVehiclesWithOutDate(),
            
            vehicles: this.vehicleService.getAllVehicles(),
            
            assignments: this.vehicleService.getVehicleAssignments()
            
        })
        
        .pipe(takeUntil(this.destroy$))
        
        .subscribe({
            
            next: (response) => {
                
                this.vehiclesTotal = response.allVehicles.length;
                
                this.avaibleVehiclesTotal = response.avaibleVehicles.length;
                
                this.allVehicles = this.mergeVehiclesWithAssignments(
                    
                    response.vehicles,
                    response.assignments
                    
                );
                
                this.vehicles = this.allVehicles;
                
                this.avaibleVehiclesTotal = this.calculateAvailableVehicles();
                
                this.maintenanceVehiclesTotal = this.calculateMaintenanceVehicles();
                
                this.loading = false;
                
            },
            
            error: (err) => {
                
                console.error('Error detallado:', err);
                
                console.error('Status:', err.status);
                
                console.error('Status Text:', err.statusText);
                
                console.error('URL:', err.url);
                
                console.error('Response body:', err.error);
                
                this.error = `Error cargando datos de camionetas: ${err.status} - ${err.statusText}`;
                
                this.loading = false;
            }
            
        });
    
    }
    
    mergeVehiclesWithAssignments(
        
        vehicles: Vehicle[],
        
        assignments: VehicleAssignment[]
        
        
    ) : Vehicle[] {
        
        return vehicles.map(vehicle => {
            
            
            const vehiclePlate = vehicle.plateNumber.trim().toUpperCase();
            
            const vehicleAssignments = assignments.filter(
                
                assignment => {
                    
                    
                    const assignmentPlate = assignment.numberPlate.trim().toUpperCase();
                    
                    return assignmentPlate === vehiclePlate;
                
                }
                
            );
            
            const sortedAssignments = vehicleAssignments.sort((a, b) =>
            
                new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
            
            
            );
            
            return  {
                
                ...vehicle,
                
                assignments: sortedAssignments
                
                
            };
            
        });
        
        
        
    }

    // ===== MÉTODOS DE BÚSQUEDA =====
    
    onSearchChange() {
        
        if (this.searchTerm.trim() === '') {
            
            this.vehicles = this.allVehicles;
            return;
            
        }
        
        const searchLower = this.searchTerm.toLowerCase().trim();
        
        this.vehicles = this.allVehicles.filter(vehicle =>
            vehicle.plateNumber?.toLowerCase().includes(searchLower) ||
            vehicle.supplier?.toLowerCase().includes(searchLower) ||
            vehicle.brand?.toLowerCase().includes(searchLower) ||
            vehicle.model?.toLowerCase().includes(searchLower) ||
            vehicle.location?.toLowerCase().includes(searchLower)
        );
        
    }
    
    clearSearch() {
        
        this.searchTerm = '';
        this.vehicles = this.allVehicles;
        
    }


    // Este metodo sera reemplazado con sincronización por excel
    /**onVehicleClick(vehicleId: number) {

         this.router.navigate(['/logistics/vehicles', vehicleId]);

    }**/

    onAddVehicle() {

        this.router.navigate(['/logistics/vehicles', 'new']);

    }
    
    formatDate(dateString: string): string {
        
        
        const date = new Date(dateString);
        
        return date.toLocaleDateString('es-CO',  {
            
            day: '2-digit', 
            
            month: 'short', 
            
            year: 'numeric'
     
            
        });
        
        
        
    }

}