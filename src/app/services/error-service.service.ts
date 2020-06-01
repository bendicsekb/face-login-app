import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService{

  handleError(error: any, errorType: any){
      // redirect to error logging page
      alert(errorType);
  }
}

