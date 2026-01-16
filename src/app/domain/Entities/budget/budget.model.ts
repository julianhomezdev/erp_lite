export interface Budget {
    
  id: number;
  budgetCode: string; 
  projectId: number;
  totalAmount: number;
  allocatedAmount: number;
  remainingAmount: number;
  status: 'Pendiente' | 'Aprobado' | 'En Uso' | 'Cerrado';
  createdAt: string;

    
    
}


export interface BudgetItem {
  id: number;
  budgetId: number;
  concept: string;
  estimatedAmount: number;
  actualAmount: number;
  category: 'Personal' | 'Equipos' | 'Transporte' | 'Materiales' | 'Otros';
}