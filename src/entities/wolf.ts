import { WithId } from '../types/id.js';
import { User } from './user.js';

export type Wolf = WithId & {
  codeName: string;
  nickname: string;
  age: number;
  pack: 'As01' | 'CL01' | 'CL02' | 'Ga01';
  territory: 'Asturias' | 'Castilla-León' | 'Galicia';
  tracks: string[];
  specialist: User;
  images: ImageData[];
  isAlpha: boolean;
  isFemale: boolean;
  comments: string;
};
