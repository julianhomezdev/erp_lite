import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Budget, BudgetItem } from "../../domain/Entities/budget/budget.model";
import { environment } from "../../environments/development.environment";

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Budget`;
  
  /**
   * Crea un nuevo presupuesto con código automático CH-YYYY-XXXX
   */
  createBudget(projectId: number): Observable<Budget> {
    return this.http.post<Budget>(this.apiUrl, { projectId });
  }
  
  /**
   * Obtiene el último presupuesto creado
   */
  getLastBudget(): Observable<Budget> {
    return this.http.get<Budget>(`${this.apiUrl}/last`);
  }
  
  /**
   * Obtiene presupuesto por proyecto
   */
  getBudgetByProject(projectId: number): Observable<Budget> {
    return this.http.get<Budget>(`${this.apiUrl}/project/${projectId}`);
  }
  
  /**
   * Actualiza items del presupuesto
   */
  updateBudgetItems(budgetId: number, items: BudgetItem[]): Observable<Budget> {
    return this.http.put<Budget>(`${this.apiUrl}/${budgetId}/items`, items);
  }
}