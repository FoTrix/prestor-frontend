export interface User {
    id: number;
    username: string;
    email: string;
    password: string; // Este campo llega en la respuesta, pero no se recomienda mostrarlo en frontend
    role: "ADMIN";
    enabled: boolean;
  }
  
  export interface AuthResponse {
    message: string;
    token?: string; // Solo presente en login
    user: User;
  }
  
  export interface LoginFormValues {
    username: string;
    password: string;
  }
  
// ... existing code ...
export interface RegisterFormValues {
    username: string;
    email: string;
    nombre: string;
    pais: string;
    ciudad: string;
    direccion: string;
    rut: string;
    password: string;
    terms: boolean;
    acceptedTerms: boolean;
  }
  