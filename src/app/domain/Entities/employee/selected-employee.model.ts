import { Employee } from "./employee.model";

export interface SelectedEmployee extends Employee {

    selected: boolean;

}