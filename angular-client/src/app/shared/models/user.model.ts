export interface User {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phone?: string;
  gender?: string;
  dob?: string;
  role: string;
  isVerified: boolean;
}
