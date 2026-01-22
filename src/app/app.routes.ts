import { Routes } from '@angular/router';
import { loginGuard } from './infrastructure/guards/login.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [loginGuard],
    loadComponent: () =>
      import('./presentation/pages/auth/auth-page.component')
        .then(m => m.LoginPage)
  },
  {
    path: '',
    loadComponent: () =>
      import('./presentation/layouts/main-layout/main-layout.component')
        .then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./presentation/pages/main-page/main-page.component')
            .then(m => m.MainPage)
      },
      {
        
        path: 'logistics',
        loadComponent: () =>
          
          import('./presentation/pages/logistics/logistics-page.component')
            .then(m => m.LogisticsPage)
        
      },
      {
        
        path: 'rh',
        loadComponent: () =>
          
          import('./presentation/pages/rh/rh-page.component')
            .then(m => m.RhPage)

        
      },
      {
        
        path: 'projects-dashboard',
        loadComponent: () =>
          
          import('./presentation/pages/project-dashboard/project-dashboard.component')
            .then(m => m.DashboardPage)
        
        
      },
      {
        path: 'project-drafts',
        loadComponent: () =>
          
          import ('./presentation/pages/project-drafts/project-draft.component')
            .then(m => m.ProjectDraftsPage)
        
        
        
      },
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
    ]
  }
];