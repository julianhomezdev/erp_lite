import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    
    path: 'planner',
    
    loadComponent: () =>
        
      import('./presentation/pages/project-wizard/project-wizard.component')
      
        .then(m => m.WizardPage),
        
    children: [
        
      {
        path: 'create-project',
        
        loadComponent: () =>
            
          import('./presentation/pages/project-wizard/project-wizard.component')
          
            .then(m => m.WizardPage)
            
      },
      {
        
        path: 'create-contract',
        
        loadComponent: () =>
            
          import('./presentation/pages/contract/contract.component')
          
            .then(m => m.ContractPage)
            
      },
      
      {
        
        path: 'create-budget',
        
        loadComponent: () =>
            
          import('./presentation/pages/budget/budget.component')
          
            .then(m => m.BudgetPage)
            
      },
      
      {
        
        path: 'create-sampling-plan',
        
        loadComponent: () =>
          
          import('./presentation/pages/sampling-plan/sampling-plan.component')
          
            .then(m => m.SamplingPlanPage)
        
        
      },
      
      {
        
        path: 'order-service',
        
        loadComponent: () =>
          
          import('./presentation/pages/order-service/order-service.component')
          
            .then(m => m.OrderServicePage)
        
        
        
      }
    ]
  }
];
