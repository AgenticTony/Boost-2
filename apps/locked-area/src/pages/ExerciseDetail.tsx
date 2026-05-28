import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Users, Tag } from 'lucide-react'
import { useExercise } from '../hooks/useExercise'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

export default function ExerciseDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: exercise, isLoading, error } = useExercise(id || '')

  return (
    <>
      <Helmet>
        <title>{exercise ? `${exercise.title} | Övning` : 'Övning'} | Boost by FCR</title>
      </Helmet>

      <div className="container py-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-boost-navy transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Tillbaka till biblioteket
        </button>

        {isLoading && <LoadingSpinner />}
        {error && <ErrorMessage message="Kunde inte ladda övningen. Försök igen senare." />}

        {!isLoading && !error && exercise && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="bg-white rounded-xl shadow-sm border p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-boost-gold/20 text-boost-navy mb-3">
                    <Tag className="w-3 h-3 mr-1" />
                    {exercise.category}
                  </span>
                  <h1 className="text-3xl font-bold text-boost-navy">{exercise.title}</h1>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-8 text-sm text-muted-foreground">
                {exercise.duration && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{exercise.duration}</span>
                  </div>
                )}
                {exercise.targetGroup && (
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>{exercise.targetGroup}</span>
                  </div>
                )}
              </div>

              <div
                className="prose prose-lg max-w-none prose-headings:text-boost-navy"
                dangerouslySetInnerHTML={{ __html: exercise.content?.html ?? '' }}
              />
            </div>
          </motion.div>
        )}
      </div>
    </>
  )
}