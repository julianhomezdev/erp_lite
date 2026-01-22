export interface ProjectWorkInProgress {
  id?: number;
  draftId: string; 
  currentStep: number;
  contractData: any;
  coordinatorData: any;
  projectDetailsData: any;
  resourcesData: any;
  budgetData: any;
  createdDate: Date;
  lastModifiedDate: Date;
  isCompleted: boolean;
}