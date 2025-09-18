import { CloudSnow, Sun, Snowflake, Lightning } from '@phosphor-icons/react'
import { useWeatherTheme } from '@/hooks/useWeatherTheme'
import { Badge } from '@/components/ui/badge'

export function WeatherThemeIndicator() {
  const { getCurrentTheme, currentTheme } = useWeatherTheme()
  const theme = getCurrentTheme()

  const getWeatherIcon = () => {
    switch (currentTheme) {
      case 'clear':
        return <Sun size={16} className="text-amber-500" />
      case 'light_snow':
        return <CloudSnow size={16} className="text-blue-400" />
      case 'heavy_snow':
        return <Snowflake size={16} className="text-blue-600" />
      case 'blizzard':
        return <Lightning size={16} className="text-purple-600" />
      default:
        return <CloudSnow size={16} className="text-primary" />
    }
  }

  if (!theme) return null

  return (
    <Badge variant="outline" className="flex items-center gap-2 text-xs">
      {getWeatherIcon()}
      {theme.name}
    </Badge>
  )
}