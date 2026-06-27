import Submission from '@/features/article/Submission'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/_protected/submission')({
    component: Submission,
})
