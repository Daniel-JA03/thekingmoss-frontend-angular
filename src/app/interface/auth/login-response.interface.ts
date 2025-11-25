export interface LoginResponse {
  token: string;
  username: string;
  email: string;
  roles: string[];
  expirateAt: number;
}


