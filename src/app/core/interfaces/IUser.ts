import { Roles } from "../models/roles";

export interface IUser {
  id?: number;
  role: Roles;
  firstname: string;
  lastname: string;
  username?: string;
  mfaEnabled?: boolean;
  email?: string;
  number?: number;
  yuutelNumber?: number;
  isActive?: boolean;
  description?: string;
}
