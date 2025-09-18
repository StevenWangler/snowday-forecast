import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useWeatherTheme, weatherThemes, darkWeatherThemes } from '@/hooks/useWeatherTheme'

export function WeatherThemeDemo() {
  const { updateWeatherConditions, isDarkMode, toggleDarkMode, getCurrentTheme } = useWeatherTheme()
  
  const testScenarios = [
    { name: 'Clear', snowfall: 0, windSpeed: 5, visibility: 10 },
    { name: 'Light Snow', snowfall: 1, windSpeed: 10, visibility: 3 },
    { name: 'Heavy Snow', snowfall: 4, windSpeed: 20, visibility: 1 },
    { name: 'Blizzard', snowfall: 8, windSpeed: 35, visibility: 0.2 },
  ]

  const currentTheme = getCurrentTheme()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather Theme Demo</CardTitle>
        <p className="text-sm text-muted-foreground">
          Test different weather conditions to see theme changes
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {testScenarios.map((scenario) => (
            <Button
              key={scenario.name}
              variant="outline"
              size="sm"
              onClick={() => updateWeatherConditions(scenario.snowfall, scenario.windSpeed, scenario.visibility)}
            >
              {scenario.name}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={toggleDarkMode}>
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </Button>
        </div>

        {currentTheme && (
          <div className="p-3 rounded-lg border bg-card">
            <h4 className="font-semibold text-sm">Current Theme: {currentTheme.name}</h4>
            <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
              <div>Primary: <span className="inline-block w-4 h-4 rounded border ml-1" style={{backgroundColor: currentTheme.primary}}></span></div>
              <div>Accent: <span className="inline-block w-4 h-4 rounded border ml-1" style={{backgroundColor: currentTheme.accent}}></span></div>
              <div>Background: <span className="inline-block w-4 h-4 rounded border ml-1" style={{backgroundColor: currentTheme.background}}></span></div>
              <div>Secondary: <span className="inline-block w-4 h-4 rounded border ml-1" style={{backgroundColor: currentTheme.secondary}}></span></div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}