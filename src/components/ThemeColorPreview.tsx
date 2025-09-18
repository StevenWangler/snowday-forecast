import { Card } from '@/components/ui/card'
import { useWeatherTheme } from '@/hooks/useWeatherTheme'

export function ThemeColorPreview() {
  const { getCurrentTheme } = useWeatherTheme()
  const theme = getCurrentTheme()
  
  if (!theme) return null

  const colorSwatches = [
    { name: 'Primary', value: theme.primary },
    { name: 'Secondary', value: theme.secondary },
    { name: 'Accent', value: theme.accent },
    { name: 'Background', value: theme.background },
    { name: 'Card', value: theme.card },
    { name: 'Border', value: theme.border },
  ]

  return (
    <Card className="p-4">
      <h3 className="text-sm font-medium mb-3">{theme.name} Color Palette</h3>
      <div className="grid grid-cols-3 gap-2">
        {colorSwatches.map((color) => (
          <div key={color.name} className="flex flex-col items-center">
            <div 
              className="w-8 h-8 rounded-md border mb-1" 
              style={{ backgroundColor: color.value }}
            />
            <span className="text-xs text-muted-foreground">{color.name}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}