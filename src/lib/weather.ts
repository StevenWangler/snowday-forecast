interface WeatherData {
  temperature: number
  snowfall: number
  windSpeed: number
  visibility: number
  alerts: string[]
  modelProbability: number
  lastUpdated: string
}

export class WeatherService {
  static async getCurrentForecast(): Promise<WeatherData> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const scenarios = [
      {
        temperature: 18,
        snowfall: 6,
        windSpeed: 25,
        visibility: 0.5,
        alerts: ['Winter Storm Warning until 6 AM'],
        modelProbability: 85
      },
      {
        temperature: 28,
        snowfall: 3,
        windSpeed: 15,
        visibility: 2,
        alerts: ['Snow Advisory until midnight'],
        modelProbability: 65
      },
      {
        temperature: 32,
        snowfall: 1,
        windSpeed: 10,
        visibility: 5,
        alerts: [],
        modelProbability: 35
      },
      {
        temperature: 38,
        snowfall: 0,
        windSpeed: 8,
        visibility: 10,
        alerts: [],
        modelProbability: 15
      }
    ]

    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)]
    
    return {
      ...randomScenario,
      lastUpdated: new Date().toISOString()
    }
  }
}