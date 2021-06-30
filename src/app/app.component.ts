import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { NgForm } from "@angular/forms";
import { WeatherService } from "./weather.service";
import { Subscription } from "rxjs";
import { WeatherData } from "./weather-data.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('formElement') formElement: NgForm;

  dataSub: Subscription;
  weatherData: WeatherData[] = [];
  zipcode: string;

  constructor(private weatherService: WeatherService) { }

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

  removeZipcode(zipcode: string) {
    this.weatherService.removeZipcode(zipcode);
  }

  ngOnDestroy(): void {
    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }
  }
}
