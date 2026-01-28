export interface Contract {
    
    id: number;
    contractNumber: string;
    contractName: string;
    totalValue: number;
    consumedValue?: number;
    remainingValue?: number;
    
    
}