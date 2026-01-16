import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Employee } from '../../../domain/Entities/employee/employee.model';
import { Vehicle } from '../../../domain/Entities/vehicle/vehicle.model';
import { ProjectCreationResult } from '../../../domain/Entities/project/project-creation.model';
import { EmployeeService } from '../../../core/services/employee.service';
import { EquipmentService } from '../../../core/services/equipment.service';
import { VehicleService } from '../../../core/services/vehicle.service';
import { ProjectCreationService } from '../../../core/services/project-creation.service';
import { Equipment } from '../../../domain/Entities/Equipment/equipment.model';

interface WizardStep {
  id: number;
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-project-wizard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './project-wizard.component.html',
  styleUrls: ['./project-wizard.component.css']
})
export class ProjectWizardComponent implements OnInit {
  
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private employeeService = inject(EmployeeService);
  private equipmentService = inject(EquipmentService);
  private vehicleService = inject(VehicleService);
  private projectCreationService = inject(ProjectCreationService);
  
  currentStep = 1;
  loading = false;
  successMessage = '';
  errorMessage = '';
  showFinalDashboard = false;
  projectResult: ProjectCreationResult | null = null;
  
  contractForm!: FormGroup;
  coordinatorForm!: FormGroup;
  projectForm!: FormGroup;
  resourcesForm!: FormGroup;
  budgetForm!: FormGroup;
  
  employees: Employee[] = [];
  selectedEmployees: Employee[] = [];
  employeeSearchTerm = '';

  equipment: Equipment[] = [];
  selectedEquipment: Equipment[] = [];
  equipmentSearchTerm = '';

  vehicles: Vehicle[] = [];
  selectedVehicles: Vehicle[] = [];
  vehicleSearchTerm = '';
  
  steps: WizardStep[] = [
    { id: 1, title: 'Contrato', description: 'Información del contrato base', icon: '📄' },
    { id: 2, title: 'Coordinador', description: 'Asignación por zona y volumen', icon: '👥' },
    { id: 3, title: 'Proyecto', description: 'Detalles del proyecto', icon: '📋' },
    { id: 4, title: 'Recursos', description: 'Personal, equipos y vehículos', icon: '🔧' },
    { id: 5, title: 'Presupuesto', description: 'Estimación de costos', icon: '💰' }
  ];
  
  coordinadores = [
    { id: 1, name: 'Diego Garzón', zone: 'Norte' },
    { id: 2, name: 'Camilo Valencia', zone: 'Sur' },
    { id: 3, name: 'Eliana Valencia', zone: 'Centro' }
  ];
  
  bases = ['Ibagué', 'Bogotá', 'Medellín', 'Cali'];
  zonas = ['Norte', 'Sur', 'Centro', 'Oriente', 'Occidente'];
  
  ngOnInit(): void {
    this.initializeForms();
    this.loadData();
  }
  
