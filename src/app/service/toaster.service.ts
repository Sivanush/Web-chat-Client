
import { Injectable } from '@angular/core';
import { toast } from 'ngx-sonner';
import { firstValueFrom, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor() { }

  loadingToaster<T>(observable: Observable<T>, successMessage: string): Promise<T> {
    const promise = firstValueFrom(observable);
  
    toast.promise(promise, {
      loading: 'Loading...',
      success: successMessage,
      error: (error:unknown) => {
        const errorMessage = (error as { error?: { message?: string | string[] } })?.error?.message;
        if (Array.isArray(errorMessage) && errorMessage.length) {
          return errorMessage.join(', ');
        } else if (typeof errorMessage === 'string') {
          return errorMessage;
        }
        return 'An unexpected error occurred.';
      },
    });
    
    return promise;
  }
  





  showSuccess(message: string) {
    toast.success(message, {
      duration: 3000,
    });
  }

  showError(message: string) {
    toast.error(message, {
      duration: 3000,
    });
  }

  showInfo(message: string) {
    toast.info(message, {
      duration: 3000,
    });
  }

  showWarn(message: string) {
    toast.warning(message, {
      duration: 3000,
    });
  }
}