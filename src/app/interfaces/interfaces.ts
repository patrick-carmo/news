import { DocumentData } from '@angular/fire/compat/firestore';
import { FormControl } from '@angular/forms';

export interface News {
  id: number;
  title: string;
  intro: string;
  link: string;
  date: string;
  image: string;
  saved?: boolean;
  liked?: boolean;
  likes: number | DocumentData[];
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  date: Date;
}

export interface FormattedComment extends Comment {
  email: string;
  displayName?: string;
  photoURL?: string;
  formattedDate: string;
}

export interface User {
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  providerId: string;
  uid: string;
}

export interface Likes extends User {
  date: string;
}

export interface AuthForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
}
