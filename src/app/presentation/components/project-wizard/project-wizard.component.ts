import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule, FormArray, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../../../domain/Entities/employee/employee.model';
import { Vehicle } from '../../../domain/Entities/vehicle/vehicle.model';
import { EmployeeService } from '../../../core/services/employee.service';
import { EquipmentService } from '../../../core/services/equipment.service';
import { VehicleService } from '../../../core/services/vehicle.service';
import { ProjectCreationService } from '../../../core/services/project-creation.service';
import { ClientService } from '../../../core/services/client.service';
import { Equipment } from '../../../domain/Entities/Equipment/equipment.model';
import { Client } from '../../../domain/Entities/client/client.model';
import { ProjectCoordinatorService } from '../../../core/services/project-coordinator.service';
import { Coordinator } from '../../../domain/Entities/coordinator/coordinator.model';
import { Location as ProjectLocation } from '../../../domain/Entities/location/location.model';
import { LocationService } from '../../../core/services/location.service';
import { WizardStep } from '../../../domain/Entities/wizard/wizard-step';
import { Matrix } from '../../../domain/Entities/matrix/matrix.model';
import { MatrixService } from '../../../core/services/matrix.service';
import { forkJoin } from 'rxjs';
import { CreateProject } from '../../../domain/Entities/project/project-creation.model';

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
  private clientService = inject(ClientService);
  private projectCoordService = inject(ProjectCoordinatorService);
  private locationService = inject(LocationService);
  private projectCreationService = inject(ProjectCreationService);
  private matrixService = inject(MatrixService);
  private route = inject(ActivatedRoute);
  
  currentStep = 1;
  loading = false;
  successMessage = '';
  errorMessage = '';
  showFinalDashboard = false;
  projectResult: number | null = null;
  dataReady = false;
  
  contractForm!: FormGroup;
  odsForm!: FormGroup;
  planForm!: FormGroup;
  coordinatorForm!: FormGroup;
  
  serviceOrders: any[] = [];
  assignedCoordinators: any[] = [];
  matrices: Matrix[] = [];
  
  locations: ProjectLocation[] = [];
  projectCoordinators: Coordinator[] = [];
  clients: Client[] = [];
  employees: Employee[] = [];
  equipment: Equipment[] = [];
  vehicles: Vehicle[] = [];
  
  steps: WizardStep[] = [
    { id: 1, title: 'Contrato', description: 'Datos del contrato', icon: '📄' },
    { id: 2, title: 'Órdenes de Servicio', description: 'ODS del contrato', icon: '📋' },
    { id: 3, title: 'Planes de Muestreo', description: 'Planes por ODS', icon: '📍' },
    { id: 4, title: 'Coordinadores', description: 'Asignación', icon: '👥' },
    { id: 5, title: 'Resumen', description: 'Verificación final', icon: '✓' }
  ];
  
  currentOdsIndex: number = -1;
  currentPlanIndex: number = -1;
  editingPlan: boolean = false;

  ngOnInit(): void {
    this.initializeForms();
    this.loadData();
  }
  
  /**
   * Inicializa todos los formularios con validaciones mínimas y opcionales
   */
  initializeForms(): void {
    // Contrato: solo campos esenciales son requeridos
    this.contractForm = this.fb.group({
      contractCode: ['', Validators.required],
      contractName: [''],
      clientId: ['', Validators.required],
      startDate: [''],
      endDate: ['']
    });
    
    // ODS: solo código requerido para agregar
    this.odsForm = this.fb.group({
      odsCode: ['', Validators.required],
      odsName: [''],
      startDate: [''],
      endDate: ['']
    });
    
    // Plan: solo código requerido, el resto es opcional
    this.planForm = this.fb.group({
      planCode: ['', Validators.required],
      startDate: [''],
      endDate: [''],
      sitesCount: [1],
      sites: this.fb.array([]),
      resourceStartDate: [''],
      resourceEndDate: [''],
      selectedEmployeeIds: [[]],
      selectedEquipmentIds: [[]],
      selectedVehicleIds: [[]],
      chCode: [''],
      transportCostChemilab: [0],
      transportBilledToClient: [0],
      logisticsCostChemilab: [0],
      logisticsBilledToClient: [0],
      subcontractingCostChemilab: [0],
      subcontractingBilledToClient: [0],
      fluvialTransportCostChemilab: [0],
      fluvialTransportBilledToClient: [0],
      reportsCostChemilab: [0],
      reportsBilledToClient: [0],
      notes: ['']
    });
    
    // Coordinador: solo para agregar, no bloquea avance si no hay ninguno
    this.coordinatorForm = this.fb.group({
      coordinatorId: [null]
    });
  }
  
  get sitesArray(): FormArray {
    return this.planForm.get('sites') as FormArray;
  }
  
  loadData(): void {
    forkJoin({
      clients: this.clientService.getAllClients(),
      employees: this.employeeService.getAllEmployees(),
      equipment: this.equipmentService.getAllEquipment(),
      vehicles: this.vehicleService.getAllVehicles(),
      locations: this.locationService.getAllLocations(),
      matrices: this.matrixService.getAllMatrix(),
      coordinators: this.projectCoordService.getAllCoordinators()
    }).subscribe(result => {
      this.clients = result.clients;
      this.employees = result.employees;
      this.equipment = result.equipment;
      this.vehicles = result.vehicles;
      this.locations = result.locations;
      this.matrices = result.matrices;
      this.projectCoordinators = result.coordinators;
      this.dataReady = true;
    });
  }

  getClientName(): string {
    const clientId = this.contractForm.value.clientId;
    const client = this.clients.find(c => c.id === Number(clientId));
    return client?.name || 'No asignado';
  }

  /**
   * Valida si una ODS puede ser agregada
   */
  private validateOdsForAdd(): { valid: boolean; message: string } {
    if (!this.odsForm.get('odsCode')?.value?.trim()) {
      return { valid: false, message: 'Ingrese un código para la ODS' };
    }
    return { valid: true, message: '' };
  }

  addServiceOrder(): void {
    const validation = this.validateOdsForAdd();
    
    if (!validation.valid) {
      this.errorMessage = validation.message;
      return;
    }

    const ods = {
      odsCode: this.odsForm.value.odsCode,
      odsName: this.odsForm.value.odsName || this.odsForm.value.odsCode,
      startDate: this.odsForm.value.startDate,
      endDate: this.odsForm.value.endDate,
      samplingPlans: []
    };

    this.serviceOrders.push(ods);
    this.odsForm.reset();
    this.errorMessage = '';
  }

  removeServiceOrder(index: number): void {
    this.serviceOrders.splice(index, 1);
  }

  selectOdsForPlans(index: number): void {
    this.currentOdsIndex = index;
    this.currentStep = 3;
  }

  updateSitesCount(): void {
    const count = this.planForm.get('sitesCount')?.value || 0;
    const currentLength = this.sitesArray.length;
    
    if (count > currentLength) {
      for (let i = currentLength; i < count; i++) {
        this.addSite();
      }
    } else if (count < currentLength) {
      for (let i = currentLength; i > count; i--) {
        this.sitesArray.removeAt(i - 1);
      }
    }
  }

  /**
   * Agrega un sitio sin validaciones requeridas por defecto
   */
  addSite(): void {
    const siteGroup = this.fb.group({
      name: [''],
      matrixId: [''],
      executionDate: [''],
      hasReport: [false],
      hasGDB: [false]
    });
    this.sitesArray.push(siteGroup);
  }

  removeSite(index: number): void {
    this.sitesArray.removeAt(index);
    this.planForm.patchValue({
      sitesCount: this.sitesArray.length
    });
  }

  /**
   * Valida sitios solo si hay elementos en el array
   */
  private validateSitesIfPresent(): { valid: boolean; message: string } {
    if (this.sitesArray.length === 0) {
      return { valid: true, message: '' };
    }

    for (let i = 0; i < this.sitesArray.length; i++) {
      const site = this.sitesArray.at(i).value;
      if (!site.name?.trim()) {
        return { valid: false, message: `El sitio ${i + 1} requiere un nombre` };
      }
      if (!site.matrixId) {
        return { valid: false, message: `El sitio ${i + 1} requiere una matriz` };
      }
    }

    return { valid: true, message: '' };
  }

  /**
   * Valida plan antes de agregarlo a la ODS
   */
  private validatePlanForAdd(): { valid: boolean; message: string } {
    if (!this.planForm.get('planCode')?.value?.trim()) {
      return { valid: false, message: 'Ingrese un código para el plan de muestreo' };
    }

    // Validar sitios solo si existen
    const sitesValidation = this.validateSitesIfPresent();
    if (!sitesValidation.valid) {
      return sitesValidation;
    }

    return { valid: true, message: '' };
  }

  addPlanToCurrentOds(): void {
    const validation = this.validatePlanForAdd();
    
    if (!validation.valid) {
      this.errorMessage = validation.message;
      return;
    }

    const sites = this.sitesArray.value.map((site: any) => {
      const matrix = this.matrices.find(m => m.id === Number(site.matrixId));
      return {
        name: site.name,
        matrixId: Number(site.matrixId),
        matrixName: matrix?.matrixName || '',
        executionDate: site.executionDate,
        hasReport: site.hasReport,
        hasGDB: site.hasGDB
      };
    });

    const selectedEmployees = this.employees.filter(e => 
      this.planForm.value.selectedEmployeeIds.includes(e.id)
    );
    const selectedEquipment = this.equipment.filter(e => 
      this.planForm.value.selectedEquipmentIds.includes(e.id)
    );
    const selectedVehicles = this.vehicles.filter(v => 
      this.planForm.value.selectedVehicleIds.includes(v.id)
    );

    const plan = {
      planCode: this.planForm.value.planCode,
      startDate: this.planForm.value.startDate,
      endDate: this.planForm.value.endDate,
      sites: sites,
      resources: {
        startDate: this.planForm.value.resourceStartDate,
        endDate: this.planForm.value.resourceEndDate,
        employeeIds: this.planForm.value.selectedEmployeeIds,
        equipmentIds: this.planForm.value.selectedEquipmentIds,
        vehicleIds: this.planForm.value.selectedVehicleIds,
        employees: selectedEmployees,
        equipment: selectedEquipment,
        vehicles: selectedVehicles
      },
      budget: {
        chCode: this.planForm.value.chCode,
        transportCostChemilab: this.planForm.value.transportCostChemilab || 0,
        transportBilledToClient: this.planForm.value.transportBilledToClient || 0,
        logisticsCostChemilab: this.planForm.value.logisticsCostChemilab || 0,
        logisticsBilledToClient: this.planForm.value.logisticsBilledToClient || 0,
        subcontractingCostChemilab: this.planForm.value.subcontractingCostChemilab || 0,
        subcontractingBilledToClient: this.planForm.value.subcontractingBilledToClient || 0,
        fluvialTransportCostChemilab: this.planForm.value.fluvialTransportCostChemilab || 0,
        fluvialTransportBilledToClient: this.planForm.value.fluvialTransportBilledToClient || 0,
        reportsCostChemilab: this.planForm.value.reportsCostChemilab || 0,
        reportsBilledToClient: this.planForm.value.reportsBilledToClient || 0,
        notes: this.planForm.value.notes || ''
      }
    };

    this.serviceOrders[this.currentOdsIndex].samplingPlans.push(plan);
    this.resetPlanForm();
    this.errorMessage = '';
  }

  resetPlanForm(): void {
    this.planForm.reset({
      sitesCount: 1,
      transportCostChemilab: 0,
      transportBilledToClient: 0,
      logisticsCostChemilab: 0,
      logisticsBilledToClient: 0,
      subcontractingCostChemilab: 0,
      subcontractingBilledToClient: 0,
      fluvialTransportCostChemilab: 0,
      fluvialTransportBilledToClient: 0,
      reportsCostChemilab: 0,
      reportsBilledToClient: 0,
      selectedEmployeeIds: [],
      selectedEquipmentIds: [],
      selectedVehicleIds: []
    });
    this.sitesArray.clear();
    this.addSite();
  }

  removePlanFromOds(odsIndex: number, planIndex: number): void {
    this.serviceOrders[odsIndex].samplingPlans.splice(planIndex, 1);
  }

  backToOdsList(): void {
    this.currentOdsIndex = -1;
    this.currentStep = 2;
    this.resetPlanForm();
  }

  toggleEmployeeSelection(employeeId: number): void {
    const current = this.planForm.value.selectedEmployeeIds || [];
    const index = current.indexOf(employeeId);
    
    if (index === -1) {
      this.planForm.patchValue({
        selectedEmployeeIds: [...current, employeeId]
      });
    } else {
      current.splice(index, 1);
      this.planForm.patchValue({
        selectedEmployeeIds: [...current]
      });
    }
  }

  isEmployeeSelected(employeeId: number): boolean {
    return (this.planForm.value.selectedEmployeeIds || []).includes(employeeId);
  }

  toggleEquipmentSelection(equipmentId: number): void {
    const current = this.planForm.value.selectedEquipmentIds || [];
    const index = current.indexOf(equipmentId);
    
    if (index === -1) {
      this.planForm.patchValue({
        selectedEquipmentIds: [...current, equipmentId]
      });
    } else {
      current.splice(index, 1);
      this.planForm.patchValue({
        selectedEquipmentIds: [...current]
      });
    }
  }

  isEquipmentSelected(equipmentId: number): boolean {
    return (this.planForm.value.selectedEquipmentIds || []).includes(equipmentId);
  }

  toggleVehicleSelection(vehicleId: number): void {
    const current = this.planForm.value.selectedVehicleIds || [];
    const index = current.indexOf(vehicleId);
    
    if (index === -1) {
      this.planForm.patchValue({
        selectedVehicleIds: [...current, vehicleId]
      });
    } else {
      current.splice(index, 1);
      this.planForm.patchValue({
        selectedVehicleIds: [...current]
      });
    }
  }

  isVehicleSelected(vehicleId: number): boolean {
    return (this.planForm.value.selectedVehicleIds || []).includes(vehicleId);
  }

  getPlanBudgetTotal(plan: any): number {
    const b = plan.budget;
    return (b.transportCostChemilab || 0) + (b.transportBilledToClient || 0) +
           (b.logisticsCostChemilab || 0) + (b.logisticsBilledToClient || 0) +
           (b.subcontractingCostChemilab || 0) + (b.subcontractingBilledToClient || 0) +
           (b.fluvialTransportCostChemilab || 0) + (b.fluvialTransportBilledToClient || 0) +
           (b.reportsCostChemilab || 0) + (b.reportsBilledToClient || 0);
  }

  getCurrentPlanBudgetTotal(): number {
    const v = this.planForm.value;
    return (v.transportCostChemilab || 0) + (v.transportBilledToClient || 0) +
           (v.logisticsCostChemilab || 0) + (v.logisticsBilledToClient || 0) +
           (v.subcontractingCostChemilab || 0) + (v.subcontractingBilledToClient || 0) +
           (v.fluvialTransportCostChemilab || 0) + (v.fluvialTransportBilledToClient || 0) +
           (v.reportsCostChemilab || 0) + (v.reportsBilledToClient || 0);
  }

  addCoordinator(): void {
    const coordinatorId = this.coordinatorForm.value.coordinatorId;
    
    if (!coordinatorId) {
      this.errorMessage = 'Seleccione un coordinador';
      return;
    }

    const coordinator = this.projectCoordinators.find(c => c.id === Number(coordinatorId));
    
    if (coordinator) {
      // Evitar duplicados
      const alreadyAdded = this.assignedCoordinators.some(c => c.coordinatorId === Number(coordinatorId));
      if (alreadyAdded) {
        this.errorMessage = 'Este coordinador ya fue agregado';
        return;
      }

      this.assignedCoordinators.push({
        coordinatorId: Number(coordinatorId),
        coordinatorName: coordinator.name
      });
      this.coordinatorForm.reset();
      this.errorMessage = '';
    }
  }

  removeCoordinator(index: number): void {
    this.assignedCoordinators.splice(index, 1);
  }

  /**
   * Validación inteligente por paso
   * - Paso 1: Validar contrato
   * - Paso 2: Al menos una ODS (sin forzar planes)
   * - Paso 3: Libre (permite salir sin agregar planes)
   * - Paso 4: Al menos un coordinador
   * - Paso 5: Siempre válido (resumen)
   */
  isStepValid(): boolean {
    switch (this.currentStep) {
      case 1:
        // Contrato: código y cliente requeridos
        return this.contractForm.valid;
      
      case 2:
        // ODS: al menos una agregada
        return this.serviceOrders.length > 0;
      
      case 3:
        // Planes: siempre válido, no bloquea avance
        // El usuario decide si agrega o no planes
        return true;
      
      case 4:
        // Coordinadores: al menos uno
        return this.assignedCoordinators.length > 0;
      
      case 5:
        // Resumen: siempre válido
        return true;
      
      default:
        return false;
    }
  }

  /**
   * Validación especial antes de avanzar
   */
  private canAdvanceFromStep(): { canAdvance: boolean; message: string } {
    // Si está editando una ODS en paso 3, advertir pero no bloquear
    if (this.currentStep === 3 && this.currentOdsIndex !== -1) {
      return { 
        canAdvance: false, 
        message: 'Vuelva a la lista de ODS antes de continuar (botón "← Volver a ODS")'
      };
    }

    return { canAdvance: true, message: '' };
  }

  nextStep(): void {
    const advanceCheck = this.canAdvanceFromStep();
    
    if (!advanceCheck.canAdvance) {
      this.errorMessage = advanceCheck.message;
      return;
    }
    
    if (this.isStepValid() && this.currentStep < 5) {
      this.currentStep++;
      this.errorMessage = '';
    } else if (!this.isStepValid()) {
      this.errorMessage = this.getStepValidationMessage();
    }
  }

  /**
   * Mensajes personalizados por paso
   */
  private getStepValidationMessage(): string {
    switch (this.currentStep) {
      case 1:
        return 'Complete el código del contrato y seleccione un cliente';
      case 2:
        return 'Agregue al menos una Orden de Servicio';
      case 4:
        return 'Asigne al menos un coordinador al proyecto';
      default:
        return 'Complete los campos requeridos';
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.errorMessage = '';
    }
  }

  /**
   * Validación final antes de crear el proyecto
   */
  private validateCompleteProject(): { valid: boolean; message: string } {
    if (!this.contractForm.valid) {
      return { valid: false, message: 'El contrato tiene datos incompletos' };
    }

    if (this.serviceOrders.length === 0) {
      return { valid: false, message: 'Debe agregar al menos una Orden de Servicio' };
    }

    if (this.assignedCoordinators.length === 0) {
      return { valid: false, message: 'Debe asignar al menos un coordinador' };
    }

    // Validar que cada ODS tenga al menos un plan si se requiere
    // (esto es opcional según tu lógica de negocio)
    const odsWithoutPlans = this.serviceOrders.filter(ods => ods.samplingPlans.length === 0);
    if (odsWithoutPlans.length > 0) {
      // Solo advertencia, no bloqueo
      console.warn(`${odsWithoutPlans.length} ODS sin planes de muestreo`);
    }

    return { valid: true, message: '' };
  }

  submitProject(): void {
    const validation = this.validateCompleteProject();
    
    if (!validation.valid) {
      this.errorMessage = validation.message;
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    
    const contractData = this.contractForm.value;
    
    const serviceOrders = this.serviceOrders.map(ods => ({
      OdsCode: ods.odsCode,
      OdsName: ods.odsName,
      StartDate: ods.startDate,
      EndDate: ods.endDate,
      SamplingPlans: ods.samplingPlans.map((plan: any) => ({
        PlanCode: plan.planCode,
        StartDate: plan.startDate,
        EndDate: plan.endDate,
        Sites: plan.sites.map((site: any) => ({
          Name: site.name,
          MatrixId: site.matrixId,
          ExecutionDate: site.executionDate,
          HasReport: site.hasReport,
          HasGDB: site.hasGDB
        })),
        Resources: {
          StartDate: plan.resources.startDate,
          EndDate: plan.resources.endDate,
          EmployeeIds: plan.resources.employeeIds,
          EquipmentIds: plan.resources.equipmentIds,
          VehicleIds: plan.resources.vehicleIds
        },
        Budget: {
          CHCode: plan.budget.chCode,
          TransportCostChemilab: plan.budget.transportCostChemilab,
          TransportBilledToClient: plan.budget.transportBilledToClient,
          LogisticsCostChemilab: plan.budget.logisticsCostChemilab,
          LogisticsBilledToClient: plan.budget.logisticsBilledToClient,
          SubcontractingCostChemilab: plan.budget.subcontractingCostChemilab,
          SubcontractingBilledToClient: plan.budget.subcontractingBilledToClient,
          FluvialTransportCostChemilab: plan.budget.fluvialTransportCostChemilab,
          FluvialTransportBilledToClient: plan.budget.fluvialTransportBilledToClient,
          ReportsCostChemilab: plan.budget.reportsCostChemilab,
          ReportsBilledToClient: plan.budget.reportsBilledToClient,
          Notes: plan.budget.notes
        }
      }))
    }));
    
    const projectDto: CreateProject = {
      Contract: {
        ContractCode: contractData.contractCode,
        ContractName: contractData.contractName || '',
        ClientId: Number(contractData.clientId),
        StartDate: contractData.startDate,
        EndDate: contractData.endDate
      },
      ServiceOrders: serviceOrders,
      CoordinatorIds: this.assignedCoordinators.map(c => c.coordinatorId),
      ProjectDetails: {
        ProjectName: contractData.contractName || contractData.contractCode,
        ProjectDescription: '',
        Priority: 'media'
      }
    };
    
    this.projectCreationService.createCompleteProject(projectDto).subscribe({
      next: (result) => {
        this.projectResult = result;
        this.loading = false;
        this.showFinalDashboard = true;
      },
      error: (error) => {
        this.errorMessage = 'Error al crear el proyecto: ' + (error.error?.message || error.message);
        console.error('Error completo:', error);
        this.loading = false;
      }
    });
  }

  resetWizard(): void {
    this.currentStep = 1;
    this.contractForm.reset();
    this.odsForm.reset();
    this.resetPlanForm();
    this.coordinatorForm.reset();
    this.serviceOrders = [];
    this.assignedCoordinators = [];
    this.currentOdsIndex = -1;
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