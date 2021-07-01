import {
  Component,
  OnDestroy,
  OnInit, ViewChild
} from '@angular/core';
import { NgForm} from "@angular/forms";
import { Subscription } from "rxjs";
import { WeatherService } from "../services/weather.service";
import { WeatherData } from "../models/weather-data.model";
import { Router } from "@angular/router";

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.css']
})
export class CurrentWeatherComponent implements OnInit, OnDestroy {

  constructor(private weatherService: WeatherService,
              private router: Router) { }

  @ViewChild('formElement') formElement: NgForm;
  dataSub: Subscription;
  weatherData: WeatherData[] = [];
  zipcode: string;

  ngOnInit(): void {
    this.dataSub = this.weatherService.dataChanged.subscribe((data) => {
      this.weatherData = data;
    })
    this.weatherService.getWeatherData();
  }

  onSubmit() {
    if (this.zipcode) {
      this.weatherService.addZipcode(this.zipcode);
    }
    this.formElement.resetForm();
  }

  removeZipcode(zip: string) {
    this.weatherService.removeZipcode(zip);
  }

  getConditionIcon(condition: string): string {
    return this.weatherService.getConditionIcon(condition);
  }

  showForecast(zip: string) {
    this.router.navigate(['/forecast', zip])
  }

  ngOnDestroy(): void {
    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }
  }
}
