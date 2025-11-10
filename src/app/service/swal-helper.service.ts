import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SwalHelperService {
  /**
   * Generic method to confirm an async operation with retry support.
   * @param title Dialog title
   * @param text Optional description
   * @param action Function returning a Promise or Observable (async operation)
   */
  async confirmWithRetry<T>(
    title: string,
    text: string,
    action: () => Promise<T> | any
  ): Promise<T | null> {
    const attemptAction = async (): Promise<T | null> => {
      return Swal.fire({
        title,
        text,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading(),

        preConfirm: async () => {
          try {
            const result = await action();
            return result;
          } catch (error: any) {
            Swal.close(); // close loading dialog

            const message = error?.message || 'An unexpected error occurred';

            // 🔁 Show retry dialog
            Swal.fire({
              icon: 'error',
              title: 'Operation Failed',
              text: message,
              showCancelButton: true,
              confirmButtonText: 'Retry',
              cancelButtonText: 'Close',
              allowOutsideClick: true,
              allowEscapeKey: true,
              didOpen: () => {
                const confirmButton = Swal.getConfirmButton();
                confirmButton!.addEventListener('click', () => {
                  confirmButton!.disabled = true;
                  confirmButton!.textContent = 'Retrying...';
                });
              },
            }).then((retryResult) => {
              if (retryResult.isConfirmed) {
                attemptAction(); // 🔁 Retry
              }
            });

            throw error; // stop success flow
          }
        },
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          return result.value as T;
        }
        return null;
      });
    };

    return attemptAction();
  }

  /**
   * Simple success dialog
   */
  showSuccess(message: string): void {
    Swal.fire('Success', message, 'success');
  }

  /**
   * Simple error dialog
   */
  showError(message: string): void {
    Swal.fire('Error', message, 'error');
  }
}
