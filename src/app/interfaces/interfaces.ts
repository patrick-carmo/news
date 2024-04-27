import firebase from 'firebase/compat/app';

export interface News {
  id: number;
  title: string;
  intro: string;
  link: string;
  date: string;
  image: string;
  saved?: boolean;
}

export interface User {
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  providerId: string;
  uid: string;
}
