import { AfterViewInit, Component } from '@angular/core';
import { Router, NavigationStart, NavigationCancel, NavigationEnd } from '@angular/router';
import { UpdateService } from './services/update.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'smart-coffee-angular';

  loading: boolean;

  constructor (private updateService: UpdateService, private router: Router) {
    this.loading = true;
  }

  ngAfterViewInit() {
    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.loading = true;
        } else if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
          this.loading = false;
        }
      });
  }
}
