import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { EmployeeRepository } from './domain/repositories/employee-repository/employee.repository';
import { EmployeeRepositoryImpl } from './infrastructure/repositories/employee-repositories-impl/employee.repository.impl';

export const appConfig: ApplicationConfig = {
  
  providers: [
    
    provideZoneChangeDetection({ eventCoalescing: true }),
    
    provideRouter(routes),
    
    provideHttpClient(withFetch()),
    
    {
      provide: EmployeeRepository,
      
      useClass: EmployeeRepositoryImpl
      
    }
  ]
};
