export interface WeatherCondition {
  description: string;
  icon: string;
}

export interface WeatherMain {
  temp: number;
  humidity: number;
}

export interface WeatherResponse {
  name: string;
  main: WeatherMain;
  weather: WeatherCondition[];
}
