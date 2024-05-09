import { FormControl } from '@angular/forms';
import { Timestamp } from 'firebase/firestore';

export interface News {
  id: number;
  title: string;
  intro: string;
  link: string;
  date: string;
  image: string;
  saved?: boolean;
}

export interface Comment {
  email: string;
  displayName?: string;
  photoURL?: string;
  content: string;
  date: Date | string;
}

export interface User {
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  providerId: string;
  uid: string;
}

export interface AuthForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
}
