import { Component, OnInit } from '@angular/core';
import { CoffeeJobService } from '../../services/coffee-job.service';
import { CoffeeMachineService } from '../../services/coffee-machine.service';

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

  constructor(private jobService: CoffeeJobService, private coffeeMachineService: CoffeeMachineService) { }

  ngOnInit() {
    this.totalAmountOfCoffeesBrewed = 0;
    this.setMachineStats();
  }

  setMachineStats() {
    const currentMachine = JSON.parse(localStorage.getItem('currentMachine'));
    const currentMachineId = currentMachine.id
    this.jobService.getCoffeeMachineJobsCount(currentMachineId)
      .subscribe( count => {
        this.totalAmountOfCoffeesBrewed = count.size;
      }, error => {
        this.showNotificationModal = true;
        this.modalType = 'error';
        this.modalMessages = [error];
      });
  }
}
