import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ThumbsUp, ThumbsDown, CloudSnow, Thermometer, Wind, Eye, Warning } from '@phosphor-icons/react'
import { VotingWidget } from '@/components/VotingWidget'
import { WeatherService } from '@/lib/weather'
import { useWeatherTheme } from '@/hooks/useWeatherTheme'
import { WeatherThemeIndicator } from '@/components/WeatherThemeIndicator'
import { toast } from 'sonner'

interface WeatherData {
  temperature: number
  snowfall: number
  windSpeed: number
  visibility: number
  alerts: string[]
  modelProbability: number
  lastUpdated: string
}

export function PredictionView() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [userVote, setUserVote] = useKV<{type: 'probability' | 'thumbs', value: number} | null>('today-vote', null)
  const [communityVotes, setCommunityVotes] = useKV<Array<{type: 'probability' | 'thumbs', value: number, timestamp: number}>>('community-votes', [])
  
  // Use weather theme hook
  const { updateWeatherConditions, getCurrentTheme } = useWeatherTheme()

  useEffect(() => {
    loadWeatherData()
  }, [])

  const loadWeatherData = async () => {
    try {
      setLoading(true)
      const data = await WeatherService.getCurrentForecast()
      setWeather(data)
      
      // Update weather theme based on conditions
      updateWeatherConditions(data.snowfall, data.windSpeed, data.visibility)
    } catch (error) {
      toast.error('Failed to load weather data')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = (vote: {type: 'probability' | 'thumbs', value: number}) => {
    setUserVote(vote)
    setCommunityVotes(prev => [...(prev || []), { ...vote, timestamp: Date.now() }])
    toast.success('Vote recorded!')
  }

  const getSnowDayVerdict = (probability: number) => {
    if (probability >= 70) return { text: 'Very Likely', color: 'bg-destructive' }
    if (probability >= 50) return { text: 'Likely', color: 'bg-accent' }
    if (probability >= 30) return { text: 'Possible', color: 'bg-muted' }
    return { text: 'Unlikely', color: 'bg-secondary' }
  }

  const getCommunityAverage = () => {
    if (!communityVotes || communityVotes.length === 0) return null
    const total = communityVotes.reduce((sum, vote) => sum + vote.value, 0)
    return Math.round(total / communityVotes.length)
  }

  const currentTheme = getCurrentTheme()

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <CloudSnow size={32} className="animate-spin text-primary sm:w-12 sm:h-12" />
            <span className="text-base sm:text-lg">Loading forecast...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!weather) {
    return (
      <Alert>
        <Warning size={16} />
        <AlertDescription>
          Unable to load weather data. <Button variant="link" onClick={loadWeatherData} className="p-0 h-auto">Try again</Button>
        </AlertDescription>
      </Alert>
    )
  }

  const verdict = getSnowDayVerdict(weather.modelProbability)
  const communityAvg = getCommunityAverage()

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Weather theme indicator */}
      <div className="text-center">
        <WeatherThemeIndicator />
      </div>
      
      <Card className="text-center">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl sm:text-2xl">Tomorrow's Snow Day Probability</CardTitle>
          <p className="text-muted-foreground text-sm sm:text-base">Based on weather conditions for Rockford, MI</p>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="space-y-3 sm:space-y-4">
            <div className="text-4xl sm:text-6xl font-bold text-primary">{weather.modelProbability}%</div>
            <Badge className={`${verdict.color} text-white text-base sm:text-lg px-3 sm:px-4 py-1.5 sm:py-2`}>
              {verdict.text}
            </Badge>
            <Progress value={weather.modelProbability} className="h-2 sm:h-3" />
          </div>

          {communityAvg !== null && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-semibold">Community Consensus</h3>
                <div className="text-2xl sm:text-3xl font-bold text-accent">{communityAvg}%</div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Based on {communityVotes?.length || 0} community votes
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4 sm:gap-6 lg:grid lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <CloudSnow size={18} className="sm:w-5 sm:h-5" />
              Weather Drivers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-center gap-3">
                <CloudSnow size={20} className="text-primary sm:w-6 sm:h-6" />
                <div>
                  <p className="font-medium text-sm sm:text-base">{weather.snowfall}"</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Expected snow</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Thermometer size={20} className="text-blue-500 sm:w-6 sm:h-6" />
                <div>
                  <p className="font-medium text-sm sm:text-base">{weather.temperature}°F</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Temperature</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Wind size={20} className="text-slate-500 sm:w-6 sm:h-6" />
                <div>
                  <p className="font-medium text-sm sm:text-base">{weather.windSpeed} mph</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Wind speed</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Eye size={20} className="text-gray-500 sm:w-6 sm:h-6" />
                <div>
                  <p className="font-medium text-sm sm:text-base">{weather.visibility} mi</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Visibility</p>
                </div>
              </div>
            </div>

            {weather.alerts.length > 0 && (
              <div className="mt-4">
                <Alert>
                  <Warning size={16} />
                  <AlertDescription>
                    <div className="space-y-1">
                      {weather.alerts.map((alert, index) => (
                        <p key={index} className="text-sm">{alert}</p>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            )}

            <p className="text-xs text-muted-foreground mt-3 sm:mt-4">
              Last updated: {new Date(weather.lastUpdated).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <VotingWidget 
          onVote={handleVote} 
          userVote={userVote || null}
          disabled={!!userVote}
        />
      </div>
    </div>
  )
}