"use client"

import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Volume2, Play, Pause, Plus, Music } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

// Placeholder data for African instruments
const africanInstruments = [
  "Djembe",
  "Kora",
  "Balafon",
  "Talking Drum",
  "Mbira",
  "Shekere",
  "Udu",
]

// Placeholder function for generating music
const generateMusic = async (tracks) => {
  console.log("Generating music with tracks:", tracks)
  // In a real implementation, this would call the backend API
  return new Promise(resolve => setTimeout(() => resolve("Generated music URL"), 2000))
}

export default function EnhancedMusicProductionPlatform() {
  const [tracks, setTracks] = useState([
    { id: 'track1', instrument: 'Djembe', volume: 50, tempo: 120 },
    { id: 'track2', instrument: 'Kora', volume: 60, tempo: 120 },
  ])
  const [isPlaying, setIsPlaying] = useState(false)

  const onDragEnd = (result) => {
    if (!result.destination) return
    const items = Array.from(tracks)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    setTracks(items)
  }

  const updateTrack = (id, field, value) => {
    setTracks(tracks.map(track => 
      track.id === id ? { ...track, [field]: value } : track
    ))
  }

  const addTrack = () => {
    const newTrack = {
      id: `track${tracks.length + 1}`,
      instrument: africanInstruments[0],
      volume: 50,
      tempo: 120
    }
    setTracks([...tracks, newTrack])
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    if (!isPlaying) {
      generateMusic(tracks).then(url => {
        console.log("Music generated:", url)
        // In a real implementation, you would play the audio here
      })
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-4xl mx-auto bg-background min-h-screen flex flex-col"
    >
      <motion.h1 
        className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        AI African Music Production Platform
      </motion.h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tracks">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-4 flex-grow">
              <AnimatePresence>
                {tracks.map((track, index) => (
                  <Draggable key={track.id} draggableId={track.id} index={index}>
                    {(provided) => (
                      <motion.li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-card p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold mb-2 md:mb-0">Track {index + 1}</h3>
                          <Select
                            value={track.instrument}
                            onValueChange={(value) => updateTrack(track.id, 'instrument', value)}
                          >
                            <SelectTrigger className="w-full md:w-[180px]">
                              <SelectValue placeholder="Select instrument" />
                            </SelectTrigger>
                            <SelectContent>
                              {africanInstruments.map((instrument) => (
                                <SelectItem key={instrument} value={instrument}>
                                  {instrument}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center space-x-4 mb-4">
                          <Volume2 className="w-6 h-6 text-primary" />
                          <Slider
                            value={[track.volume]}
                            onValueChange={(value) => updateTrack(track.id, 'volume', value[0])}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Tempo: {track.tempo} BPM</label>
                          <Slider
                            value={[track.tempo]}
                            onValueChange={(value) => updateTrack(track.id, 'tempo', value[0])}
                            min={60}
                            max={200}
                            step={1}
                            className="w-full"
                          />
                        </div>
                      </motion.li>
                    )}
                  </Draggable>
                ))}
              </AnimatePresence>
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <motion.div 
        className="mt-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Button onClick={addTrack} className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-secondary hover:bg-secondary-dark transition-colors duration-300">
          <Plus className="w-4 h-4" />
          <span>Add Track</span>
        </Button>
        <motion.div
          animate={isPlaying ? { scale: [1, 1.1, 1] } : { scale: 1 }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <Button 
            onClick={handlePlayPause} 
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-primary hover:bg-primary-dark transition-colors duration-300"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </Button>
        </motion.div>
      </motion.div>
      {isPlaying && (
        <motion.div
          className="mt-6 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Music className="w-12 h-12 text-primary" />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}