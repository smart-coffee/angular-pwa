import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CoffeeMachineService } from '../../services/coffee-machine.service';
import { CoffeeMachine } from '../../shared/models/coffee-machine';
import { CoffeeMachineDetails } from '../../shared/models/coffee-machine-details';
import { CoffeeService } from '../../services/coffee.service';

@Component({
  selector: 'app-coffee-machine-info',
  templateUrl: './coffee-machine-info.component.html',
  styleUrls: ['./coffee-machine-info.component.scss'],
  animations: [
    trigger('showHide', [
      state('show', style({
        opacity: 1,
        display: 'block',
        transform: 'translateX(0)'
      })),
      state('hide', style({
        opacity: 0,
        display: 'none',
        transform: 'translateY(-50px)'
      })),
      transition('show => hide', [
        animate('0.1s ease-in-out')
      ]),
      transition('hide => show', [
        animate('0.3s ease-in-out')
      ])
    ])
  ]
})
export class CoffeeMachineInfoComponent implements OnInit {

  detailsLoading: boolean;
  showMachineDropdown: boolean;
  showCoffeeDetails: boolean;
  coffeeMachines: CoffeeMachine[];
  coffeeMachineOn: boolean;
  machineDetailsInitialized: boolean;
  @Output() detailsLoaded = new EventEmitter<boolean>();

  coffeeMachineDetails: CoffeeMachineDetails;

  showNotificationModal: boolean;
  modalMessages: string[];
  modalType: string;

  constructor(private coffeeMachineService: CoffeeMachineService,
              private coffeeService: CoffeeService,
              private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.detailsLoading = true;
    this.showMachineDropdown = false;
    this.showCoffeeDetails = false;
    this.machineDetailsInitialized = false;
    this.coffeeMachines = [];

    this.showNotificationModal = false;
    this.modalMessages = [];
    this.modalType = 'info';

    this.detailsLoaded.emit(false);
    this.resetCoffeeMachineDetails();
    this.getCoffeeMachines();
  }

  resetCoffeeMachineDetails() {
    this.coffeeMachineDetails = {
      name: '',
      coffeeLevel: 0,
      waterLevel: 0,
      trashLevel: 0,
      pricePerCoffeeInCents: 0,
      coffeeBrand: '',
      coffeeType: '',
      machineIsOn: false
    };
  }

  toggleMachinePicker () {
    this.showMachineDropdown = !this.showMachineDropdown;
  }

  toggleCoffeeDetails () {
    this.showCoffeeDetails = !this.showCoffeeDetails;
  }

  getCoffeeMachines () {
    this.coffeeMachineService.getCoffeeMachines()
      .subscribe(devices => {
          // check if only online devices are in the response
          let noMachinesOnline = true;
          for (let i = 0; i < devices.length; i++) {
            const { uuid, is_online } = devices[i];
            if (typeof uuid !== 'undefined' && is_online === true) {
              noMachinesOnline = false;
            }
          }

          if (noMachinesOnline) {
            this.showNotificationModal = true;
            this.modalMessages = ['Gerade sind keine Kaffeemaschinen erreichbar. ' +
            'Versuche es bitte zu einem späteren Zeitpunkt noch einmal.'];
            this.modalType = 'info';
          }

          devices.map(device => {
            const { uuid, is_online } = device;
            if (typeof uuid !== 'undefined' && is_online === true) {
            this.getCoffeeMachineSettings(uuid);
            }
          });
        }, error => {
        this.showNotificationModal = true;
        this.modalType = 'error';
        this.modalMessages = [error];
      });
  }

  getCoffeeMachineSettings(uuid: string) {
    this.coffeeMachineService.getCoffeeMachineSettings(uuid)
      .subscribe(balenaDevice => {
        const { coffee_machine_id: machineId } = balenaDevice;
        if (typeof machineId !== 'undefined') {
          this.getCoffeeMachineDetails(machineId, uuid);
        }
      }, error => {
        this.showNotificationModal = true;
        this.modalType = 'error';
        this.modalMessages = [error];
      });
  }

