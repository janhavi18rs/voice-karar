const AGREEMENTS_KEY = 'voicekarar-agreements'
const USER_KEY = 'voicekarar-user'

const mockAgreements = [
  {
    id: 'agr-101',
    ownerName: 'Asha Mehta',
    otherPartyName: 'Rajat Traders',
    product: 'Cotton bags',
    quantity: 500,
    price: 1800,
    deliveryDate: '2026-08-10',
    paymentTerms: '50% advance, 50% on delivery',
    specialConditions: 'Bulk packing with company logo',
    status: 'confirmed',
    createdAt: '2026-07-08',
    agreementLink: 'https://voicekarar.in/agr-101',
    source: 'live',
    transcriptId: 'tx-1'
  },
  {
    id: 'agr-102',
    ownerName: 'Asha Mehta',
    otherPartyName: 'Kiran Motors',
    product: 'Spare parts kit',
    quantity: 12,
    price: 42000,
    deliveryDate: '2026-07-24',
    paymentTerms: 'Net 7 days',
    specialConditions: 'Warranty for 3 months',
    status: 'pending',
    createdAt: '2026-07-12',
    agreementLink: 'https://voicekarar.in/agr-102',
    source: 'upload',
    transcriptId: 'tx-2'
  },
  {
    id: 'agr-103',
    ownerName: 'Asha Mehta',
    otherPartyName: 'Sanjay Fabrics',
    product: 'Cotton shirts',
    quantity: 500,
    price: 120,
    deliveryDate: '2026-07-25',
    paymentTerms: '50% advance',
    specialConditions: 'Packed in branded cartons',
    status: 'needs-changes',
    createdAt: '2026-07-15',
    agreementLink: 'https://voicekarar.in/agr-103',
    source: 'manual',
    transcriptId: null
  }
]

const defaultUser = {
  name: 'Asha Mehta',
  businessName: 'Mehta Traders',
  email: 'asha@mehta.co',
  mobile: '+919876543210',
  businessType: 'Trader',
  businessCategory: 'Textiles',
  preferredLanguage: 'Hindi',
  avatarUrl: '',
  memberSince: '2024-01-12',
  totalAgreements: 3
}

const readStoredAgreements = () => {
  if (typeof window === 'undefined') return mockAgreements

  try {
    const saved = window.localStorage.getItem(AGREEMENTS_KEY)
    return saved ? JSON.parse(saved) : mockAgreements
  } catch {
    return mockAgreements
  }
}

const writeStoredAgreements = (agreements) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(AGREEMENTS_KEY, JSON.stringify(agreements))
}

const readStoredUser = () => {
  if (typeof window === 'undefined') return defaultUser

  try {
    const saved = window.localStorage.getItem(USER_KEY)
    return saved ? JSON.parse(saved) : defaultUser
  } catch {
    return defaultUser
  }
}

const writeStoredUser = (user) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const getAgreements = async () => Promise.resolve(readStoredAgreements())

export const createAgreement = async (payload) => {
  const agreement = {
    ...payload,
    id: payload.id || `agr-${Date.now()}`,
    status: 'draft',
    createdAt: new Date().toISOString().split('T')[0],
    agreementLink: `${typeof window !== 'undefined' ? window.location.origin : 'https://voicekarar.in'}/confirm/${payload.id || `agr-${Date.now()}`}`,
    source: payload.source || 'manual',
    transcriptId: payload.transcriptId || null
  }

  const agreements = [...readStoredAgreements(), agreement]
  writeStoredAgreements(agreements)
  return Promise.resolve(agreement)
}

export const confirmAgreement = async (id, action, note = '') => {
  const agreements = readStoredAgreements().map((agreement) => {
    if (agreement.id !== id) return agreement
    return {
      ...agreement,
      status: action === 'accept' ? 'confirmed' : action === 'reject' ? 'rejected' : 'needs-changes',
      note
    }
  })

  writeStoredAgreements(agreements)

  return Promise.resolve({
    id,
    action,
    note,
    status: action === 'accept' ? 'confirmed' : action === 'reject' ? 'rejected' : 'needs-changes'
  })
}

