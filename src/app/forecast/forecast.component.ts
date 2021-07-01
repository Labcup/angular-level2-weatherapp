import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { WeatherService } from "../services/weather.service";
import { ForecastData } from "../models/forecast-data.model";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css']
})
export class ForecastComponent implements OnInit, OnDestroy {

  private forecastSub: Subscription;
  forecastData: ForecastData;

  constructor(private weatherService: WeatherService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.forecastSub = this.route.params.subscribe(params => {
      console.log('params', params);
      this.weatherService.doForecast(params['zip']).then((data) => {
        console.log('forecastData:', data);
        this.forecastData = data;
      });
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  getDayName(num: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[num];
  }

  getConditionIcon(condition: string): string {
    return this.weatherService.getConditionIcon(condition);
  }

  ngOnDestroy(): void {
    this.forecastSub.unsubscribe();
  }
}
