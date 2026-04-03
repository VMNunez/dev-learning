# 02 — Weather App

My second Angular project. A weather app that fetches real data from an API to learn HTTP Client and RxJS basics.

## Learning objectives

- HTTP Client — how to call an external API from Angular
- RxJS basics — `Observable`, `subscribe`, `pipe`, `map`
- Environment variables — how to store API keys safely
- Lifecycle hooks — `ngOnInit` to load data when the component starts
- Angular pipes — format data in the template (`date`, `number`)

## Features

- Search for a city by name
- Show current temperature, weather condition and humidity
- Show an icon for the weather condition
- Handle errors when the city is not found

## Tech stack

- Angular 21
- TypeScript
- CSS
- OpenWeatherMap API

## How to run the project

```bash
git clone https://github.com/VMNunez/dev-learning.git
```

```bash
cd dev-learning/angular/02-weather-app
```

```bash
npm install
```

```bash
ng serve
```

Open your browser at `http://localhost:4200`
