import { MonitoringSite } from "../project/monitoring-site";

export interface SamplingPlan {
    
    samplingPlanCode: string;
    sitesCount: number;
    sites: MonitoringSite[];    

    
    
}