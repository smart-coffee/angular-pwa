import { Component, OnInit } from '@angular/core';
import { CoffeeJobService } from '../../services/coffee-job.service';
import { CoffeeJob } from '../../shared/models/coffee-job';
import { CoffeeMachineService } from '../../services/coffee-machine.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {

  orderHistory: CoffeeJob[];
  totalCoffeeAmount: number;
  totalPriceInCents: number;

  showNotificationModal: boolean;
  modalMessages: string[];
  modalType: string;

  constructor(private coffeeJobService: CoffeeJobService,
              private coffeeMachineService: CoffeeMachineService) { }

  ngOnInit() {
    this.orderHistory = [];
    this.totalCoffeeAmount = 0;
    this.totalPriceInCents = 0;
    this.setCoffeeOrderHistory();
  }

  setCoffeeOrderHistory() {
    this.coffeeJobService.getCurrentUserJobs()
      .subscribe( jobs => {

        jobs.map(job => {
          const {id, coffee_machine_id: cmi, create_date: cd, square_date: pd, price} = job;
          // multiply unix timestamp with 1000, because javascript likes it that way
          const tmpJob = {id: id, creationDate: cd * 1000, paymentDate: pd * 1000, machineId: cmi, priceInCents: price};
          this.setCoffeeOrderHistoryItem(tmpJob);
        });

      }, error => {
        this.showNotificationModal = true;
        this.modalType = 'error';
        this.modalMessages = [error];
      });
  }

  setCoffeeOrderHistoryItem(tmpJob: any) {
    const {id, creationDate, paymentDate, machineId, priceInCents} = tmpJob;
    this.coffeeMachineService.getCoffeeMachineNameById(machineId)
      .subscribe( coffeeMachine => {
       const { name } = coffeeMachine;
       const job: CoffeeJob = {id: id, creationDate: creationDate, paymentDate: paymentDate, machineName: name, priceInCents: priceInCents};
       this.orderHistory = [job, ...this.orderHistory];
       this.totalCoffeeAmount += 1;
       this.totalPriceInCents += priceInCents;
      });
  }

}
