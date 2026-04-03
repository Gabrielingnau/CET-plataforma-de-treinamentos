"use client"

import React, { useContext } from "react"
import { useRouter } from "next/navigation"
import { AuthContext } from "@/contexts/auth-context"
import { useLessonPlayer } from "@/hooks/curso/use-lesson-player"

import { LessonHeader } from "./_components/lesson-header"
import { LessonSidebar } from "./_components/lesson-sidebar"
import { VideoPlayer } from "./_components/video-player"

export default function LessonPlayerPage({ params }: { params: Promise<{ id: string; aulaId: string }> }) {
  const { user, loading: authLoading } = useContext(AuthContext)
  const router = useRouter()
  const resolvedParams = React.use(params)

  const trainingId = Number(resolvedParams.id)
  const currentLessonId = Number(resolvedParams.aulaId)

  const {
    lesson,
    nextLesson,
    currentModule,
    lessonsInModule,
    currentLessonIndex,
    completedLessons,
    quizDone,
    moduleFinished,
    isLoading,
    markAsCompleted,
    isAdmin // Extraído do Hook reescrito
  } = useLessonPlayer({ userId: user?.id, trainingId, currentLessonId })

  if (authLoading || isLoading) return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-t-transparent" />
    </div>
  )

  return (
    <div className="flex flex-col bg-background lg:h-screen lg:overflow-hidden">
      <LessonHeader
        trainingId={trainingId}
        moduleTitle={currentModule?.titulo}
        lessonTitle={lesson?.titulo}
        isAdmin={isAdmin}
      />

      <div className="flex flex-1 flex-col lg:flex-row lg:overflow-hidden">
        <main className="custom-scrollbar flex-1 bg-black lg:overflow-y-auto lg:bg-background">
          {/* VIDEO CONTAINER */}
          <div className="sticky top-16 z-10 aspect-video w-full bg-black lg:relative lg:top-0">
            {lesson?.video_url && (
              <VideoPlayer
                videoUrl={lesson.video_url}
                onComplete={() => markAsCompleted()}
                nextLessonId={nextLesson?.id}
                onNext={(id) => router.push(`/colaborador/treinamentos/${trainingId}/aula/${id}`)}
                onQuiz={() => router.push(`/colaborador/treinamentos/${trainingId}/quiz/${currentModule?.id}`)}
                isLastInModule={currentLessonIndex === lessonsInModule.length - 1}
                quizDone={quizDone}
                isAdmin={isAdmin} // Repassando para o Player
              />
            )}
          </div>

          {/* CONTENT */}
          <div className="mx-auto max-w-4xl space-y-6 p-10 lg:p-16">
            <div className="flex flex-col gap-2">
              {isAdmin && (
                <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
                  Visualização de Administrador
                </span>
              )}
              <h1 className="text-3xl font-black tracking-tighter uppercase italic lg:text-5xl">
                {lesson?.titulo}
              </h1>
            </div>
            <div className="h-px w-full bg-border" />
            <p className="leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {lesson?.descricao}
            </p>
          </div>
        </main>

        <LessonSidebar
          trainingId={trainingId}
          currentLessonId={currentLessonId}
          lessons={lessonsInModule}
          completedLessons={completedLessons}
          moduleFinished={moduleFinished}
          moduleId={currentModule?.id}
          quizDone={quizDone}
          isAdmin={isAdmin} // Repassando para a Sidebar
        />
      </div>
    </div>
  )
}