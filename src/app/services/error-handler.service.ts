import { ErrorHandler, Injectable, inject } from '@angular/core';
import { UtilsService } from './utils.service';
import { FirebaseError } from 'firebase/app';
import { firebaseError } from '../utils/error/firebase/errorFirebase';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService implements ErrorHandler {
  private utils = inject(UtilsService);

  constructor() {}

  async handleError(error: any) {
    await this.utils.dimisLoading();

    if (error.code === 'customError') {
      await this.utils.toastMessage({
        message: error.message,
        color: 'warning',
      });

      return;
    }

    if (error instanceof FirebaseError) {
      await this.utils.toastMessage({
        message: firebaseError(error),
        color: 'warning',
      });

      return;
    }

    if (
      error.error &&
      (error.error === 'popup_closed_by_user' ||
        error.error === 'access_denied' ||
        error.code === '12501')
    ) {
      await this.utils.toastMessage({
        message: 'Autenticação com foi Google cancelada',
        color: 'warning',
      });

      return;
    }

    await this.utils.toastMessage({
      message: 'Erro interno do servidor',
      color: 'danger',
    });
  }
}
