import mongoose from 'mongoose';

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

/**
 * AgreedTerms
 * Structured business terms extracted by the AI module.
 * The backend receives this object already populated — it does NOT perform extraction.
 *
 * All fields are optional at schema level because:
 *  - The AI may ask follow-up questions across multiple turns
 *  - The frontend sends partial data first, then fills gaps after AI follow-ups
 *  - Hard validation of "all fields present" happens in the service layer
 */
const agreedTermsSchema = new mongoose.Schema(
  {
    /** The product / service being traded e.g. "Cotton Shirts" */
    product: {
      type: String,
      trim: true,
    },

    /** Quantity agreed e.g. 500 */
    quantity: {
      type: Number,
      min: [0, 'Quantity cannot be negative'],
    },

    /** Unit — e.g. "pieces", "kg", "boxes" */
    unit: {
      type: String,
      trim: true,
    },

    /** Price per unit in INR e.g. 120 */
    pricePerUnit: {
      type: Number,
      min: [0, 'Price cannot be negative'],
    },

    /** Total amount = quantity × pricePerUnit (computed or AI-provided) */
    totalAmount: {
      type: Number,
      min: [0, 'Total amount cannot be negative'],
    },

    /** Agreed delivery date as AI parsed it e.g. "25th July 2026" */
    deliveryDate: {
      type: Date,
    },

    /**
     * Payment terms as a free-text string.
     * Examples: "50% advance, 50% on delivery"
     *           "Net 30 days"
     *           "Full payment before dispatch"
     */
    paymentTerms: {
      type: String,
      trim: true,
    },

    /** Any additional conditions mentioned in the voice summary */
    specialConditions: {
      type: String,
      trim: true,
      default: '',
    },

    /** Delivery location e.g. "Ramesh Traders Warehouse, Mumbai" */
    deliveryLocation: {
      type: String,
      trim: true,
      default: '',
    },

    /** AI summary of the agreement */
    summary: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: false } // embedded sub-doc, no separate _id needed
);

// ─────────────────────────────────────────────────────────────────────────────

/**
 * CounterParty
 * The OTHER business owner who will receive the share link to confirm.
 * They may or may not be a registered Voice Karar user.
 */
const counterPartySchema = new mongoose.Schema(
  {
    /** Name as mentioned in the voice summary or manually entered */
    name: {
      type: String,
      trim: true,
    },

    /** Email where the share link will be sent */
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    /** Optional phone number (WhatsApp sharing use case) */
    phone: {
      type: String,
      trim: true,
    },

    /**
     * Their role in the deal.
     * 'supplier' = they are selling / delivering
     * 'buyer'    = they are purchasing
     * 'other'    = unspecified
     */
    role: {
      type: String,
      enum: ['supplier', 'buyer', 'other'],
      default: 'other',
    },
  },
  { _id: false }
);

// ─────────────────────────────────────────────────────────────────────────────

/**
 * HistoryEntry
 * Immutable audit trail — every status change or edit is appended here.
 * Never update existing history entries, only push new ones.
 */
