import { Vehicle } from "./vehicle.model";

export interface VehicleAssignmentResponse {
  id: number;
  vehicle: Vehicle;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}