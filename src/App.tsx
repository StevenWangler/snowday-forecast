import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Toaster } from '@/components/ui/sonner'
import { CloudSnow, Users, Target, Clock } from '@phosphor-icons/react'
import { PredictionView } from '@/components/PredictionView'
import { CrowdView } from '@/components/CrowdView'
import { AccuracyView } from '@/components/AccuracyView'
import { HistoryView } from '@/components/HistoryView'

function App() {
  const [activeTab, setActiveTab] = useState("prediction")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CloudSnow size={48} className="text-primary" weight="duotone" />
            <h1 className="text-4xl font-bold text-foreground">Snow Day Predictor</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Community-powered snow day forecasting for Rockford, Michigan
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="prediction" className="flex items-center gap-2">
              <CloudSnow size={18} />
              Today's Forecast
            </TabsTrigger>
            <TabsTrigger value="crowd" className="flex items-center gap-2">
              <Users size={18} />
              Community
            </TabsTrigger>
            <TabsTrigger value="accuracy" className="flex items-center gap-2">
              <Target size={18} />
              Accuracy
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock size={18} />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prediction">
            <PredictionView />
          </TabsContent>
          
          <TabsContent value="crowd">
            <CrowdView />
          </TabsContent>
          
          <TabsContent value="accuracy">
            <AccuracyView />
          </TabsContent>
          
          <TabsContent value="history">
            <HistoryView />
          </TabsContent>
        </Tabs>
      </div>
      
      <Toaster position="top-right" />
    </div>
  )
}

export default App