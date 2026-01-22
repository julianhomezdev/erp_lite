import { MonitoringSite } from "./monitoring-site";

export interface SamplingPlan {
  code: string;
  sitesCount: number;
  sites: MonitoringSite[];
}