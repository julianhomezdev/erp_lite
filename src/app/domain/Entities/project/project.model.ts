import { Coordinator } from "../coordinator/coordinator.model";
import { EmployeeAssignment } from "../employee/employe-assignment.model";
import { OrderService } from "../orderService/order-service.model";
import { VehicleAssignment } from "../vehicle/vehicle-assignment.model";
import { ProjectBudget } from "./project-budget.model";
import { SamplingPlan } from "./project-creation.model";

export interface CreateProject  {
    
    
    name: string;
    startDate: Date;
    endDate: Date;
    clientId: number;
    contractId?: number;
    serviceOrders?: OrderService[];
    operationalBases: Location[];  
    projectCoordinators: Coordinator[];    
    samplingPlans: SamplingPlan[];
        
    
}