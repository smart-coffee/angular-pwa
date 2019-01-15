import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';
import { ServiceError } from '../shared/errorhandling/service-error';
import { Cacheable } from 'ngx-cacheable';

const cacheBuster = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class CoffeeMachineService {

  private _error = new ServiceError();

  constructor(private http: HttpClient) { }

  @Cacheable({
    cacheBusterObserver: cacheBuster,
    maxAge: 180000
  })
  getCoffeeMachines(): Observable<any> {
    return this.http.get<any>(`${environment.balenaApiUrl}/devices`)
      .pipe(
        catchError(this._error.handleError<any>(`getCoffeeMachines`))
      );
  }

  @Cacheable({
    cacheBusterObserver: cacheBuster,
    maxAge: 180000
  })
  getCoffeeMachineNameById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.webApiUrl}/coffee/machines/${id}`)
      .pipe(
        catchError(this._error.handleError<any>(`getCoffeeMachineName`))
      );
  }

  @Cacheable({
    cacheBusterObserver: cacheBuster,
    maxAge: 180000
  })
  getCoffeeMachineStatus(uuid: string): Observable<any> {
    return this.http.get<any>(`https://${uuid}.balena-devices.com/api/device/status`)
      .pipe(
        catchError(this._error.handleError<any>(`getCoffeeMachineStatus`))
      );
  }

  putNewCoffeeMachineRuntimeState(uuid: string, runtimeState: number): Observable<any> {
    const runtimeStateObject = { coffee_machine_runtime_state: runtimeState };
    return this.http.put<any>(`https://${uuid}.balena-devices.com/api/device/status`, runtimeStateObject)
      .pipe(
        catchError(this._error.handleError<any>(`putNewCoffeeMachineRuntimeStatus`))
      );
  }

  @Cacheable({
    cacheBusterObserver: cacheBuster,
    maxAge: 180000
  })
  getCoffeeMachineSettings(uuid: string): Observable<any> {
    return this.http.get<any>(`https://${uuid}.balena-devices.com/api/device/settings`)
      .pipe(
        catchError(this._error.handleError<any>(`getCoffeeMachineSettings`))
      );
  }

  @Cacheable({
    cacheBusterObserver: cacheBuster,
    maxAge: 180000
  })
  postNewCoffeeJob(uuid: string, jobDetails: any): Observable<any> {
    return this.http.post<any>(`https://${uuid}.balena-devices.com/api/device/job`, jobDetails)
      .pipe(
        catchError(this._error.handleError<any>(`postNewCoffeeJob`, jobDetails))
      );
  }
}
