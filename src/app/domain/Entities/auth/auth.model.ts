export interface LoginRequest {
    
    userName: string;
    password: string;
    
}

export interface LoginResponse {
    
    success: boolean;
    message: string;
    token: string;
    user: {
        
        id: number;
        userName: string;
        
    };
    
}

export interface AuthUser {
    
    id: number;
    userName: string;
    token: string;
    
}