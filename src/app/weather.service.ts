import {Injectable, OnInit} from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class WeatherService implements OnInit {
  zipcodes: string[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void { }

  addZipcode(zipcode: string) {
    const i = this.zipcodes.indexOf(zipcode)
    if (i == -1) {
      this.zipcodes.push(zipcode);
      localStorage.setItem('zipcodes', JSON.stringify(this.zipcodes));
    }
  }

  removeZipcode(zipcode: string) {
    const i = this.zipcodes.indexOf(zipcode)
    if (i > -1) {
      this.zipcodes.splice(i, 1);
      localStorage.setItem('zipcodes', JSON.stringify(this.zipcodes));
    }
  }

  getZipcodes(): string[] {
    this.zipcodes = JSON.parse(localStorage.getItem('zipcodes'));
    return this.zipcodes.slice();
  }
}
