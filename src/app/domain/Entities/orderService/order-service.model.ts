export interface OrderService {
    
    id: number;
    odsNumber: string;
    totalValue: number;
    consumedValue: number;
    remainingValue: number;
    isGlobal: boolean;
    
}