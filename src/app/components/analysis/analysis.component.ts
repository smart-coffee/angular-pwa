import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent implements OnInit {

  menuState: number;

  constructor(private router: Router) { }

  ngOnInit() {
    this.menuState = 1;
  }

  goToHome () {
    this.router.navigate(['home']);
  }
}
