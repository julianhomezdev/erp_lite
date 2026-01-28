import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { SamplingPlan } from "../../domain/Entities/samplingPlan/sampling-plan.model";
import { environment } from "../../environments/development.environment";

@Injectable({
    
    providedIn: 'root'
})


export class SamplingPlanService {
    
    private http = inject(HttpClient);
    
    private apiUrl = `${environment.apiUrl}/SamplingPlan`;
    
    
    
    getLastSamplingPlan() {
        
        return this.http.get<SamplingPlan>(this.apiUrl)
        
        
    }
    
    createNewSamplingPlan() {
        
        return this.http.post<SamplingPlan>(this.apiUrl, {})
        
    }
    
    
}