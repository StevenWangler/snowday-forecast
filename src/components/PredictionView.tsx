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

  useEffect(() => {
    loadWeatherData()
  }, [])

  const loadWeatherData = async () => {
    try {
      setLoading(true)
      const data = await WeatherService.getCurrentForecast()
      setWeather(data)
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

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <CloudSnow size={48} className="animate-spin text-primary" />
            <span className="ml-4 text-lg">Loading forecast...</span>
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
    <div className="space-y-6">
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Tomorrow's Snow Day Probability</CardTitle>
          <p className="text-muted-foreground">Based on weather conditions for Rockford, MI</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="text-6xl font-bold text-primary">{weather.modelProbability}%</div>
            <Badge className={`${verdict.color} text-white text-lg px-4 py-2`}>
              {verdict.text}
            </Badge>
            <Progress value={weather.modelProbability} className="h-3" />
          </div>

          {communityAvg !== null && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Community Consensus</h3>
                <div className="text-3xl font-bold text-accent">{communityAvg}%</div>
                <p className="text-sm text-muted-foreground">
                  Based on {communityVotes?.length || 0} community votes
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CloudSnow size={20} />
              Weather Drivers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <CloudSnow size={24} className="text-primary" />
                <div>
                  <p className="font-medium">{weather.snowfall}"</p>
                  <p className="text-sm text-muted-foreground">Expected snow</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Thermometer size={24} className="text-blue-500" />
                <div>
                  <p className="font-medium">{weather.temperature}°F</p>
                  <p className="text-sm text-muted-foreground">Temperature</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Wind size={24} className="text-slate-500" />
                <div>
                  <p className="font-medium">{weather.windSpeed} mph</p>
                  <p className="text-sm text-muted-foreground">Wind speed</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Eye size={24} className="text-gray-500" />
                <div>
                  <p className="font-medium">{weather.visibility} mi</p>
                  <p className="text-sm text-muted-foreground">Visibility</p>
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

            <p className="text-xs text-muted-foreground mt-4">
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