  initializeForms(): void {
    this.contractForm = this.fb.group({
      contractCode: ['', Validators.required],
      contractName: ['', Validators.required],
      clientName: ['', Validators.required],
      contractValue: ['', [Validators.required, Validators.min(0)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
    
    this.coordinatorForm = this.fb.group({
      coordinatorId: ['', Validators.required],
      zone: ['', Validators.required],
      volume: ['', [Validators.required, Validators.min(1)]]
    });
    
    this.projectForm = this.fb.group({
      projectName: ['', Validators.required],
      projectDescription: ['', Validators.required],
      estimatedDuration: ['', [Validators.required, Validators.min(1)]],
      priority: ['media', Validators.required]
    });
    
    this.resourcesForm = this.fb.group({
      base: ['', Validators.required],
      selectedEmployeeIds: [[]],
      selectedEquipmentIds: [[]],
      selectedVehicleIds: [[]]
    });
    
    this.budgetForm = this.fb.group({
      personalCost: [0, [Validators.required, Validators.min(0)]],
      equipmentCost: [0, [Validators.required, Validators.min(0)]],
      transportCost: [0, [Validators.required, Validators.min(0)]],
      materialsCost: [0, [Validators.required, Validators.min(0)]],
      otherCosts: [0, [Validators.required, Validators.min(0)]],
      notes: ['']
    });
  }
  
  loadData(): void {
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => this.employees = employees,
      error: (error) => {
        console.error('Error cargando empleados:', error);
        this.errorMessage = 'Error al cargar empleados';
      }
    });

    this.equipmentService.getAllEquipment().subscribe({
      next: (equipment) => this.equipment = equipment,
      error: (error) => {
        console.error('Error cargando equipos:', error);
        this.errorMessage = 'Error al cargar equipos';
      }
    });

    this.vehicleService.getAllVehicles().subscribe({
      next: (vehicles) => this.vehicles = vehicles,
      error: (error) => {
        console.error('Error cargando vehículos:', error);
        this.errorMessage = 'Error al cargar vehículos';
      }
    });
  }
  
  get filteredEmployees(): Employee[] {
    if (!this.employeeSearchTerm) return this.employees;
    const term = this.employeeSearchTerm.toLowerCase();
    return this.employees.filter(emp => 
      emp.firstName.toLowerCase().includes(term) ||
      emp.lastName.toLowerCase().includes(term) ||
      emp.position.toLowerCase().includes(term)
    );
  }

  get filteredEquipment(): Equipment[] {
    if (!this.equipmentSearchTerm) return this.equipment;
    const term = this.equipmentSearchTerm.toLowerCase();
    return this.equipment.filter(eq => 
      eq.name.toLowerCase().includes(term) ||
      eq.code.toLowerCase().includes(term) ||
      eq.description.toLowerCase().includes(term)
    );
  }

  get filteredVehicles(): Vehicle[] {
    if (!this.vehicleSearchTerm) return this.vehicles;
    const term = this.vehicleSearchTerm.toLowerCase();
    return this.vehicles.filter(v => 
      v.plateNumber.toLowerCase().includes(term) ||
      v.brand.toLowerCase().includes(term) ||
      v.model.toLowerCase().includes(term)
    );
  }
  
  toggleEmployeeSelection(employee: Employee): void {
    const index = this.selectedEmployees.findIndex(e => e.id === employee.id);
    if (index === -1) {
      this.selectedEmployees.push(employee);
    } else {
      this.selectedEmployees.splice(index, 1);
    }
    this.resourcesForm.patchValue({
      selectedEmployeeIds: this.selectedEmployees.map(e => e.id)
    });
  }
  
  isEmployeeSelected(employee: Employee): boolean {
    return this.selectedEmployees.some(e => e.id === employee.id);
  }
  
  removeEmployee(employee: Employee): void {
    this.selectedEmployees = this.selectedEmployees.filter(e => e.id !== employee.id);
    this.resourcesForm.patchValue({
      selectedEmployeeIds: this.selectedEmployees.map(e => e.id)
    });
  }

  toggleEquipmentSelection(equip: Equipment): void {
    const index = this.selectedEquipment.findIndex(e => e.id === equip.id);
    if (index === -1) {
      this.selectedEquipment.push(equip);
    } else {
      this.selectedEquipment.splice(index, 1);
    }
    this.resourcesForm.patchValue({
      selectedEquipmentIds: this.selectedEquipment.map(e => e.id)
    });
  }
  
  isEquipmentSelected(equip: Equipment): boolean {
    return this.selectedEquipment.some(e => e.id === equip.id);
  }
  
  removeEquipment(equip: Equipment): void {
    this.selectedEquipment = this.selectedEquipment.filter(e => e.id !== equip.id);
    this.resourcesForm.patchValue({
      selectedEquipmentIds: this.selectedEquipment.map(e => e.id)
    });
  }

  toggleVehicleSelection(vehicle: Vehicle): void {
    const index = this.selectedVehicles.findIndex(v => v.id === vehicle.id);
    if (index === -1) {
      this.selectedVehicles.push(vehicle);
    } else {
      this.selectedVehicles.splice(index, 1);
    }
    this.resourcesForm.patchValue({
      selectedVehicleIds: this.selectedVehicles.map(v => v.id)
    });
  }
  
  isVehicleSelected(vehicle: Vehicle): boolean {
    return this.selectedVehicles.some(v => v.id === vehicle.id);
  }
  
  removeVehicle(vehicle: Vehicle): void {
    this.selectedVehicles = this.selectedVehicles.filter(v => v.id !== vehicle.id);
    this.resourcesForm.patchValue({
      selectedVehicleIds: this.selectedVehicles.map(v => v.id)
    });
  }
  
  getTotalBudget(): number {
    const values = this.budgetForm.value;
    return (values.personalCost || 0) + 
           (values.equipmentCost || 0) + 
           (values.transportCost || 0) + 
           (values.materialsCost || 0) + 
           (values.otherCosts || 0);
  }
  
  getCurrentForm(): FormGroup {
    switch (this.currentStep) {
      case 1: return this.contractForm;
      case 2: return this.coordinatorForm;
      case 3: return this.projectForm;
      case 4: return this.resourcesForm;
      case 5: return this.budgetForm;
      default: return this.contractForm;
    }
  }
  
  isStepValid(): boolean {
    return this.getCurrentForm().valid;
  }
  
  nextStep(): void {
    if (this.isStepValid() && this.currentStep < 5) {
      this.currentStep++;
    }
  }
  
  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  
  submitProject(): void {
    if (!this.budgetForm.valid) {
      this.errorMessage = 'Por favor complete todos los campos del presupuesto';
      return;
    }
    
    this.loading = true;
    this.errorMessage = '';
    
    const projectData = {
      contract: this.contractForm.value,
      coordinator: this.coordinatorForm.value,
      projectDetails: this.projectForm.value,
      resources: this.resourcesForm.value,
      budget: this.budgetForm.value
    };
    
    this.projectCreationService.createCompleteProject(projectData).subscribe({
      next: (result) => {
        this.projectResult = result;
        this.loading = false;
        this.showFinalDashboard = true;
      },
      error: (error) => {
        this.errorMessage = 'Error al crear el proyecto. Por favor intente nuevamente.';
        console.error('Error:', error);
        this.loading = false;
      }
    });
  }
  
  getCoordinatorName(): string {
    const coordinatorId = this.coordinatorForm.value.coordinatorId;
    const coordinator = this.coordinadores.find(c => c.id === Number(coordinatorId));
    return coordinator?.name || 'No asignado';
  }
  
  resetWizard(): void {
    this.currentStep = 1;
    this.contractForm.reset();
    this.coordinatorForm.reset();
    this.projectForm.reset();
    this.resourcesForm.reset();
    this.budgetForm.reset();
    this.selectedEmployees = [];
    this.selectedEquipment = [];
    this.selectedVehicles = [];
    this.successMessage = '';
    this.errorMessage = '';
    this.showFinalDashboard = false;
    this.projectResult = null;
  }
  
  createAnotherProject(): void {
    this.resetWizard();
  }
  
  goToDashboard(): void {
    this.router.navigate(['/projects']);
  }
}