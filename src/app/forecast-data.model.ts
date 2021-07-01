import { WeatherData } from "./weather-data.model";

export class ForecastData {
    constructor(public name: string,
                public zip: string,
                public data: WeatherData[]) { }
}
