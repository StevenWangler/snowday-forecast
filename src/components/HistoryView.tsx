import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CloudSnow, CalendarBlank, Target, TrendUp, Users } from '@phosphor-icons/react'
import { useState } from 'react'

interface HistoricalEvent {
  date: string
  eventName: string
  modelPrediction: number
  communityPrediction: number
  actualOutcome: number
  snowfall: number
  temperature: number
  notes: string
}

export function HistoryView() {
  const [searchTerm, setSearchTerm] = useState('')
  const [historicalEvents] = useKV<HistoricalEvent[]>('historical-events', [
    {
      date: '2024-01-15',
      eventName: 'January Blizzard',
      modelPrediction: 85,
      communityPrediction: 78,
      actualOutcome: 1,
      snowfall: 8,
      temperature: 12,
      notes: 'Heavy snow with wind gusts up to 40mph. Schools closed district-wide.'
    },
    {
      date: '2024-01-08',
      eventName: 'Light Snow Event',
      modelPrediction: 35,
      communityPrediction: 42,
      actualOutcome: 0,
      snowfall: 2,
      temperature: 28,
      notes: 'Light accumulation but roads remained clear. Schools stayed open.'
    },
    {
      date: '2023-12-18',
      eventName: 'Pre-Holiday Storm',
      modelPrediction: 90,
      communityPrediction: 85,
      actualOutcome: 1,
      snowfall: 12,
      temperature: 8,
      notes: 'Major storm before winter break. All activities canceled.'
    },
    {
      date: '2023-12-05',
      eventName: 'False Alarm',
      modelPrediction: 65,
      communityPrediction: 58,
      actualOutcome: 0,
      snowfall: 0.5,
      temperature: 32,
      notes: 'Forecast changed overnight. Only light flurries materialized.'
    },
    {
      date: '2023-11-28',
      eventName: 'Thanksgiving Week Surprise',
      modelPrediction: 25,
      communityPrediction: 32,
      actualOutcome: 1,
      snowfall: 6,
      temperature: 18,
      notes: 'Unexpected heavy band of snow. Late closure announcement.'
    }
  ])

  const filteredEvents = historicalEvents?.filter(event => 
    event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
    new Date(event.date).toLocaleDateString().includes(searchTerm)
  ) || []

  const getAccuracyBadge = (prediction: number, outcome: number) => {
    const predictedClosure = prediction > 50
    const actualClosure = outcome === 1
    
    if (predictedClosure === actualClosure) {
      const confidence = Math.abs(prediction - 50)
      if (confidence > 30) return { text: 'Excellent', variant: 'default' as const }
      if (confidence > 15) return { text: 'Good', variant: 'secondary' as const }
      return { text: 'Lucky', variant: 'outline' as const }
    }
    
    return { text: 'Miss', variant: 'destructive' as const }
  }

  const calculateBrierScore = (prediction: number, outcome: number) => {
    const prob = prediction / 100
    return Math.pow(prob - outcome, 2)
  }

  const getSeasonStats = () => {
    if (!historicalEvents || historicalEvents.length === 0) return null

    const totalEvents = historicalEvents.length
    const snowDays = historicalEvents.filter(e => e.actualOutcome === 1).length
    const modelCorrect = historicalEvents.filter(e => {
      const predicted = e.modelPrediction > 50 ? 1 : 0
      return predicted === e.actualOutcome
    }).length
    const communityCorrect = historicalEvents.filter(e => {
      const predicted = e.communityPrediction > 50 ? 1 : 0
      return predicted === e.actualOutcome
    }).length

    return {
      totalEvents,
      snowDays,
      modelAccuracy: Math.round((modelCorrect / totalEvents) * 100),
      communityAccuracy: Math.round((communityCorrect / totalEvents) * 100)
    }
  }

  const seasonStats = getSeasonStats()

  return (
    <div className="space-y-6">
      {seasonStats && (
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{seasonStats.totalEvents}</div>
              <p className="text-sm text-muted-foreground">Total Events</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-destructive">{seasonStats.snowDays}</div>
              <p className="text-sm text-muted-foreground">Snow Days</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent">{seasonStats.modelAccuracy}%</div>
              <p className="text-sm text-muted-foreground">Model Accuracy</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent">{seasonStats.communityAccuracy}%</div>
              <p className="text-sm text-muted-foreground">Community Accuracy</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarBlank size={20} />
              Event History
            </CardTitle>
            <div className="w-64">
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEvents.map((event) => {
              const modelAccuracy = getAccuracyBadge(event.modelPrediction, event.actualOutcome)
              const communityAccuracy = getAccuracyBadge(event.communityPrediction, event.actualOutcome)
              const modelBrier = calculateBrierScore(event.modelPrediction, event.actualOutcome)
              const communityBrier = calculateBrierScore(event.communityPrediction, event.actualOutcome)

              return (
                <Card key={event.date} className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          <CloudSnow size={20} className={event.actualOutcome === 1 ? 'text-destructive' : 'text-muted-foreground'} />
                          {event.eventName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString(undefined, { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      <Badge variant={event.actualOutcome === 1 ? 'destructive' : 'secondary'} className="text-sm">
                        {event.actualOutcome === 1 ? 'Snow Day' : 'School Open'}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-medium">Predictions</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                            <div className="flex items-center gap-2">
                              <Target size={16} />
                              <span className="text-sm">Model</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{event.modelPrediction}%</span>
                              <Badge variant={modelAccuracy.variant} className="text-xs">
                                {modelAccuracy.text}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                            <div className="flex items-center gap-2">
                              <Users size={16} />
                              <span className="text-sm">Community</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{event.communityPrediction}%</span>
                              <Badge variant={communityAccuracy.variant} className="text-xs">
                                {communityAccuracy.text}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Brier scores: Model {modelBrier.toFixed(3)}, Community {communityBrier.toFixed(3)}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium">Actual Conditions</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Snowfall:</span>
                            <span className="ml-2 font-medium">{event.snowfall}"</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Temperature:</span>
                            <span className="ml-2 font-medium">{event.temperature}°F</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground italic">
                          {event.notes}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No events found matching your search.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}