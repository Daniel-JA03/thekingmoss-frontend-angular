export interface LoginResponse {
  token: string;
  username: string;
  roles: string[];
  expirateAt: number;
}


