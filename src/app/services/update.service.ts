import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  constructor(private swUpdate: SwUpdate) {
    this.swUpdate.available.subscribe(evt => {
      console.log(`an update for the service worker is available ... reloading content`);
      window.location.reload();
    });
  }
}
