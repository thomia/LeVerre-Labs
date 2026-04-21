"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, SkipBack, SkipForward, Plus, Trash2, Upload, Volume2, VolumeX, Activity, Settings, X, GripVertical, Wrench } from "lucide-react"
import AnalysisModal from "./analysis-modal"
import * as RadixSlider from '@radix-ui/react-slider'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import GlassComponent from "@/components/modele/glass-component"
import TapComponent from "@/components/modele/tap-component"
import StrawComponent from "@/components/modele/straw-component"
import StormComponent from "@/components/modele/storm-component"
import { EnvironmentParticles } from "@/components/modele/bubble-component"

// Types pour les paramètres du modèle du verre
interface TaskParameters {
  flowRate: number;         // Débit (0-100)
  glassCapacity: number;    // Capacité du verre (0-100)
  absorptionRate: number;   // Taux d'absorption (0-100)
  environmentScore: number; // Score environnemental (0-100)
  stormIntensity: number;   // Intensité de l'orage (0-100)
}

// Type pour les tâches avec paramètres
interface Task {
  id: number;
  name: string;
  start: number;
  end: number;
  color: string;
  parameters: TaskParameters;
}

export default function VideoTaskEditor() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null)
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false)
  const [selectedTaskForAnalysis, setSelectedTaskForAnalysis] = useState<Task | null>(null)
  const [taskAnalyses, setTaskAnalyses] = useState<Record<number, any>>({})
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [tasks, setTasks] = useState<Array<Task>>([])
  const [selectedTask, setSelectedTask] = useState<number | null>(null)
  const [openPopups, setOpenPopups] = useState<Set<number>>(new Set())
  const [popupPositions, setPopupPositions] = useState<Record<number, { x: number, y: number }>>({})
  const [isDragging, setIsDragging] = useState<number | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isTaskDragging, setIsTaskDragging] = useState(false)
  const [fillLevel, setFillLevel] = useState(0)
  const [glassWidth, setGlassWidth] = useState(20)
  const videoRef = useRef<HTMLVideoElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const lastCalculatedTimeRef = useRef<number>(0)

  // Helper functions pour conversion temps
  const secondsToMMSS = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const mmssToSeconds = (mmss: string): number => {
    const parts = mmss.split(':')
    if (parts.length !== 2) return 0
    const mins = parseInt(parts[0]) || 0
    const secs = parseInt(parts[1]) || 0
    return mins * 60 + secs
  }

  // Fonction pour calculer le fillLevel à un instant T en simulant toutes les tâches depuis le début
  const calculateFillLevelAtTime = (targetTime: number): number => {
    // Trier les tâches par ordre chronologique
    const sortedTasks = [...tasks].sort((a, b) => a.start - b.start)
    
    let currentFillLevel = 0
    let simulationTime = 0
    
    // Simuler chaque tâche jusqu'au targetTime
    for (const task of sortedTasks) {
      // Si la tâche commence après le targetTime, on arrête
      if (task.start >= targetTime) break
      
      // Déterminer la fin de simulation pour cette tâche
      const taskEnd = Math.min(task.end, targetTime)
      const taskDuration = taskEnd - task.start
      
      if (taskDuration <= 0) continue
      
      // Simuler le remplissage pour cette tâche (50ms par step)
      const steps = Math.floor(taskDuration * 20) // 20 steps par seconde (50ms)
      
      for (let i = 0; i < steps; i++) {
        // Entrée d'eau (Robinet)
        const inflow = (task.parameters.flowRate / 100) * 0.5 * 1
        
        // Sortie d'eau (Paille)
        const outflow = (task.parameters.absorptionRate / 100) * 0.3 * 1
        
        // Facteur environnemental (Bulle)
        const environmentFactor = 1 + (task.parameters.environmentScore / 200)
        
        // Impact des aléas (Orage)
        const stormImpact = 1 + (task.parameters.stormIntensity / 150)
        
        // Facteur capacité (Verre)
        const capacityFactor = 1.5 - (task.parameters.glassCapacity / 100)
        
        // Calcul net
        const netChange = ((inflow * environmentFactor * stormImpact) - outflow) * capacityFactor
        
        currentFillLevel = Math.max(0, Math.min(100, currentFillLevel + netChange))
      }
    }
    
    return currentFillLevel
  }

  // Mise à jour de la largeur du verre selon la tâche sélectionnée
  useEffect(() => {
    if (!selectedTask) {
      setGlassWidth(20)
      return
    }
    
    const currentTask = tasks.find(t => t.id === selectedTask)
    if (!currentTask) return
    
    const newWidth = 5 + (currentTask.parameters.glassCapacity / 100) * 55
    setGlassWidth(newWidth)
  }, [selectedTask, tasks])

  // Recalcul du fillLevel quand on change de position dans la vidéo (seek)
  useEffect(() => {
    // Détecter un saut dans la timeline (seek) vs progression naturelle
    const timeDiff = Math.abs(currentTime - lastCalculatedTimeRef.current)
    const isSeek = timeDiff > 0.2 // Plus de 200ms de différence = c'est un seek
    
    if (isSeek || !isPlaying) {
      const calculatedLevel = calculateFillLevelAtTime(currentTime)
      setFillLevel(calculatedLevel)
      lastCalculatedTimeRef.current = currentTime
    }
  }, [currentTime, tasks, isPlaying])

  // Simulation en temps réel quand la vidéo est en lecture
  useEffect(() => {
    if (!isPlaying) return
    
    // Trouver la tâche active au currentTime
    const activeTask = tasks.find(t => currentTime >= t.start && currentTime <= t.end)
    
    if (!activeTask) return
    
    const interval = setInterval(() => {
      setFillLevel(prev => {
        // Entrée d'eau (Robinet)
        const inflow = (activeTask.parameters.flowRate / 100) * 0.5 * 1
        
        // Sortie d'eau (Paille)
        const outflow = (activeTask.parameters.absorptionRate / 100) * 0.3 * 1
        
        // Facteur environnemental (Bulle)
        const environmentFactor = 1 + (activeTask.parameters.environmentScore / 200)
        
        // Impact des aléas (Orage)
        const stormImpact = 1 + (activeTask.parameters.stormIntensity / 150)
        
        // Facteur capacité (Verre)
        const capacityFactor = 1.5 - (activeTask.parameters.glassCapacity / 100)
        
        // Calcul net
        const netChange = ((inflow * environmentFactor * stormImpact) - outflow) * capacityFactor
        
        // Nouveau niveau (0-100)
        return Math.max(0, Math.min(100, prev + netChange))
      })
      
      // Mettre à jour la référence du dernier temps calculé
      lastCalculatedTimeRef.current += 0.05 // 50ms
    }, 50)

    return () => clearInterval(interval)
  }, [isPlaying, currentTime, tasks])

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setVideoSrc(url)
    }
  }

  // Video controls
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleSkipBack = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5)
    }
  }

  const handleSkipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 5)
    }
  }

  // Update current time when video is playing
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  // Set video duration when metadata is loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
    if (newVolume === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume
        setIsMuted(false)
      } else {
        videoRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  // Add a new task
  const addTask = () => {
    const newTask: Task = {
      id: Date.now(),
      name: `Tâche ${tasks.length + 1}`,
      start: currentTime,
      end: Math.min(currentTime + 10, duration),
      color: "rgb(255,30,90)",
      parameters: {
        flowRate: 50,
        glassCapacity: 50,
        absorptionRate: 50,
        environmentScore: 50,
        stormIntensity: 50,
      },
    }
    setTasks([...tasks, newTask])
    setSelectedTask(newTask.id)
    // Ouvrir le pop-up pour la nouvelle tâche
    setOpenPopups(prev => new Set([...Array.from(prev), newTask.id]))
    setPopupPositions(prev => ({
      ...prev,
      [newTask.id]: { x: 100 + (tasks.length * 30), y: 100 + (tasks.length * 30) }
    }))
  }

  // Delete selected task
  const deleteTask = () => {
    if (selectedTask !== null) {
      setTasks(tasks.filter((task) => task.id !== selectedTask))
      setSelectedTask(null)
    }
  }

  // Mettre à jour les paramètres d'une tâche
  const updateTaskParameters = (taskId: number, paramName: keyof TaskParameters, value: number) => {
    if (taskId !== null) {
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              parameters: { 
                ...task.parameters, 
                [paramName]: value 
              } 
            } 
          : task
      ));
    }
  };

  // Obtenir les paramètres de la tâche actuelle en fonction de la position de lecture
  const getCurrentTaskParameters = (): TaskParameters => {
    const currentTask = tasks.find(task => 
      currentTime >= task.start && currentTime <= task.end
    );
    
    return currentTask?.parameters || {
      flowRate: 0,
      glassCapacity: 50,
      absorptionRate: 0,
      environmentScore: 0,
      stormIntensity: 0
    };
  };

  // Format time as MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // Get current task based on playback position
  const getCurrentTask = () => {
    return tasks.find((task) => currentTime >= task.start && currentTime <= task.end) || null;
  };

  useEffect(() => {
    const currentTask = getCurrentTask();
    if (currentTask) {
      setSelectedTask(currentTask.id);
    }
  }, [currentTime, tasks]);

  // Handle timeline click to seek
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (timelineRef.current && videoRef.current) {
      const rect = timelineRef.current.getBoundingClientRect()
      const clickPosition = (e.clientX - rect.left) / rect.width
      videoRef.current.currentTime = clickPosition * duration
    }
  }

  // Handle progress bar click to seek
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect()
      const clickPosition = (e.clientX - rect.left) / rect.width
      videoRef.current.currentTime = clickPosition * duration
    }
  }

  // Fonction pour déplacer une tâche
  const moveTask = (e: React.MouseEvent<HTMLDivElement>, taskId: number) => {
    e.stopPropagation()
    
    let hasMoved = false

    if (timelineRef.current) {
      const task = tasks.find((t) => t.id === taskId)
      if (!task) return

      const rect = timelineRef.current.getBoundingClientRect()
      const taskWidth = ((task.end - task.start) / duration) * rect.width

      const handleMouseMove = (moveEvent: MouseEvent) => {
        hasMoved = true
        setIsTaskDragging(true)
        const newPosition = ((moveEvent.clientX - rect.left - taskWidth / 2) / rect.width) * duration
        const taskDuration = task.end - task.start

        // Ensure task stays within timeline bounds
        const newStart = Math.max(0, Math.min(duration - taskDuration, newPosition))
        const newEnd = newStart + taskDuration

        setTasks(tasks.map((t) => (t.id === taskId ? { ...t, start: newStart, end: newEnd } : t)))
      }

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        
        setTimeout(() => {
          setIsTaskDragging(false)
        }, 100)
        
        // Si pas de mouvement, c'est un clic simple - ouvrir le pop-up
        if (!hasMoved) {
          setSelectedTask(taskId)
          setOpenPopups(prev => new Set([...Array.from(prev), taskId]))
          if (!popupPositions[taskId]) {
            setPopupPositions(prev => ({
              ...prev,
              [taskId]: { x: 100, y: 100 }
            }))
          }
        }
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }
  }

  // Fonction pour redimensionner une tâche (début)
  const resizeTaskStart = (e: React.MouseEvent<HTMLDivElement>, taskId: number) => {
    e.stopPropagation()

    if (timelineRef.current) {
      const task = tasks.find((t) => t.id === taskId)
      if (!task) return

      const rect = timelineRef.current.getBoundingClientRect()

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const newStart = ((moveEvent.clientX - rect.left) / rect.width) * duration

        // Ensure start doesn't exceed end - 1
        const adjustedStart = Math.max(0, Math.min(task.end - 1, newStart))

        setTasks(tasks.map((t) => (t.id === taskId ? { ...t, start: adjustedStart } : t)))
      }

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }
  }

  // Fonction pour redimensionner une tâche (fin)
  const resizeTaskEnd = (e: React.MouseEvent<HTMLDivElement>, taskId: number) => {
    e.stopPropagation()

    if (timelineRef.current) {
      const task = tasks.find((t) => t.id === taskId)
      if (!task) return

      const rect = timelineRef.current.getBoundingClientRect()

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const newEnd = ((moveEvent.clientX - rect.left) / rect.width) * duration

        // Ensure end doesn't go below start + 1
        const adjustedEnd = Math.min(duration, Math.max(task.start + 1, newEnd))

        setTasks(tasks.map((t) => (t.id === taskId ? { ...t, end: adjustedEnd } : t)))
      }

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }
  }

  // Fonction pour renommer une tâche
  const renameTask = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    const newName = prompt("Entrez un nouveau nom pour cette tâche:", task.name)
    if (newName !== null) {
      setTasks(tasks.map((t) => (t.id === taskId ? { ...t, name: newName } : t)))
    }
  }

  // Gestion du drag & drop du popup
  const handleMouseDown = (e: React.MouseEvent, taskId: number) => {
    setIsDragging(taskId)
    const currentPos = popupPositions[taskId] || { x: 100, y: 100 }
    setDragOffset({
      x: e.clientX - currentPos.x,
      y: e.clientY - currentPos.y
    })
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging !== null) {
        setPopupPositions(prev => ({
          ...prev,
          [isDragging]: {
            x: e.clientX - dragOffset.x,
            y: e.clientY - dragOffset.y
          }
        }))
      }
    }

    const handleMouseUp = () => {
      setIsDragging(null)
    }

    if (isDragging !== null) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  return (
    <div className="p-6 text-white">
      {!videoSrc ? (
        <div className="flex flex-col items-center justify-center h-[300px] border-2 border-dashed border-gray-500 rounded-lg">
          <Upload className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-400 mb-4">Téléchargez une vidéo pour commencer l'analyse</p>
          <label htmlFor="video-upload">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
              onClick={() => document.getElementById('video-upload')?.click()}
            >
              Sélectionner une vidéo
            </Button>
            <input
              id="video-upload"
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Grille principale */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Colonne de gauche - Vidéo */}
            <div className="bg-slate-900/80 rounded-lg p-4">
              {videoSrc ? (
                <div className="relative group bg-black rounded-lg overflow-hidden flex items-center justify-center" style={{ minHeight: '400px', maxHeight: '70vh' }}>
                  <video
                    ref={videoRef}
                    src={videoSrc}
                    className="max-w-full max-h-full object-contain"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    loop
                  ></video>
                  
                  {/* Contrôles vidéo en overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center justify-between gap-3">
                      {/* Contrôles lecture */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={togglePlay}
                          className="h-9 w-9 text-white hover:bg-white/20"
                        >
                          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleSkipBack}
                          className="h-8 w-8 text-white hover:bg-white/20"
                        >
                          <SkipBack className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleSkipForward}
                          className="h-8 w-8 text-white hover:bg-white/20"
                        >
                          <SkipForward className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Timer */}
                      <div className="text-sm font-medium text-white">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </div>
                      
                      {/* Volume */}
                      <div className="flex items-center gap-2">
                        <button onClick={toggleMute} className="text-white hover:text-white/80">
                          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                        </button>
                        <Slider
                          value={[isMuted ? 0 : volume * 100]}
                          min={0}
                          max={100}
                          step={1}
                          className="w-24 [&_[role=slider]]:h-3 [&_[role=slider]]:w-3"
                          onValueChange={(value) => handleVolumeChange(value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed border-slate-700 rounded-lg">
                  <Upload className="h-12 w-12 text-slate-500 mb-4" />
                  <p className="text-slate-400 mb-4">Déposez votre vidéo ici ou cliquez pour parcourir</p>
                  <Button variant="outline" size="sm" className="relative">
                    Parcourir
                    <input
                      type="file"
                      accept="video/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleFileUpload}
                    />
                  </Button>
                </div>
              )}
            </div>
            
            {/* Colonne de droite - Modèle du verre */}
            <div className="bg-slate-900/80 rounded-lg p-4 flex flex-col">
              {/* Visualisation du modèle du verre */}
              <div className="bg-slate-950/50 p-4 rounded-lg flex-grow overflow-hidden flex items-center justify-center">
                {selectedTask ? (
                  <>
                    <div className="flex flex-col items-center justify-end relative" style={{ width: '800px', height: '800px', paddingBottom: '5px' }}>
                      {/* Bulle (environnement) */}
                      <div className="absolute z-10 border-2 border-purple-400/30 rounded-full" style={{ width: '700px', height: '700px', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                        <EnvironmentParticles 
                          score={tasks.find(t => t.id === selectedTask)?.parameters.environmentScore || 0}
                          isPaused={false}
                        />
                      </div>
                      
                      {/* Robinet avec filet d'eau intégré - Repositionné plus bas */}
                      <div className="relative z-20 mt-[400px]">
                        <TapComponent 
                          flowRate={tasks.find(t => t.id === selectedTask)?.parameters.flowRate || 0} 
                          onFlowRateChange={() => {}}
                          hideDebitLabel={true}
                        />
                      </div>
                      
                      {/* Orage - positionné entre le robinet et le verre */}
                      <div className="relative z-20 scale-90 mt-[-80px] mb-[50px] ml-[-80px]">
                        <StormComponent 
                          intensity={tasks.find(t => t.id === selectedTask)?.parameters.stormIntensity || 0} 
                          onIntensityChange={() => {}}
                          hideIntensityLabel={true} 
                        />
                      </div>
                      
                      {/* Verre avec paille */}
                      <div className="scale-100 mt-[-20px] relative z-10 mb-0">
                        <div className="relative">
                          <GlassComponent 
                            fillLevel={fillLevel} 
                            absorptionRate={tasks.find(t => t.id === selectedTask)?.parameters.absorptionRate || 0}
                            width={glassWidth}
                            hideColorLegend={true}
                          />
                          
                          {/* Paille positionnée dans le verre */}
                          <div className="absolute top-[-230px] right-[-5px] z-20">
                            <StrawComponent 
                              absorptionRate={tasks.find(t => t.id === selectedTask)?.parameters.absorptionRate || 0} 
                              setAbsorptionRate={() => {}} 
                              isInsideGlass={true}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-[650px]">
                    <p className="text-slate-400 text-center">
                      Sélectionnez une tâche pour visualiser le modèle du verre
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Timeline et contrôles des tâches */}
          <div className="mt-4 bg-slate-900/80 rounded-lg p-4">
            {/* Timeline */}
            <div ref={timelineRef} className="relative h-20 mx-0 mt-1 cursor-pointer bg-slate-900/80 rounded-lg p-2" onClick={handleTimelineClick}>
              {/* Background grid */}
              <div className="absolute top-0 left-0 right-0 bottom-0 grid grid-cols-10 gap-0">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="border-l border-slate-700 h-full"></div>
                ))}
              </div>

              {/* Time markers */}
              {duration > 0 &&
                Array.from({ length: Math.ceil(duration / 50) + 1 }).map((_, index) => (
                  <div
                    key={index}
                    className="absolute text-xs text-gray-400"
                    style={{ left: `${((index * 50) / duration) * 100}%`, top: "-12px" }}
                  >
                    {index * 50}
                  </div>
                ))}

              {/* Task segments */}
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`absolute h-10 flex items-center justify-center text-white text-xs group transition-all ${
                    selectedTask === task.id 
                      ? "ring-2 ring-yellow-400 ring-offset-1 ring-offset-slate-900 opacity-100" 
                      : "opacity-60 hover:opacity-80"
                  }`}
                  style={{
                    left: `${(task.start / Math.max(duration, 1)) * 100}%`,
                    width: `${((task.end - task.start) / Math.max(duration, 1)) * 100}%`,
                    backgroundColor: "rgb(255,30,90)",
                    top: "4px",
                    borderRadius: "4px"
                  }}
                >
                  {/* Bord gauche redimensionnable avec grip lines */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-3 cursor-w-resize bg-black/20 hover:bg-black/40 transition-colors flex items-center justify-center"
                    onMouseDown={(e) => resizeTaskStart(e, task.id)}
                    style={{ borderRadius: "4px 0 0 4px" }}
                  >
                    <div className="flex gap-[1px] h-full items-center">
                      <div className="w-[1px] h-1 bg-black/70"></div>
                      <div className="w-[1px] h-1 bg-black/70"></div>
                      <div className="w-[1px] h-1 bg-black/70"></div>
                      <div className="w-[1px] h-1 bg-black/70"></div>
                    </div>
                  </div>
                  
                  {/* Contenu de la tâche */}
                  <div
                    className="flex-1 truncate px-4 cursor-move"
                    onMouseDown={(e) => moveTask(e, task.id)}
                    onDoubleClick={(e) => {
                      e.stopPropagation()
                      renameTask(task.id)
                    }}
                  >
                    {task.name}
                  </div>
                  
                  {/* Bord droit redimensionnable avec grip lines */}
                  <div
                    className="absolute right-0 top-0 bottom-0 w-3 cursor-e-resize bg-black/20 hover:bg-black/40 transition-colors flex items-center justify-center"
                    onMouseDown={(e) => resizeTaskEnd(e, task.id)}
                    style={{ borderRadius: "0 4px 4px 0" }}
                  >
                    <div className="flex gap-[1px] h-full items-center">
                      <div className="w-[1px] h-1 bg-black/70"></div>
                      <div className="w-[1px] h-1 bg-black/70"></div>
                      <div className="w-[1px] h-1 bg-black/70"></div>
                      <div className="w-[1px] h-1 bg-black/70"></div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Playhead */}
              <div
                className="absolute top-0 bottom-0 w-[2px] bg-blue-500"
                style={{
                  left: `${(currentTime / Math.max(duration, 1)) * 100}%`,
                  transform: "translateX(-50%)",
                }}
              >
                <div className="w-3 h-3 bg-blue-500 rounded-full -mt-1 -ml-[5px]"></div>
              </div>

              {/* Scrubber bar */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-500"
                  style={{ width: `${(currentTime / Math.max(duration, 1)) * 100}%` }}
                ></div>
              </div>
            </div>
            
            {/* Contrôles des tâches */}
            <div className="flex flex-wrap items-center gap-2 bg-slate-800/80 p-2 rounded-lg">
              <Button
                variant="outline"
                size="sm"
                className="bg-[rgb(255,30,90)] hover:bg-[rgb(255,60,120)] text-white border-none flex items-center gap-1 shadow-lg shadow-[rgb(255,30,90)]/50"
                onClick={addTask}
              >
                <Plus className="h-4 w-4" />
                Ajouter une tâche
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-700 hover:bg-slate-600 text-white border-none flex items-center gap-1 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={deleteTask}
                disabled={selectedTask === null}
              >
                <Trash2 className="h-4 w-4" />
                Supprimer une tâche
              </Button>
              
              <div className="ml-auto flex items-center gap-2 text-sm">
                <span>Start: </span>
                <Input
                  type="number"
                  className="w-16 h-8 bg-slate-700 text-white border-slate-600"
                  value={selectedTask ? tasks.find((t) => t.id === selectedTask)?.start.toFixed(0) || 0 : 0}
                  onChange={(e) => {
                    if (selectedTask !== null) {
                      const newStart = Number(e.target.value)
                      setTasks(
                        tasks.map((task) =>
                          task.id === selectedTask
                            ? { ...task, start: newStart, end: Math.max(task.end, newStart + 1) }
                            : task,
                        ),
                      )
                    }
                  }}
                />
                <span>End: </span>
                <Input
                  type="number"
                  className="w-16 h-8 bg-slate-700 text-white border-slate-600"
                  value={selectedTask ? tasks.find((t) => t.id === selectedTask)?.end.toFixed(0) || 0 : 0}
                  onChange={(e) => {
                    if (selectedTask !== null) {
                      const newEnd = Number(e.target.value)
                      setTasks(
                        tasks.map((task) =>
                          task.id === selectedTask
                            ? { ...task, end: newEnd, start: Math.min(task.start, newEnd - 1) }
                            : task,
                        ),
                      )
                    }
                  }}
                />
                <span>Position: {formatTime(currentTime)}</span>
              </div>
            </div>
          </div>

          {/* Modal d'analyse ergonomique */}
          {selectedTaskForAnalysis && (
            <AnalysisModal
              isOpen={analysisModalOpen}
              onClose={() => {
                setAnalysisModalOpen(false)
                setSelectedTaskForAnalysis(null)
              }}
              taskId={selectedTaskForAnalysis.id}
              taskName={selectedTaskForAnalysis.name}
              taskDescription={`${secondsToMMSS(selectedTaskForAnalysis.start)} - ${secondsToMMSS(selectedTaskForAnalysis.end)}`}
              initialAnswers={taskAnalyses[selectedTaskForAnalysis.id]?.answers}
              initialScores={taskAnalyses[selectedTaskForAnalysis.id]?.scores}
              initialElement={taskAnalyses[selectedTaskForAnalysis.id]?.currentElement}
              initialQuestionIndex={taskAnalyses[selectedTaskForAnalysis.id]?.currentQuestionIndex}
              onSave={(data) => {
                console.log('Analyse sauvegardée pour la tâche:', selectedTaskForAnalysis.id, data)
                
                // Sauvegarder l'analyse pour cette tâche (avec position)
                setTaskAnalyses(prev => ({
                  ...prev,
                  [selectedTaskForAnalysis.id]: {
                    answers: data.answers,
                    scores: data.scores,
                    currentElement: data.currentElement,
                    currentQuestionIndex: data.currentQuestionIndex,
                    taskName: selectedTaskForAnalysis.name,
                    savedAt: new Date().toISOString()
                  }
                }))
              }}
            />
          )}

          {/* Pop-ups flottants pour éditer les tâches */}
          {Array.from(openPopups).map(taskId => {
            const position = popupPositions[taskId] || { x: 100, y: 100 }
            const task = tasks.find(t => t.id === taskId)
            if (!task) return null
            
            const isSelected = selectedTask === taskId
            
            return (
              <div 
                key={taskId}
                className={`fixed bg-black/95 rounded-lg shadow-2xl z-50 transition-all cursor-pointer ${
                  isSelected 
                    ? "border-2 border-yellow-400 opacity-100" 
                    : "border-2 border-[rgb(255,30,90)] opacity-60 hover:opacity-80"
                }`}
                style={{ 
                  left: `${position.x}px`, 
                  top: `${position.y}px`,
                  width: '280px'
                }}
                onClick={() => setSelectedTask(taskId)}
              >
                {/* Header draggable */}
                <div 
                  className="flex items-center justify-between p-3 border-b border-[rgb(255,30,90)]/30 cursor-move bg-slate-900/50"
                  onMouseDown={(e) => handleMouseDown(e, taskId)}
                >
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-[rgb(255,30,90)]" />
                    <h3 className="text-sm font-semibold text-white">{task.name}</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedTaskForAnalysis(task)
                        setAnalysisModalOpen(true)
                      }}
                      className="text-slate-400 hover:text-yellow-400 transition-colors p-1 rounded hover:bg-slate-800"
                      title="Analyser cette tâche"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setOpenPopups(prev => {
                          const newSet = new Set(prev)
                          newSet.delete(taskId)
                          return newSet
                        })
                      }}
                      className="text-slate-400 hover:text-[rgb(255,30,90)] transition-colors p-1 rounded hover:bg-slate-800"
                      title="Fermer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-2 space-y-2">
                  {/* Nom */}
                  <div>
                    <label className="text-xs font-medium text-gray-400 mb-1 block">Nom</label>
                    <Input
                      type="text"
                      value={task.name}
                      onChange={(e) => {
                        setTasks(tasks.map(t => 
                          t.id === taskId ? { ...t, name: e.target.value } : t
                        ))
                      }}
                      className="bg-slate-800/50 border-slate-600 text-white h-8 text-sm"
                    />
                  </div>

                  {/* Durée */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium text-gray-400 mb-1 block">Début (MM:SS)</label>
                      <Input
                        type="text"
                        value={secondsToMMSS(task.start)}
                        onChange={(e) => {
                          const newStart = mmssToSeconds(e.target.value)
                          setTasks(tasks.map(t => 
                            t.id === taskId ? { ...t, start: Math.max(0, newStart) } : t
                          ))
                        }}
                        placeholder="00:00"
                        className="bg-slate-800/50 border-slate-600 text-white h-8 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-400 mb-1 block">Fin (MM:SS)</label>
                      <Input
                        type="text"
                        value={secondsToMMSS(task.end)}
                        onChange={(e) => {
                          const newEnd = mmssToSeconds(e.target.value)
                          setTasks(tasks.map(t => 
                            t.id === taskId ? { ...t, end: Math.max(task.start + 1, newEnd) } : t
                          ))
                        }}
                        placeholder="00:00"
                        className="bg-slate-800/50 border-slate-600 text-white h-8 text-xs"
                      />
                    </div>
                  </div>

                  {/* Paramètres - Version compacte */}
                  <div className="space-y-1 pt-1.5 border-t border-slate-700">
                    {/* Robinet */}
                    <div>
                      <div className="flex justify-between items-center mb-0.5">
                        <label className="text-xs font-medium text-blue-400">Robinet</label>
                        <span className="text-xs font-bold text-blue-400">{task.parameters.flowRate}</span>
                      </div>
                      <RadixSlider.Root
                        value={[task.parameters.flowRate]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(values) => updateTaskParameters(taskId, 'flowRate', values[0] ?? 0)}
                        className="relative flex h-6 w-full touch-none select-none items-center"
                      >
                        <RadixSlider.Track className="relative h-1.5 grow rounded-full bg-white/10">
                          <RadixSlider.Range className="absolute h-full rounded-full bg-[rgb(96,165,250)]" />
                        </RadixSlider.Track>
                        <RadixSlider.Thumb className="block h-4 w-4 rounded-full bg-[rgb(96,165,250)] shadow-md ring-2 ring-[rgb(96,165,250)]/25" />
                      </RadixSlider.Root>
                    </div>

                    {/* Verre */}
                    <div>
                      <div className="flex justify-between items-center mb-0.5">
                        <label className="text-xs font-medium text-gray-300">Verre</label>
                        <span className="text-xs font-bold text-gray-300">{task.parameters.glassCapacity}</span>
                      </div>
                      <RadixSlider.Root
                        value={[task.parameters.glassCapacity]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(values) => updateTaskParameters(taskId, 'glassCapacity', values[0] ?? 0)}
                        className="relative flex h-6 w-full touch-none select-none items-center"
                      >
                        <RadixSlider.Track className="relative h-1.5 grow rounded-full bg-white/10">
                          <RadixSlider.Range className="absolute h-full rounded-full bg-[rgb(209,213,219)]" />
                        </RadixSlider.Track>
                        <RadixSlider.Thumb className="block h-4 w-4 rounded-full bg-[rgb(209,213,219)] shadow-md ring-2 ring-[rgb(209,213,219)]/25" />
                      </RadixSlider.Root>
                    </div>

                    {/* Paille */}
                    <div>
                      <div className="flex justify-between items-center mb-0.5">
                        <label className="text-xs font-medium text-green-400">Paille</label>
                        <span className="text-xs font-bold text-green-400">{task.parameters.absorptionRate}</span>
                      </div>
                      <RadixSlider.Root
                        value={[task.parameters.absorptionRate]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(values) => updateTaskParameters(taskId, 'absorptionRate', values[0] ?? 0)}
                        className="relative flex h-6 w-full touch-none select-none items-center"
                      >
                        <RadixSlider.Track className="relative h-1.5 grow rounded-full bg-white/10">
                          <RadixSlider.Range className="absolute h-full rounded-full bg-[rgb(74,222,128)]" />
                        </RadixSlider.Track>
                        <RadixSlider.Thumb className="block h-4 w-4 rounded-full bg-[rgb(74,222,128)] shadow-md ring-2 ring-[rgb(74,222,128)]/25" />
                      </RadixSlider.Root>
                    </div>

                    {/* Bulle */}
                    <div>
                      <div className="flex justify-between items-center mb-0.5">
                        <label className="text-xs font-medium text-purple-400">Bulle</label>
                        <span className="text-xs font-bold text-purple-400">{task.parameters.environmentScore}</span>
                      </div>
                      <RadixSlider.Root
                        value={[task.parameters.environmentScore]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(values) => updateTaskParameters(taskId, 'environmentScore', values[0] ?? 0)}
                        className="relative flex h-6 w-full touch-none select-none items-center"
                      >
                        <RadixSlider.Track className="relative h-1.5 grow rounded-full bg-white/10">
                          <RadixSlider.Range className="absolute h-full rounded-full bg-[rgb(192,132,252)]" />
                        </RadixSlider.Track>
                        <RadixSlider.Thumb className="block h-4 w-4 rounded-full bg-[rgb(192,132,252)] shadow-md ring-2 ring-[rgb(192,132,252)]/25" />
                      </RadixSlider.Root>
                    </div>

                    {/* Orage */}
                    <div>
                      <div className="flex justify-between items-center mb-0.5">
                        <label className="text-xs font-medium text-amber-400">Orage</label>
                        <span className="text-xs font-bold text-amber-400">{task.parameters.stormIntensity}</span>
                      </div>
                      <RadixSlider.Root
                        value={[task.parameters.stormIntensity]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(values) => updateTaskParameters(taskId, 'stormIntensity', values[0] ?? 0)}
                        className="relative flex h-6 w-full touch-none select-none items-center"
                      >
                        <RadixSlider.Track className="relative h-1.5 grow rounded-full bg-white/10">
                          <RadixSlider.Range className="absolute h-full rounded-full bg-[rgb(251,191,36)]" />
                        </RadixSlider.Track>
                        <RadixSlider.Thumb className="block h-4 w-4 rounded-full bg-[rgb(251,191,36)] shadow-md ring-2 ring-[rgb(251,191,36)]/25" />
                      </RadixSlider.Root>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
