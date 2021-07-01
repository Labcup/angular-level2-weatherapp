export class WeatherData {
    constructor(public name: string,
                public zip: string,
                public conditions: string,
                public temp: number,
                public tempMax: number,
                public tempMin: number,
                public date: Date) { }
}
