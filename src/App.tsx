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
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-6xl">
        <header className="text-center mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <CloudSnow size={40} className="text-primary sm:w-12 sm:h-12" weight="duotone" />
            <h1 className="text-2xl sm:text-4xl font-bold text-foreground leading-tight">Snow Day Predictor</h1>
          </div>
          <p className="text-muted-foreground text-base sm:text-lg px-4">
            Community-powered snow day forecasting for Rockford, Michigan
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6 sm:mb-8 h-auto">
            <TabsTrigger value="prediction" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-3 sm:py-2 text-xs sm:text-sm">
              <CloudSnow size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">Today's Forecast</span>
              <span className="sm:hidden">Today</span>
            </TabsTrigger>
            <TabsTrigger value="crowd" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-3 sm:py-2 text-xs sm:text-sm">
              <Users size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">Community</span>
              <span className="sm:hidden">Crowd</span>
            </TabsTrigger>
            <TabsTrigger value="accuracy" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-3 sm:py-2 text-xs sm:text-sm">
              <Target size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span>Accuracy</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-3 sm:py-2 text-xs sm:text-sm">
              <Clock size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span>History</span>
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