const historyEntrySchema = new mongoose.Schema(
  {
    /**
     * What happened.
     * 'created'          – agreement first saved
     * 'updated'          – terms edited by creator
     * 'share_link_sent'  – creator sent the link
     * 'viewed'           – counter-party opened the link
     * 'confirmed'        – counter-party accepted
     * 'needs_changes'    – counter-party requested modifications
     * 'cancelled'        – creator cancelled the agreement
     * 'reopened'         – creator re-opened after cancellation
     */
    action: {
      type: String,
      required: true,
      enum: [
        'created',
        'updated',
        'share_link_sent',
        'viewed',
        'confirmed',
        'needs_changes',
        'cancelled',
        'reopened',
      ],
    },

    /** Human-readable note explaining what changed and why */
    note: {
      type: String,
      trim: true,
      default: '',
    },

    /** Who performed the action — userId string or email of counter-party */
    performedBy: {
      type: String,
      required: true,
    },

    /** IP address of the counter-party when they confirm (for basic audit) */
    ipAddress: {
      type: String,
    },

    /** When this event happened */
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// ─── Main Agreement Schema ────────────────────────────────────────────────────

const agreementSchema = new mongoose.Schema(
  {
    // ── Identity ────────────────────────────────────────────────────────────

    /** Short human-readable title — either AI-generated or user-provided */
    title: {
      type: String,
      required: [true, 'Agreement title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },

    /** The logged-in user who recorded the voice summary */
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
      index: true, // frequently queried for dashboard
    },

    // ── AI Data ─────────────────────────────────────────────────────────────

    /**
     * Raw transcript text returned by Whisper / AI module.
     * Stored for reference and potential re-processing.
     */
    rawTranscript: {
      type: String,
      trim: true,
    },

    /**
     * The complete structured JSON object returned by the Gemini AI module.
     * Stored as-is so we can always trace back what the AI originally extracted.
     * Mixed type to accommodate any shape the AI returns.
     */
    aiExtractedData: {
      type: mongoose.Schema.Types.Mixed,
    },

    // ── Business Terms ───────────────────────────────────────────────────────

    /** Structured terms extracted / confirmed by AI */
    agreedTerms: {
      type: agreedTermsSchema,
      required: [true, 'Agreed terms are required'],
    },

    /** The other party receiving the agreement link */
    counterParty: {
      type: counterPartySchema,
    },

    // ── Sharing ──────────────────────────────────────────────────────────────

    /**
     * Unique random token used to build the public share URL.
     * Generated by generateShareId() util — 24 hex characters (12 random bytes).
     * Example URL: https://voicekarar.app/share/a82hd73f9c1b2e3d
     */
    shareToken: {
      type: String,
      required: true,
      unique: true,
      index: true, // heavily queried via /share/:token route
    },

    // ── Lifecycle ────────────────────────────────────────────────────────────

    /**
     * Agreement lifecycle status.
     *
     * pending       → created, link not yet acted on
     * confirmed     → counter-party accepted all terms
     * needs_changes → counter-party requested modifications
     * cancelled     → creator cancelled before confirmation
     */
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'needs_changes', 'cancelled'],
      default: 'pending',
      index: true, // dashboard filters by status
    },

    /**
     * Optional message from counter-party when they request changes.
     * Populated only when status === 'needs_changes'.
     */
    counterPartyNote: {
      type: String,
      trim: true,
    },

    /** Timestamp when counter-party last confirmed or responded */
    respondedAt: {
      type: Date,
    },

    // ── Audit Trail ──────────────────────────────────────────────────────────

    /**
     * Append-only history log.
     * Every mutation to the agreement pushes a new entry here.
     * Entries are NEVER deleted or updated — only appended.
     */
    history: {
      type: [historyEntrySchema],
      default: [],
    },
  },
  {
    // Automatically manage createdAt and updatedAt
    timestamps: true,

    // Make toJSON() use our global transform (defined in db.js):
    // _id → id, strips __v
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Virtuals ─────────────────────────────────────────────────────────────────

/**
 * shareUrl virtual
 * Builds the full public link on-the-fly from config.
 * Not stored in DB — always derived from shareToken.
 *
 * NOTE: We import config lazily inside the virtual to avoid circular
 * import issues at module load time.
 */
agreementSchema.virtual('shareUrl').get(function () {
  // Dynamic import would be async; use process.env directly in virtuals
  const base = process.env.APP_BASE_URL || 'http://localhost:5000';
  return `${base}/share/${this.shareToken}`;
});

// ─── Indexes ──────────────────────────────────────────────────────────────────

/**
 * Compound index for the dashboard query pattern:
 *   Agreement.find({ creator: userId }).sort({ createdAt: -1 })
 * This makes the most common query (load user's agreements newest first) fast.
 */
agreementSchema.index({ creator: 1, createdAt: -1 });

/**
 * Compound index to support status-filtered dashboard views:
 *   Agreement.find({ creator: userId, status: 'pending' })
 */
agreementSchema.index({ creator: 1, status: 1 });

// ─── Model ────────────────────────────────────────────────────────────────────

const Agreement = mongoose.model('Agreement', agreementSchema);

export default Agreement;
