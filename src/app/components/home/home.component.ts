import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  buttonsEnabled: boolean;

  constructor(private router: Router) { }

  ngOnInit() {
    localStorage.setItem('cupSelection', '1');
    this.buttonsEnabled = false;
  }

  enableButtons(eventInput: boolean) {
    this.buttonsEnabled = eventInput;
  }

  navigateToRoute (tmpRouteName: string) {
    let routeName = tmpRouteName;

    // absolute mega hack, i dare you to top this shitty shit
    if (routeName === 'one-cup-preferences') {
      localStorage.setItem('cupSelection', '1');
      routeName = 'coffee-preferences';
    } else if ( routeName === 'two-cup-preferences') {
      localStorage.setItem('cupSelection', '2');
      routeName = 'coffee-preferences';
    }

    if (this.buttonsEnabled) {
      this.router.navigate([routeName]);
    }
  }

}
