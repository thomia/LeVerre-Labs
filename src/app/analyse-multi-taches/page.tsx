"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, Play, Pause, Plus, Settings, X } from 'lucide-react'
import TapComponent from '@/components/dashboard/tap-component'
import GlassComponent from '@/components/dashboard/glass-component'
import StrawComponent from '@/components/dashboard/straw-component'
import StormComponent from '@/components/dashboard/storm-component'
import { EnvironmentParticles } from '@/components/dashboard/bubble-component'
import ScoreModal from '@/components/analyse-multi-taches/score-modal'

interface Task {
  id: string
  label: string
  startTime: number
  endTime: number
  scores: {
    robinet: number | null
    verre: number | null
    paille: number | null
    bulle: number | null
    orage: number | null
  }
}

export default function AnalyseMultiTachesPage() {
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [totalDuration, setTotalDuration] = useState(0)
  const [activeTaskIndex, setActiveTaskIndex] = useState<number | null>(null)
  const [scoreModal, setScoreModal] = useState<{
    isOpen: boolean
    taskIndex: number | null
    componentKey: string | null
  }>({ isOpen: false, taskIndex: null, componentKey: null })
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [draggingTask, setDraggingTask] = useState<{
    index: number
    type: 'move' | 'resize-start' | 'resize-end'
    initialX: number
    initialStart: number
    initialEnd: number
  } | null>(null)

  // Gestion de l'upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const fileArray = Array.from(files)
      setMediaFiles(fileArray)
      
      // Calculer la durée totale (exemple : 10s par fichier)
      const duration = fileArray.length * 10
      setTotalDuration(duration)
    }
  }

  // Ajouter une tâche
  const addTask = () => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      label: `Tâche ${tasks.length + 1}`,
      startTime: currentTime,
      endTime: Math.min(currentTime + 30, totalDuration), // 30s par défaut
      scores: {
        robinet: null,
        verre: null,
        paille: null,
        bulle: null,
        orage: null,
      }
    }
    setTasks([...tasks, newTask])
  }

  // Supprimer une tâche
  const deleteTask = (taskId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche et tous ses scores ?')) {
      setTasks(tasks.filter(t => t.id !== taskId))
      if (activeTaskIndex !== null && tasks[activeTaskIndex]?.id === taskId) {
        setActiveTaskIndex(null)
      }
    }
  }

  // Modifier une tâche
  const updateTask = (index: number, updates: Partial<Task>) => {
    const newTasks = [...tasks]
    newTasks[index] = { ...newTasks[index], ...updates }
    setTasks(newTasks)
  }

  // Gestion du drag pour déplacer/redimensionner les tâches
  const handleTaskMouseDown = (e: React.MouseEvent, index: number, type: 'move' | 'resize-start' | 'resize-end') => {
    e.stopPropagation()
    setDraggingTask({
      index,
      type,
      initialX: e.clientX,
      initialStart: tasks[index].startTime,
      initialEnd: tasks[index].endTime
    })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!draggingTask) return

    const timelineElement = document.querySelector('.timeline-container')
    if (!timelineElement) return

    const rect = timelineElement.getBoundingClientRect()
    const deltaX = e.clientX - draggingTask.initialX
    const deltaTime = (deltaX / rect.width) * totalDuration

    const task = tasks[draggingTask.index]
    const minDuration = 1 // Durée minimale de 1 seconde

    if (draggingTask.type === 'move') {
      // Déplacer toute la tâche
      const duration = draggingTask.initialEnd - draggingTask.initialStart
      let newStart = draggingTask.initialStart + deltaTime
      let newEnd = draggingTask.initialEnd + deltaTime

      // Limiter aux bornes
      if (newStart < 0) {
        newStart = 0
        newEnd = duration
      }
      if (newEnd > totalDuration) {
        newEnd = totalDuration
        newStart = totalDuration - duration
      }

      updateTask(draggingTask.index, {
        startTime: Math.max(0, newStart),
        endTime: Math.min(totalDuration, newEnd)
      })
    } else if (draggingTask.type === 'resize-start') {
      // Redimensionner le début
      const newStart = Math.max(0, draggingTask.initialStart + deltaTime)
      if (draggingTask.initialEnd - newStart >= minDuration) {
        updateTask(draggingTask.index, { startTime: newStart })
      }
    } else if (draggingTask.type === 'resize-end') {
      // Redimensionner la fin
      const newEnd = Math.min(totalDuration, draggingTask.initialEnd + deltaTime)
      if (newEnd - draggingTask.initialStart >= minDuration) {
        updateTask(draggingTask.index, { endTime: newEnd })
      }
    }
  }

  const handleMouseUp = () => {
    setDraggingTask(null)
  }

  // Écouter les événements de souris pour le drag
  useEffect(() => {
    if (draggingTask) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [draggingTask, tasks, totalDuration])

  // Contrôler la lecture vidéo
  useEffect(() => {
    if (!videoRef.current) return
    
    if (isPlaying) {
      videoRef.current.play().catch(err => console.error('Erreur lecture vidéo:', err))
    } else {
      videoRef.current.pause()
    }
  }, [isPlaying])

  // Mettre à jour currentTime depuis la vidéo pendant la lecture
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      if (isPlaying) {
        setCurrentTime(video.currentTime)
      }
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(totalDuration)
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
    }
  }, [isPlaying, totalDuration])
  
  // Synchroniser manuellement le temps de la vidéo quand on déplace le curseur
  useEffect(() => {
    if (!videoRef.current || isPlaying) return
    videoRef.current.currentTime = currentTime
  }, [currentTime, isPlaying])

  // Switching automatique des modèles selon le temps
  useEffect(() => {
    if (tasks.length === 0) return
    
    const currentTask = tasks.find(task => 
      currentTime >= task.startTime && currentTime < task.endTime
    )
    
    if (currentTask) {
      const index = tasks.findIndex(t => t.id === currentTask.id)
      setActiveTaskIndex(index)
    }
  }, [currentTime, tasks])

  // Obtenir la tâche active
  const getActiveTask = () => {
    if (activeTaskIndex !== null) {
      return tasks[activeTaskIndex]
    }
    return tasks.find(task => currentTime >= task.startTime && currentTime < task.endTime)
  }

  const activeTask = getActiveTask()

  // Ouvrir le modal de score
  const openScoreModal = (taskIndex: number, componentKey: string) => {
    setScoreModal({ isOpen: true, taskIndex, componentKey })
  }

  // Sauvegarder un score
  const handleSaveScore = (score: number) => {
    if (scoreModal.taskIndex !== null && scoreModal.componentKey) {
      const newTasks = [...tasks]
      newTasks[scoreModal.taskIndex].scores[scoreModal.componentKey as keyof typeof newTasks[0]['scores']] = score
      setTasks(newTasks)
      setScoreModal({ isOpen: false, taskIndex: null, componentKey: null })
    }
  }

  const scoreComponentData: Record<string, { label: string, color: string, textColor: string }> = {
    robinet: { label: 'Robinet', color: 'blue', textColor: 'text-blue-400' },
    verre: { label: 'Verre', color: 'gray', textColor: 'text-gray-400' },
    bulle: { label: 'Bulle', color: 'purple', textColor: 'text-purple-400' },
    orage: { label: 'Orage', color: 'yellow', textColor: 'text-yellow-400' },
    paille: { label: 'Paille', color: 'green', textColor: 'text-green-400' },
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-8">
      <div className="max-w-[1800px] mx-auto px-6">
        <h1 className="text-4xl font-bold text-white mb-8">
          Analyse Ergonomique Multi-Tâches
        </h1>

        {/* Layout principal : 3 zones */}
        <div className="grid grid-cols-12 gap-6 mb-6">
          {/* Zone Gauche : Modèle Visuel */}
          <div className="col-span-5 bg-gray-950/50 rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              {activeTask ? `Modèle - ${activeTask.label}` : 'Modèle (Inactif)'}
            </h2>
            
            <div className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
              {/* Modèle toujours visible */}
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Bulle environnementale */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full overflow-hidden border-2 border-purple-400/40 bg-transparent opacity-50">
                  <EnvironmentParticles 
                    score={activeTask?.scores.bulle || 0} 
                    isPaused={!isPlaying}
                  />
                </div>
                
                {/* Structure du modèle - réduite pour tenir dans le cadre */}
                <div className="flex flex-col items-center justify-center relative scale-[0.7]">
                  {/* Robinet - Toujours visible */}
                  <div className={`relative z-20 mt-[200px] transition-opacity duration-500 ${!activeTask || activeTask.scores.robinet === null ? 'opacity-30' : 'opacity-100'}`}>
                    <TapComponent 
                      flowRate={activeTask?.scores.robinet || 0} 
                      onFlowRateChange={() => {}}
                      hideDebitLabel={true}
                    />
                  </div>
                  
                  {/* Orage - Toujours visible */}
                  <div className={`relative z-20 scale-110 mt-[-180px] mb-[30px] ml-[-120px] transition-opacity duration-500 ${!activeTask || activeTask.scores.orage === null ? 'opacity-30' : 'opacity-100'}`}>
                    <StormComponent 
                      intensity={activeTask?.scores.orage || 0} 
                      onIntensityChange={() => {}}
                      hideIntensityLabel={true} 
                    />
                  </div>
                  
                  {/* Verre - Toujours visible */}
                  <div className={`scale-125 mt-[-20px] relative z-10 transition-opacity duration-500 ${!activeTask || activeTask.scores.verre === null ? 'opacity-30' : 'opacity-100'}`}>
                    <div className="relative">
                      <GlassComponent 
                        fillLevel={(() => {
                          // Calculer le niveau de remplissage basé sur les tâches précédentes
                          if (!activeTask || activeTaskIndex === null) return 0
                          
                          // Accumulation du remplissage des tâches précédentes
                          let accumulatedFill = 0
                          for (let i = 0; i <= activeTaskIndex; i++) {
                            const taskScore = tasks[i]?.scores.robinet || 0
                            accumulatedFill += taskScore * 0.3 // Facteur d'accumulation
                          }
                          
                          return Math.min(100, accumulatedFill)
                        })()} 
                        absorptionRate={activeTask?.scores.paille || 0}
                        width={activeTask?.scores.verre || 20}
                      />
                      
                      {/* Paille - Toujours visible */}
                      <div className={`absolute top-[-230px] right-[-5px] z-20 transition-opacity duration-500 ${!activeTask || activeTask.scores.paille === null ? 'opacity-30' : 'opacity-100'}`}>
                        <StrawComponent 
                          absorptionRate={activeTask?.scores.paille || 0} 
                          setAbsorptionRate={() => {}} 
                          isInsideGlass={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Indicateur si aucune tâche active */}
                {!activeTask && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center text-gray-500 bg-black/60 backdrop-blur-sm rounded-xl p-6">
                      <p className="text-lg font-medium">Modèle désactivé</p>
                      <p className="text-sm mt-2">Créez une tâche et renseignez les scores</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Zone Droite : Upload / Lecteur Média */}
          <div className="col-span-7 bg-gray-950/50 rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Médias</h2>
            
            {mediaFiles.length === 0 ? (
              // Zone d'upload
              <label className="flex flex-col items-center justify-center w-full h-[600px] border-2 border-dashed border-gray-700 rounded-xl cursor-pointer hover:border-[rgb(255,30,90)] transition-colors group">
                <div className="flex flex-col items-center justify-center text-center p-8">
                  <Upload className="w-16 h-16 text-gray-500 group-hover:text-[rgb(255,30,90)] mb-4 transition-colors" />
                  <p className="text-xl text-gray-300 mb-2">Cliquez pour importer des fichiers</p>
                  <p className="text-sm text-gray-500">
                    Vidéos (MP4, MOV, AVI) ou Images (JPEG, PNG)
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept="video/*,image/*"
                  onChange={handleFileUpload}
                />
              </label>
            ) : (
              // Lecteur média
              <div className="w-full h-[600px] bg-gray-900 rounded-xl overflow-hidden">
                {mediaFiles[currentMediaIndex]?.type.startsWith('image/') ? (
                  // Affichage d'image
                  <img
                    src={URL.createObjectURL(mediaFiles[currentMediaIndex])}
                    alt={`Media ${currentMediaIndex + 1}`}
                    className="w-full h-full object-contain"
                  />
                ) : mediaFiles[currentMediaIndex]?.type.startsWith('video/') ? (
                  // Lecteur vidéo
                  <video
                    ref={videoRef}
                    src={URL.createObjectURL(mediaFiles[currentMediaIndex])}
                    className="w-full h-full"
                    onLoadedMetadata={(e) => {
                      const video = e.currentTarget
                      setTotalDuration(video.duration)
                    }}
                  />
                ) : (
                  // Placeholder
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🎬</div>
                      <p className="text-lg">{mediaFiles.length} fichier(s) importé(s)</p>
                      <p className="text-sm mt-2">Durée totale : {totalDuration}s</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Zone Inférieure : Timeline et Tâches */}
        {mediaFiles.length > 0 && (
          <div className="bg-gray-950/50 rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Timeline</h2>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={addTask}
                  className="flex items-center gap-2 px-4 py-2 bg-[rgb(255,30,90)] hover:bg-[rgb(255,60,120)] text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter une tâche
                </button>
                
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? 'Pause' : 'Lecture'}
                </button>
              </div>
            </div>

            {/* Timeline unifiée avec toutes les lignes de scores */}
            {tasks.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <p className="text-lg">Aucune tâche créée</p>
                <p className="text-sm mt-2">Cliquez sur "Ajouter une tâche" pour commencer</p>
              </div>
            ) : (
              <div className="bg-gray-900/50 rounded-xl p-6 border border-white/10">
                {/* Timeline principale avec toutes les lignes */}
                <div className="relative">
                  {/* En-tête avec labels des tâches - draggable */}
                  <div className="relative h-12 mb-2 ml-32 timeline-container">
                    {tasks.map((task, index) => {
                      const left = (task.startTime / totalDuration) * 100
                      const width = ((task.endTime - task.startTime) / totalDuration) * 100
                      const isActive = index === activeTaskIndex
                      const isDragging = draggingTask?.index === index
                      
                      return (
                        <div
                          key={task.id}
                          onClick={() => {
                            setCurrentTime(task.startTime)
                            setActiveTaskIndex(index)
                          }}
                          className={`absolute top-0 h-full flex items-center justify-center transition-all border-2 ${
                            isActive ? 'bg-[rgb(255,30,90)]/30 border-[rgb(255,30,90)]' : 'hover:bg-white/5 border-white/20'
                          } ${isDragging ? 'opacity-80 cursor-grabbing' : ''}`}
                          style={{ left: `${left}%`, width: `${width}%` }}
                        >
                          {/* Poignée gauche pour redimensionner le début */}
                          <div
                            onMouseDown={(e) => handleTaskMouseDown(e, index, 'resize-start')}
                            className="absolute left-0 top-0 bottom-0 w-2 bg-[rgb(255,30,90)] hover:bg-[rgb(255,60,120)] cursor-ew-resize z-20 opacity-0 hover:opacity-100 transition-opacity"
                          />
                          
                          {/* Zone centrale pour déplacer */}
                          <div
                            onMouseDown={(e) => handleTaskMouseDown(e, index, 'move')}
                            className="flex-1 h-full flex items-center justify-center cursor-grab active:cursor-grabbing px-6"
                          >
                            <span className="text-xs font-bold text-white truncate">{task.label}</span>
                          </div>
                          
                          {/* Poignée droite pour redimensionner la fin */}
                          <div
                            onMouseDown={(e) => handleTaskMouseDown(e, index, 'resize-end')}
                            className="absolute right-0 top-0 bottom-0 w-2 bg-[rgb(255,30,90)] hover:bg-[rgb(255,60,120)] cursor-ew-resize z-20 opacity-0 hover:opacity-100 transition-opacity"
                          />
                          
                          {/* Bouton supprimer */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteTask(task.id)
                            }}
                            className="absolute top-1 right-1 text-red-400 hover:text-red-300 z-30"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )
                    })}
                  </div>

                  {/* 5 lignes de scores (une par composant) */}
                  {[
                    { key: 'verre', label: 'Score Verre', lineColor: 'bg-gray-500', textColor: 'text-gray-400' },
                    { key: 'robinet', label: 'Score Robinet', lineColor: 'bg-blue-500', textColor: 'text-blue-400' },
                    { key: 'bulle', label: 'Score Bulle', lineColor: 'bg-purple-500', textColor: 'text-purple-400' },
                    { key: 'orage', label: 'Score Orage', lineColor: 'bg-yellow-500', textColor: 'text-yellow-400' },
                    { key: 'paille', label: 'Score Paille', lineColor: 'bg-green-500', textColor: 'text-green-400' },
                  ].map((component) => (
                    <div key={component.key} className="relative flex items-center h-16 mb-2">
                      {/* Label du composant à gauche */}
                      <div className={`w-32 pr-4 ${component.textColor} font-semibold text-sm text-right flex-shrink-0`}>
                        {component.label}
                      </div>
                      
                      {/* Ligne horizontale colorée */}
                      <div className="relative flex-1 h-full">
                        <div className={`absolute inset-0 ${component.lineColor} opacity-20`} />
                        
                        {/* Cases de scores pour chaque tâche */}
                        {tasks.map((task, taskIndex) => {
                          const score = task.scores[component.key as keyof typeof task.scores]
                          const left = (task.startTime / totalDuration) * 100
                          const width = ((task.endTime - task.startTime) / totalDuration) * 100
                          
                          const getBorderColor = () => {
                            if (score === null) return 'border-white/20'
                            if (score < 30) return 'border-green-500'
                            if (score < 70) return 'border-yellow-500'
                            return 'border-red-500'
                          }
                          
                          return (
                            <div
                              key={`${task.id}-${component.key}`}
                              onClick={() => openScoreModal(taskIndex, component.key)}
                              className={`absolute top-1/2 -translate-y-1/2 flex items-center justify-center border-2 ${getBorderColor()} bg-gray-900/80 rounded cursor-pointer hover:scale-105 transition-all`}
                              style={{ 
                                left: `${left}%`, 
                                width: `${width}%`,
                                height: '80%'
                              }}
                            >
                              <span className="text-lg font-bold text-white">
                                {score !== null ? score : '???'}
                              </span>
                            </div>
                          )
                        })}
                        
                        {/* Séparateurs verticaux en pointillé (limites de tâches) */}
                        {tasks.map((task, index) => (
                          <React.Fragment key={`separator-${task.id}`}>
                            {/* Début de tâche */}
                            <div
                              className="absolute top-0 bottom-0 w-0 border-l-2 border-dashed border-white/30 z-10"
                              style={{ left: `${(task.startTime / totalDuration) * 100}%` }}
                            />
                            {/* Fin de tâche */}
                            {index === tasks.length - 1 && (
                              <div
                                className="absolute top-0 bottom-0 w-0 border-l-2 border-dashed border-white/30 z-10"
                                style={{ left: `${(task.endTime / totalDuration) * 100}%` }}
                              />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {/* Curseur de lecture vertical qui traverse TOUTES les lignes */}
                  <div 
                    className="absolute top-0 bottom-0 w-1 bg-white z-30 pointer-events-none ml-32"
                    style={{ left: `calc(${(currentTime / totalDuration) * 100}%)` }}
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-lg" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-lg" />
                  </div>
                </div>
                
                {/* Contrôle de lecture */}
                <div className="mt-6 ml-32">
                  <input
                    type="range"
                    min={0}
                    max={totalDuration}
                    step={0.1}
                    value={currentTime}
                    onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>{currentTime.toFixed(1)}s</span>
                    <span>{totalDuration}s</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal de saisie des scores */}
        {scoreModal.isOpen && scoreModal.taskIndex !== null && scoreModal.componentKey && (
          <ScoreModal
            isOpen={scoreModal.isOpen}
            onClose={() => setScoreModal({ isOpen: false, taskIndex: null, componentKey: null })}
            taskLabel={tasks[scoreModal.taskIndex].label}
            componentName={scoreModal.componentKey}
            componentColor={scoreComponentData[scoreModal.componentKey].textColor}
            currentScore={tasks[scoreModal.taskIndex].scores[scoreModal.componentKey as keyof typeof tasks[0]['scores']]}
            onSave={handleSaveScore}
          />
        )}

      </div>
    </div>
  )
}
