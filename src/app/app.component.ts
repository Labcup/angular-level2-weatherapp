import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { NgForm } from "@angular/forms";
import { WeatherService } from "./weather.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('formElement') formElement: NgForm;

  zipcode: string;
  zipcodes: string[] = [];

  constructor(private weatherService: WeatherService) { }

  getZipcodes() {
    this.zipcodes = this.weatherService.getZipcodes();
  }

  ngOnInit(): void {
    this.getZipcodes();
  }

  onSubmit() {
    if (this.zipcode) {
      this.weatherService.addZipcode(this.zipcode);
      this.getZipcodes();
    }
    this.formElement.resetForm();
  }

  removeZipcode(zipcode: string) {
    this.weatherService.removeZipcode(zipcode);
    this.getZipcodes();
  }

  ngOnDestroy(): void { }
}