export const getAgreementById = async (id) => Promise.resolve(readStoredAgreements().find((item) => item.id === id) || null)

export const signupUser = async (formData) => {
  const user = {
    ...defaultUser,
    ...formData,
    memberSince: new Date().toISOString().split('T')[0],
    totalAgreements: 3
  }
  writeStoredUser(user)
  return Promise.resolve({ ok: true, user })
}

export const getCurrentUser = async () => Promise.resolve(readStoredUser())

export const updateProfile = async (formData) => {
  const updatedUser = { ...readStoredUser(), ...formData }
  writeStoredUser(updatedUser)
  return Promise.resolve(updatedUser)
}

export const submitManualEntry = async (text) => {
  const extractedFields = {
    supplierName: 'Ramesh Textiles',
    product: 'Cotton shirts',
    quantity: 500,
    price: '₹120 each',
    deliveryDate: '25 July',
    paymentTerms: '50% advance',
    specialConditions: 'Packed in branded cartons'
  }
  const missingFields = ['deliveryDate', 'paymentTerms', 'specialConditions']
  return Promise.resolve({ extractedFields, missingFields })
}

export const submitFollowUpAnswers = async (answers) => {
  const current = readStoredAgreements()
  const agreement = {
    id: `agr-${Date.now()}`,
    ownerName: readStoredUser().name,
    otherPartyName: 'Ramesh Textiles',
    product: 'Cotton shirts',
    quantity: 500,
    price: 120,
    deliveryDate: answers.deliveryDate || '25 July',
    paymentTerms: answers.paymentTerms || '50% advance',
    specialConditions: answers.specialConditions || 'Packed in branded cartons',
    status: 'pending',
    createdAt: new Date().toISOString().split('T')[0],
    agreementLink: `${typeof window !== 'undefined' ? window.location.origin : 'https://voicekarar.in'}/confirm/agr-${Date.now()}`,
    source: 'manual',
    transcriptId: null
  }
  writeStoredAgreements([agreement, ...current])
  return Promise.resolve({ ok: true, agreement })
}

export const uploadCallRecording = async (fileOrBlob) => {
  const transcriptId = `tx-${Date.now()}`
  const estimatedProcessingSeconds = 8 + Math.min(60, Math.round((fileOrBlob.size || 0) / (1024 * 1024)))
  const transcripts = JSON.parse(typeof window !== 'undefined' ? window.localStorage.getItem('vk-transcripts') || '{}' : '{}')
  transcripts[transcriptId] = { text: 'Transcription in progress... (mock)', highlights: [] }
  if (typeof window !== 'undefined') window.localStorage.setItem('vk-transcripts', JSON.stringify(transcripts))
  return Promise.resolve({ transcriptId, estimatedProcessingSeconds })
}

export const getTranscript = async (transcriptId) => {
  const transcripts = JSON.parse(typeof window !== 'undefined' ? window.localStorage.getItem('vk-transcripts') || '{}' : '{}')
  if (transcripts[transcriptId]) return Promise.resolve(transcripts[transcriptId])
  const text = 'Buyer: I agree to buy 500 cotton bags at ₹1800 to be delivered on 10 August. Seller: agreed.'
  const highlights = [
    { text: '500', type: 'quantity', startIndex: text.indexOf('500'), endIndex: text.indexOf('500') + 3 },
    { text: '₹1800', type: 'price', startIndex: text.indexOf('₹1800'), endIndex: text.indexOf('₹1800') + 5 }
  ]
  return Promise.resolve({ text, highlights })
}

export const updateTranscript = async (transcriptId, correctedText) => {
  const transcripts = JSON.parse(typeof window !== 'undefined' ? window.localStorage.getItem('vk-transcripts') || '{}' : '{}')
  transcripts[transcriptId] = { text: correctedText, highlights: [] }
  if (typeof window !== 'undefined') window.localStorage.setItem('vk-transcripts', JSON.stringify(transcripts))
  return Promise.resolve({ transcriptId })
}
