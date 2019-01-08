import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewEncapsulation} from '@angular/core';
import { IRangeInputObject } from '../../shared/interfaces/form-input-objects';

@Component({
  selector: 'app-form-range-input',
  templateUrl: './form-range-input.component.html',
  styleUrls: ['./form-range-input.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FormRangeInputComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() name: string;
  @Input() label: string;
  @Input() value: number;
  @Input() startIconSource: string;
  @Input() endIconSource: string;

  @Input() type: string;
  @Output() rangeChange = new EventEmitter<any>();

  inputObject: IRangeInputObject;

  viewInitialized: boolean;

  range: number[];

  localValue: number;
  minVal: number;
  maxVal: number;
  unit: string;
  highlighterBarClass: string;

  constructor() { }

  ngOnInit() {
    this.localValue = this.value;
    if (this.type === 'water') {
      this.minVal = 15;
      this.maxVal = 235;
      this.unit = 'ml';
    } else {
      this.minVal = 0;
      this.maxVal = 100;
      this.unit = '%';
    }
    this.range = [this.minVal, this.value];
    this.highlighterBarClass = `sc-range-input__highlighter-bar--${this.type}`;
  }

  ngOnChanges() {
    this.localValue = this.value;
    this.range = [this.minVal, this.value];
  }

  ngAfterViewInit() {
    this.viewInitialized = true;
  }

  rangeValChanged (value: any) {
    // save input in variable
    this.inputObject = {
      fieldId: this.name,
      value: value
    };

    // pass input value to parent in a timeout, because otherwise ... it throws an error
    setTimeout(() => {
      this.rangeChange.emit(this.inputObject);
    }, 0);
  }
}
