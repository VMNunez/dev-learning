export interface WeatherCondition {
  description: string;
  icon: string;
}

export interface WeatherMain {
  temp: number;
  humidity: number;
  feels_like: number;
}

export interface WeatherResponse {
  name: string;
  main: WeatherMain;
  weather: WeatherCondition[];
}