  getCoffeeMachineDetails(machineId: number, uuid: string) {
    this.coffeeMachineService.getCoffeeMachineNameById(machineId)
      .subscribe( coffeeMachine => {
        const { name } = coffeeMachine;
        if (typeof name !== 'undefined') {
          const tmpMachine = {id: machineId, name: name, uuid: uuid};
          this.coffeeMachines = [...this.coffeeMachines, tmpMachine];
          this.initCoffeeMachineDetails(tmpMachine);
          if (!this.machineDetailsInitialized) {
            this.initCoffeeMachineDetails(tmpMachine);
            this.machineDetailsInitialized = true;
          }
        }
      }, error => {
        this.showNotificationModal = true;
        this.modalType = 'error';
        this.modalMessages = [error];
      });
  }

  initCoffeeMachineDetails(cm: CoffeeMachine) {
    this.detailsLoading = true;
    this.detailsLoaded.emit(false);

    const { name, uuid } = cm;
    localStorage.setItem('currentMachine', JSON.stringify(cm));

    this.coffeeMachineService.getCoffeeMachineStatus(uuid)
      .subscribe( coffeeMachineStatus => {
        const { water_tank_fill_level_in_percent: waterLevel,
          coffee_bean_container_fill_level_in_percent: coffeeLevel,
          coffee_grounds_container_fill_level_in_percent: trashLevel,
          coffee_machine_runtime_state: machineIsOn } = coffeeMachineStatus;

        if (typeof waterLevel !== 'undefined' && typeof coffeeLevel !== 'undefined' && typeof trashLevel !== 'undefined') {
          this.coffeeMachineDetails.name = name;
          this.coffeeMachineDetails.coffeeLevel = coffeeLevel;
          this.coffeeMachineDetails.waterLevel = waterLevel;
          this.coffeeMachineDetails.trashLevel = trashLevel;
          if (machineIsOn === 1) {
            this.coffeeMachineDetails.machineIsOn = true;
          } else if (machineIsOn === 2) {
            this.coffeeMachineDetails.machineIsOn = false;
          }


          // get the product id -> product name -> product type
          this.coffeeMachineService.getCoffeeMachineSettings(uuid)
            .subscribe( coffeeMachineSettings => {
              const { coffee_product_id, price } = coffeeMachineSettings;
              this.coffeeMachineDetails.pricePerCoffeeInCents = price;

              this.getCoffeeProductById(coffee_product_id);
            });
        }
      }, error => {
        this.showNotificationModal = true;
        this.modalType = 'error';
        this.modalMessages = [error];
      });
  }

  getCoffeeProductById(id: number) {
    this.coffeeService.getCoffeeProductById(id)
      .subscribe( coffeeProduct => {
        const { name, coffee_brand_id } = coffeeProduct;
        if (typeof name !== 'undefined') {
          this.coffeeMachineDetails.coffeeBrand = name;
        }

        if (typeof coffee_brand_id !== 'undefined') {
          this.getCoffeeTypeById(coffee_brand_id);
        }
      }, error => {
        this.showNotificationModal = true;
        this.modalType = 'error';
        this.modalMessages = [error];
      });
  }

  getCoffeeTypeById(id: number) {
    this.coffeeService.getCoffeeTypeById(id)
      .subscribe( coffeeType => {
        const { name } = coffeeType;
        if (typeof name !== 'undefined') {
          this.coffeeMachineDetails.coffeeType = name;
          this.detailsLoading = false;
          this.cdr.detectChanges();
          this.detailsLoaded.emit(true);
        }
      }, error => {
        this.showNotificationModal = true;
        this.modalType = 'error';
        this.modalMessages = [error];
      });
  }

  toggleMachineOnOff(uuid: string, machineOnOff: boolean) {
    let runtimeState = 2;
    if (machineOnOff) {
      runtimeState = 2;
    } else {
      runtimeState = 1;
    }
    this.coffeeMachineService.putNewCoffeeMachineRuntimeState(uuid, runtimeState)
      .subscribe( coffeeMachineStatus => {
        const { coffee_machine_runtime_state: runtimeStateResponse } = coffeeMachineStatus;
        if (runtimeStateResponse === runtimeState) {
          this.showNotificationModal = true;
          if (runtimeStateResponse === 1) {
            this.modalMessages = ['Die Kaffeemaschine wird angeschaltet. Bitte warte einen Moment...'];
            this.coffeeMachineDetails.machineIsOn = true;
          } else {
            this.modalMessages = ['Die Kaffeemaschine wird abgeschaltet. Bitte warte einen Moment...'];
            this.coffeeMachineDetails.machineIsOn = false;
          }

          this.modalType = 'info';

        }
      }, error => {
      this.showNotificationModal = true;
      this.modalType = 'error';
      this.modalMessages = [error];
    });
  }

}
