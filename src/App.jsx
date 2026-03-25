import React, { useState, useEffect } from 'react'
import LoadingScreen from './components/LoadingScreen'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Launch from './components/Launch'
import SpaceTravel from './components/SpaceTravel'
import MarsLanding from './components/MarsLanding'
import Exploration from './components/Exploration'
import Conclusion from './components/Conclusion'
import Footer from './components/Footer'
import StarField from './components/StarField'
import AchievementSystem from './components/AchievementSystem'
import MarsAIGuide from './components/MarsAIGuide'
import ScrollColorShift from './components/ScrollColorShift'
import LowGravityLayer from './components/LowGravityLayer'
import MissionProgressBar from './components/Missionprogressbar'
import MissionPathSelector from './components/Missionpathselector'
import AdaptiveSound from './components/AdaptiveSound'
import { SoundProvider } from './components/SoundEngine'

export default function App() {
  const [loading, setLoading]       = useState(true)
  const [progress, setProgress]     = useState(0)
  const [missionPath, setMissionPath] = useState(null)

  useEffect(() => {
    const intervals = [
      setTimeout(() => setProgress(20), 300),
      setTimeout(() => setProgress(45), 700),
      setTimeout(() => setProgress(70), 1200),
      setTimeout(() => setProgress(90), 1800),
      setTimeout(() => setProgress(100), 2200),
      setTimeout(() => setLoading(false), 2800),
    ]
    return () => intervals.forEach(clearTimeout)
  }, [])

  return (
    <SoundProvider>
      {loading && <LoadingScreen progress={progress} />}

      {/* Show path selector only after loading, and only if not yet chosen */}
      {!loading && !missionPath && (
        <MissionPathSelector onSelect={setMissionPath} />
      )}

      {/* Global ambient systems */}
      <ScrollColorShift />
      <LowGravityLayer />
      <AdaptiveSound />

      <div className={`transition-opacity duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        <StarField />

        {/* Sticky top progress bar */}
        <MissionProgressBar />

        <Navbar />

        {/* Floating overlays */}
        <AchievementSystem />
        <MarsAIGuide />
      

        <main>
          <Hero missionPath={missionPath} />
          <Launch />
          <SpaceTravel />
          <MarsLanding />
          <Exploration />
          <Conclusion />
        </main>
        <Footer />
      </div>
    </SoundProvider>
  )
}