import { Clock, Users, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface ExerciseCardProps {
  exercise: {
    id: string
    title: string
    category: string
    duration?: string
    targetGroup?: string
    content: { html: string }
  }
}

export default function ExerciseCard({ exercise }: ExerciseCardProps) {
  return (
    <Link to={`/ovning/${exercise.id}`} className="block">
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
        <div className="p-6 flex-1">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-boost-gold/20 text-boost-navy mb-3">
            {exercise.category}
          </span>

          <h3 className="text-lg font-semibold text-boost-navy mb-2">{exercise.title}</h3>

          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
            {exercise.duration && (
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{exercise.duration}</span>
              </div>
            )}
            {exercise.targetGroup && (
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span className="truncate max-w-[150px]">{exercise.targetGroup}</span>
              </div>
            )}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {exercise.content.html.replace(/<[^>]*>/g, '').substring(0, 120)}...
          </p>
        </div>

        <div className="px-6 py-4 border-t bg-boost-cream/50">
          <span className="inline-flex items-center gap-1 text-sm font-medium text-boost-navy">
            Läs mer <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}