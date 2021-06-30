import { Injectable, OnInit } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import { environment } from "../environments/environment";
import { Subject } from "rxjs";
import { WeatherData } from "./weather-data.model";

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private weatherData: WeatherData[] = [];
  public dataChanged = new Subject<WeatherData[]>();

  constructor(private http: HttpClient) { }

  getWeatherData() {
    this.weatherData = JSON.parse(localStorage.getItem('weatherData'));
    this.dataChanged.next(this.weatherData.slice());
  }

  addZipcode(zipcode: string) {
    const weatherData = this.weatherData.find(wd => wd.zip === zipcode);
    if (!weatherData) {
      const key = environment.openWeatherApiKey;
      const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipcode},us&appid=${key}`;

      this.http.get(url).subscribe((res: any) => {
        console.log('get weather res', res)

        const newData: WeatherData = {
          name: res.name,
          zip: zipcode,
          conditions: res.weather.main,
          temp: res.main.temp,
          tempMax: res.main.temp_max,
          tempMin: res.main.temp_min
        }
        this.weatherData.push(newData);

        localStorage.setItem('weatherData', JSON.stringify(this.weatherData));
        this.dataChanged.next(this.weatherData.slice());
      }, (e: HttpErrorResponse) => {
        console.log('get weather error', e);
        if (e.status === 404) {
          alert("The zipcode you entered does not exist.");
        } else {
          alert("An unknown error occurred.");
        }
      });
    }
  }

  removeZipcode(zipcode: string) {
    const weatherData = this.weatherData.find(wd => wd.zip === zipcode);
    if (weatherData) {
      const i = this.weatherData.indexOf(weatherData);
      this.weatherData.splice(i, 1);
      localStorage.setItem('weatherData', JSON.stringify(this.weatherData));
      this.dataChanged.next(this.weatherData.slice());
    }
  }
}
