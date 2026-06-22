import { createFileRoute } from '@tanstack/react-router'
import Submission from '../../../components/Submission'

export const Route = createFileRoute('/_app/_protected/submission')({
    component: Submission,
})
