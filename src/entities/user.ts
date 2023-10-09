import { WithId } from '../types/id';
import { ImageData } from '../types/image.js';
import { Wolf } from './wolf.js';

export type UserLogin = {
  userName: string;
  password: string;
};

export type UserNoId = UserLogin & {
  firstName: string;
  surNames: string;
  email: string;
  employeeNumber: number;
  assingedZone: 'Asturias' | 'Castilla-León' | 'Galicia';
  tracker: number;
  avatar: ImageData;
  wolves: Wolf[];
};

export type User = UserNoId & WithId;
