import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AiAgentPage from './pages/AiAgentPage'
import AgreementDetailPage from './pages/AgreementDetailPage'
import AgreementPreviewPage from './pages/AgreementPreviewPage'
import BuyerConfirmationPage from './pages/BuyerConfirmationPage'
import CreateAgreementPage from './pages/CreateAgreementPage'
import DashboardPage from './pages/DashboardPage'
import FollowUpQuestionsPage from './pages/FollowUpQuestionsPage'
import LoginPage from './pages/LoginPage'
import ManualEntryPage from './pages/ManualEntryPage'
import ProcessingScreen from './pages/ProcessingScreen'
import ProfilePage from './pages/ProfilePage'
import RecordVoicePage from './pages/RecordVoicePage'
import ShareAgreementPage from './pages/ShareAgreementPage'
import SignupPage from './pages/SignupPage'
import TranscriptReviewScreen from './pages/TranscriptReviewScreen'
import UploadAudioPage from './pages/UploadAudioPage'
import WelcomePage from './pages/WelcomePage'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public routes ──────────────────────────────────────────────── */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/*
         * Buyer confirmation — public, no login required.
         * Route param changed from :agreementLink → :shareToken to match
         * the backend's Agreement.shareToken field.
         */}
        <Route path="/confirm/:shareToken" element={<BuyerConfirmationPage />} />

        {/* ── Private routes (JWT required) ─────────────────────────────── */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/ai-agent" element={<ProtectedRoute><AiAgentPage /></ProtectedRoute>} />
        <Route path="/create-agreement" element={<ProtectedRoute><CreateAgreementPage /></ProtectedRoute>} />
        <Route path="/record-voice" element={<ProtectedRoute><RecordVoicePage /></ProtectedRoute>} />
        <Route path="/upload-audio" element={<ProtectedRoute><UploadAudioPage /></ProtectedRoute>} />
        <Route path="/manual-entry" element={<ProtectedRoute><ManualEntryPage /></ProtectedRoute>} />
        <Route path="/processing" element={<ProtectedRoute><ProcessingScreen /></ProtectedRoute>} />
        <Route path="/transcript-review" element={<ProtectedRoute><TranscriptReviewScreen /></ProtectedRoute>} />
        <Route path="/followup-questions" element={<ProtectedRoute><FollowUpQuestionsPage /></ProtectedRoute>} />
        <Route path="/agreement-preview" element={<ProtectedRoute><AgreementPreviewPage /></ProtectedRoute>} />
        <Route path="/share-agreement" element={<ProtectedRoute><ShareAgreementPage /></ProtectedRoute>} />
        <Route path="/agreement/:id" element={<ProtectedRoute><AgreementDetailPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
