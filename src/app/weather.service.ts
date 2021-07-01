import { Injectable } from '@angular/core';
import { environment } from "../environments/environment";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Subject } from "rxjs";
import { WeatherData } from "./weather-data.model";
import { ForecastData } from "./forecast-data.model";

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private key = environment.openWeatherApiKey;
  private weatherData: WeatherData[] = [];
  public dataChanged = new Subject<WeatherData[]>();

  constructor(private http: HttpClient) { }

  getWeatherData() {
    this.weatherData = JSON.parse(localStorage.getItem('weatherData'));
    this.dataChanged.next(this.weatherData.slice());
  }

  addZipcode(zipcode: string) {
    const weatherData = this.weatherData.find(data => data.zip === zipcode);
    if (!weatherData) {
      const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipcode},us&units=metric&appid=${this.key}`;
      this.http.get(url).subscribe((response: any) => {
        console.log('addZipcode response:', response)

        this.weatherData = [
            new WeatherData(
                response.name,
                zipcode,
                response.weather[0].main,
                response.main.temp,
                response.main.temp_max,
                response.main.temp_min,
                new Date()
          ),
          ...this.weatherData
        ]

        localStorage.setItem('weatherData', JSON.stringify(this.weatherData));
        this.dataChanged.next(this.weatherData.slice());
      }, (error: HttpErrorResponse) => {
        console.log('addZipcode error', error);
        if (error.status === 404) {
          alert("You entered an invalid US zipcode.");
        } else {
          alert("An unknown error occurred.");
        }
      });
    }
  }

  removeZipcode(zip: string) {
    const weatherData = this.weatherData.find(data => data.zip === zip);
    if (weatherData) {
      const i = this.weatherData.indexOf(weatherData);
      this.weatherData.splice(i, 1);
      localStorage.setItem('weatherData', JSON.stringify(this.weatherData));
      this.dataChanged.next(this.weatherData.slice());
    }
  }

  doForecast(zip: string): Promise<ForecastData> {
    const url = `https://api.openweathermap.org/data/2.5/forecast/daily?zip=${zip},us&units=metric&cnt=5&appid=${this.key}`;
    return new Promise<ForecastData>((resolve, reject) => {
      this.http.get(url).subscribe((response: any) => {
        console.log('doForecast response:', response)

        let forecastData = new ForecastData(response.city.name, zip, []);
        for (let dayData of response.list) {
          const weatherData = new WeatherData(
              response.city.name,
              zip,
              dayData.weather[0].main,
              dayData.temp.day,
              dayData.temp.max,
              dayData.temp.min,
              new Date(dayData.dt * 1000)
          );
          forecastData.data.push(weatherData);
        }
        resolve(forecastData);
      }, (error: HttpErrorResponse) => {
        console.log('doForecast error', error);
        alert("An unknown error occurred.");
        reject();
      });
    });
  }

  getConditionIcon(condition: string): string {
    switch (condition) {
      case 'Rain':
        return 'rain.png';
      case 'Clouds':
        return 'clouds.png';
      case 'Mist':
        return 'clouds.png';
      case 'Snow':
        return 'snow.png';
      case 'Sunny':
        return 'sun.png';
      case 'Clear':
        return 'sun.png';
    }
  }
}
