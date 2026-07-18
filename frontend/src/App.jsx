import { BrowserRouter, Route, Routes } from 'react-router-dom'
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
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/create-agreement" element={<CreateAgreementPage />} />
        <Route path="/record-voice" element={<RecordVoicePage />} />
        <Route path="/upload-audio" element={<UploadAudioPage />} />
        <Route path="/manual-entry" element={<ManualEntryPage />} />
        <Route path="/processing" element={<ProcessingScreen />} />
        <Route path="/transcript-review" element={<TranscriptReviewScreen />} />
        <Route path="/followup-questions" element={<FollowUpQuestionsPage />} />
        <Route path="/agreement-preview" element={<AgreementPreviewPage />} />
        <Route path="/share-agreement" element={<ShareAgreementPage />} />
        <Route path="/agreement/:id" element={<AgreementDetailPage />} />
        <Route path="/confirm/:agreementLink" element={<BuyerConfirmationPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
