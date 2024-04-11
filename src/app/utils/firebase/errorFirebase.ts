import { firebaseErrorObj } from './errorObjMessage';

export const firebaseError = (error: any): string => {
  const errorMessage = firebaseErrorObj[error.code];
  return errorMessage ?? 'Erro interno do servidor';
};
