import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Trophy, TrendUp, Users, Target } from '@phosphor-icons/react'

interface CommunityVote {
  type: 'probability' | 'thumbs'
  value: number
  timestamp: number
}

interface UserStats {
  username: string
  brierScore: number
  totalVotes: number
  accuracy: number
  streak: number
  badges: string[]
}

export function CrowdView() {
  const [communityVotes] = useKV<CommunityVote[]>('community-votes', [])
  const [userStats] = useKV<UserStats[]>('user-stats', [
    {
      username: 'WeatherWiz',
      brierScore: 0.15,
      totalVotes: 45,
      accuracy: 78,
      streak: 7,
      badges: ['Hot Streak', 'Blizzard Caller']
    },
    {
      username: 'SnowDay_Sarah',
      brierScore: 0.18,
      totalVotes: 52,
      accuracy: 73,
      streak: 3,
      badges: ['Early Bird', 'Community Favorite']
    },
    {
      username: 'StormChaser21',
      brierScore: 0.22,
      totalVotes: 38,
      accuracy: 68,
      streak: 1,
      badges: ['Rookie of the Month']
    },
    {
      username: 'MeteoMike',
      brierScore: 0.25,
      totalVotes: 41,
      accuracy: 65,
      streak: 0,
      badges: ['Data Driven']
    }
  ])

  const getVoteDistribution = () => {
    if (!communityVotes || communityVotes.length === 0) return []
    
    const buckets = Array(10).fill(0)
    communityVotes.forEach(vote => {
      const bucket = Math.min(Math.floor(vote.value / 10), 9)
      buckets[bucket]++
    })
    
    return buckets.map((count, index) => ({
      range: `${index * 10}-${(index + 1) * 10}%`,
      count,
      percentage: Math.round((count / communityVotes.length) * 100)
    }))
  }

  const distribution = getVoteDistribution()
  const totalVotes = communityVotes?.length || 0
  const avgProbability = totalVotes > 0 
    ? Math.round((communityVotes || []).reduce((sum, vote) => sum + vote.value, 0) / totalVotes)
    : 0

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users size={20} />
              Community Consensus
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-primary">{avgProbability}%</div>
              <p className="text-muted-foreground">Average prediction</p>
              <p className="text-sm text-muted-foreground">{totalVotes} total votes</p>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h4 className="font-medium">Vote Distribution</h4>
              {distribution.map((bucket) => (
                <div key={bucket.range} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{bucket.range}</span>
                    <span>{bucket.count} votes</span>
                  </div>
                  <Progress value={bucket.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy size={20} />
              Top Forecasters
            </CardTitle>
            <p className="text-sm text-muted-foreground">Ranked by Brier score (lower is better)</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userStats?.map((user, index) => (
                <div key={user.username} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-accent text-accent-foreground' : 
                      index === 1 ? 'bg-secondary text-secondary-foreground' : 
                      'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{user.username}</p>
                      {user.streak > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          <TrendUp size={12} className="mr-1" />
                          {user.streak}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Brier: {user.brierScore.toFixed(3)}</span>
                      <span>{user.accuracy}% accuracy</span>
                      <span>{user.totalVotes} votes</span>
                    </div>
                    {user.badges.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {user.badges.map(badge => (
                          <Badge key={badge} variant="outline" className="text-xs">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )) || []}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How Community Scoring Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Target size={16} />
                Brier Score
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Measures the accuracy of probabilistic predictions. Score = (predicted probability - actual outcome)². 
                Lower scores are better. Perfect predictions score 0.0, while completely wrong predictions score 1.0.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Reputation Weighting</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your voting weight increases with better calibration. New users start with equal weight. 
                Consistent accuracy over 30+ predictions earns higher influence in the community consensus.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}