import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { SamplingPlan } from "../../domain/Entities/samplingPlan/sampling-plan.model";

@Injectable({
    
    providedIn: 'root'
})


export class SamplingPlanService {
    
    private http = inject(HttpClient);
    
    
    
    getLastSamplingPlan() {
        
        return this.http.get<SamplingPlan>("http://localhost:5271/api/SamplingPlan")
        
        
    }
    
    createNewSamplingPlan() {
        
        return this.http.post<SamplingPlan>("http://localhost:5271/api/samplingplan", {})
        
    }
    
    
}