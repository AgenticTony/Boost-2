import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ErrorBoundary } from './components/ErrorBoundary'
import Header from './components/Header'
import Login from './pages/login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import VerifyEmail from './pages/VerifyEmail'
import Library from './pages/Library'
import ExerciseDetail from './pages/ExerciseDetail'
import { Resources } from './pages/Resources'
import { HandbookReader } from './pages/HandbookReader'
import { KnowledgeSection } from './pages/KnowledgeSection'
import AdminApprovals from './pages/AdminApprovals'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Header />
        <main>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/" element={<ProtectedRoute><Library /></ProtectedRoute>} />
            <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
            <Route path="/exercise/:id" element={<ProtectedRoute><ExerciseDetail /></ProtectedRoute>} />
            <Route path="/exercises" element={<ProtectedRoute><ExerciseDetail /></ProtectedRoute>} />
            <Route path="/handbook" element={<ProtectedRoute><HandbookReader /></ProtectedRoute>} />
            <Route path="/knowledge" element={<ProtectedRoute><KnowledgeSection /></ProtectedRoute>} />
            <Route path="/admin/approvals" element={<ProtectedRoute><AdminApprovals /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
