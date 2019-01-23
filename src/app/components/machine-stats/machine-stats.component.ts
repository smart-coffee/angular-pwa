import { Component, OnInit } from '@angular/core';
import {CoffeeJobService} from '../../services/coffee-job.service';

@Component({
  selector: 'app-machine-stats',
  templateUrl: './machine-stats.component.html',
  styleUrls: ['./machine-stats.component.scss']
})
export class MachineStatsComponent implements OnInit {

  totalAmountOfCoffeesBrewed: number;

  showNotificationModal: boolean;
  modalMessages: string[];
  modalType: string;

  constructor(private jobService: CoffeeJobService) { }

  ngOnInit() {
    this.totalAmountOfCoffeesBrewed = 0;
    this.setMachineStats();
  }

  setMachineStats() {
    this.jobService.getAllJobs()
      .subscribe( jobs => {
        this.totalAmountOfCoffeesBrewed = jobs.length;
      }, error => {
        this.showNotificationModal = true;
        this.modalType = 'error';
        this.modalMessages = [error];
      });
  }
}
