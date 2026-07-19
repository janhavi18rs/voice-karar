/**
 * frontend/src/services/api.js
 *
 * Real Axios HTTP client for the Voice Karar backend.
 *
 * Architecture rule:
 *   Frontend → Backend only.
 *   Never call the AI Agent (port 5001) directly from here.
 *
 * Auth:
 *   JWT is stored in localStorage under 'vk-token'.
 *   The request interceptor attaches it as "Authorization: Bearer <token>".
 */

import axios from 'axios'

// ─── Axios Instance ────────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000, // 60 s — AI calls can be slow
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vk-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Global response error handler — surfaces clear messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearSession()
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

// ─── Token / Session Helpers ────────────────────────────────────────────────────

export const saveSession = (token, user) => {
  localStorage.setItem('vk-token', token)
  localStorage.setItem('vk-user', JSON.stringify(user))
}

export const clearSession = () => {
  localStorage.removeItem('vk-token')
  localStorage.removeItem('vk-user')
}

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('vk-user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const isAuthenticated = () => !!localStorage.getItem('vk-token')

export const getCurrentUser = async () => getStoredUser()

export const updateProfile = async (updates) => {
  const updatedUser = { ...getStoredUser(), ...updates }
  localStorage.setItem('vk-user', JSON.stringify(updatedUser))
  return updatedUser
}

// ─── Auth ──────────────────────────────────────────────────────────────────────

/**
 * Register a new user.
 * POST /api/v1/auth/register
 * Body: { name, businessName, mobile, email, password, businessType?, businessCategory?, preferredLanguage? }
 * Returns: { user, token }
 */
export const register = async ({
  name,
  businessName,
  mobile,
  email,
  password,
  businessType,
  businessCategory,
  preferredLanguage,
}) => {
  const { data } = await api.post('/auth/register', {
    name,
    businessName,
    mobile,
    email,
    password,
    businessType,
    businessCategory,
    preferredLanguage,
  })
  // Backend wraps in ApiResponse: { statusCode, data, message }
  const payload = data.data
  saveSession(payload.token, payload.user)
  return payload
}

/**
 * Log in an existing user.
 * POST /api/v1/auth/login
 * Body: { email, password }
 * Returns: { user, token }
 */
export const login = async ({ email, password }) => {
  const { data } = await api.post('/auth/login', { email, password })
  const payload = data.data
  saveSession(payload.token, payload.user)
  return payload
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

/**
 * Fetch dashboard statistics and recent agreements.
 * GET /api/v1/dashboard
 * Returns: { stats: { total, pending, confirmed, needsChanges, cancelled }, recentAgreements }
 */
export const getDashboard = async () => {
  const { data } = await api.get('/dashboard')
  return data.data
}

// ─── Agreements ───────────────────────────────────────────────────────────────

/**
 * List all agreements for the logged-in user.
 * GET /api/v1/agreements?status=pending&page=1&limit=10
 */
export const getAgreements = async (params = {}) => {
  const { data } = await api.get('/agreements', { params })
  return data.data // { agreements, total, page, totalPages }
}

/**
 * Get a single agreement by its MongoDB _id.
 * GET /api/v1/agreements/:id
 */
export const getAgreementById = async (id) => {
  const { data } = await api.get(`/agreements/${id}`)
  return data.data.agreement
}

/**
 * Get a shared agreement by its shareToken (public — no auth required).
 * GET /api/v1/agreements/share/:shareToken
 */
export const getAgreementByShareToken = async (shareToken) => {
  const { data } = await api.get(`/agreements/share/${shareToken}`)
  return data.data.agreement
}

/**
 * Update agreed terms of a pending agreement.
 * PATCH /api/v1/agreements/:id
 * Body: { agreedTerms?, title? }
 */
export const updateAgreement = async (id, updates) => {
  const { data } = await api.patch(`/agreements/${id}`, updates)
  return data.data.agreement
}

/**
 * Cancel an agreement.
 * PATCH /api/v1/agreements/:id/cancel
 */
export const cancelAgreement = async (id, note = '') => {
  const { data } = await api.patch(`/agreements/${id}/cancel`, { note })
  return data.data.agreement
}

// ─── AI / Generate Agreement ──────────────────────────────────────────────────

/**
 * Send audio or text to the backend for AI extraction and agreement creation.
 *
 * POST /api/v1/ai/generate
 *
 * For voice / audio:
 *   { audio: <base64 string>, audioMimeType: 'audio/webm', source: 'live'|'upload', outputLanguage: 'English' }
 *
 * For manual text:
 *   { transcript: <string>, source: 'manual', outputLanguage: 'English' }
 *
 * Returns:
 *   { ai, agreement, draft }
 *   where draft = { id, supplierName, product, quantity, price, deliveryDate, paymentTerms,
 *                   specialConditions, status, agreementLink, shareToken, agreementText, missingFields }
 */
export const generateAgreement = async ({ audio, audioMimeType, transcript, source, outputLanguage = 'English' }) => {
  const { data } = await api.post('/ai/generate', {
    audio,
    audioMimeType,
    transcript,
    source,
    outputLanguage,
  })
  return data.data // { ai, agreement, draft }
}

export const getTranscript = async (transcriptId) => {
  try {
    const transcripts = JSON.parse(localStorage.getItem('vk-transcripts') || '{}')
    return transcripts[transcriptId] || { text: '', highlights: [] }
  } catch {
    return { text: '', highlights: [] }
  }
}

export const updateTranscript = async (transcriptId, correctedText) => {
  const transcripts = JSON.parse(localStorage.getItem('vk-transcripts') || '{}')
  transcripts[transcriptId] = {
    ...(transcripts[transcriptId] || {}),
    text: correctedText,
    highlights: [],
  }
  localStorage.setItem('vk-transcripts', JSON.stringify(transcripts))
  return { transcriptId }
}

// ─── Confirmations (Public — no auth required) ────────────────────────────────

/**
 * Accept an agreement as the counterparty.
 * POST /api/v1/confirmations/accept
 * Body: { agreementId, email, signatureText }
 */
export const acceptAgreement = async ({ agreementId, email, signatureText }) => {
  const { data } = await api.post('/confirmations/accept', {
    agreementId,
    email,
    signatureText,
  })
  return data.data
}

/**
 * Request changes on an agreement as the counterparty.
 * POST /api/v1/confirmations/request-changes
 * Body: { agreementId, email, note }
 */
export const requestChanges = async ({ agreementId, email, note }) => {
  const { data } = await api.post('/confirmations/request-changes', {
    agreementId,
    email,
    note,
  })
  return data.data
}

export default api
