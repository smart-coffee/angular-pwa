import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { catchError } from 'rxjs/operators';
import { ServiceError } from '../shared/errorhandling/service-error';

@Injectable({
  providedIn: 'root'
})
export class CoffeeJobService {

  private _error = new ServiceError();

  constructor(private http: HttpClient) { }

  getAllJobs(): Observable<any> {
    return this.http.get<any>(`${environment.webApiUrl}/jobs`)
      .pipe(
        catchError(this._error.handleError<any>(`getAllJobs`))
      );
  }

  getCurrentUserJobs(): Observable<any> {
    return this.http.get<any>(`${environment.webApiUrl}/users/current/jobs`)
      .pipe(
        catchError(this._error.handleError<any>(`getCurrentUserJobs`))
      );
  }
}
