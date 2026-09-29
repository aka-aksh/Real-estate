import type { Lead } from "@/types/lead";

/**
 * 5 sample leads with pre-baked analysis + scores.
 * Clearly marked isSample: true.
 * Covers: hot buyer, warm buyer, cold browser, Hinglish, contradictory budget.
 */
export const seedLeads: Lead[] = [
  // 1. Hot buyer — immediate, clear budget fits, site visit requested
  {
    id: "seed-001-hot-buyer",
    createdAt: "2026-09-25T10:00:00+05:30",
    isSample: true,
    form: {
      name: "Priya Sharma",
      location: "Bandra West, Mumbai",
      requirement: "3 BHK with sea view, min 1500 sqft",
      budget: "2.5 Cr",
      timeline: "This month",
      message:
        "Hi, I've been looking at your project for a while. I need a 3 BHK with a sea-facing balcony. My budget is around 2.5 crore and I want to close this month itself. Can we schedule a site visit this weekend? I already have loan pre-approval from HDFC.",
    },
    analysis: {
      lead_summary:
        "Serious buyer with clear requirements, pre-approved financing, and immediate timeline. Wants a premium 3 BHK unit with sea view.",
      customer_intent: "buy",
      key_requirements: ["3 BHK", "Sea view", "Min 1500 sqft", "Balcony"],
      objections: [],
      missing_info: ["Preferred floor", "Parking requirements"],
      recommended_next_action:
        "Schedule site visit this weekend and prepare 3 BHK sea-facing inventory",
      suggested_response:
        "Hi Priya! Great to hear from you. We have excellent 3 BHK sea-facing units available. I'd love to schedule a site visit this weekend — would Saturday 11 AM or Sunday 10 AM work better for you? I'll keep the relevant floor plans ready.",
      signals: {
        timeline_urgency: "immediate",
        budget_clarity: "clear",
        budget_fit: "fits",
        requirement_clarity: "clear",
        action_requests: ["site_visit"],
        financing_readiness: "ready",
        objections_severity: "none",
      },
      provider: "gemini",
    },
    score: {
      value: 95,
      label: "Hot",
      reasons: [
        "Immediate timeline — high urgency",
        "Budget fits project range",
        "Requested site visit — strong buying signal",
        "Financing ready",
      ],
    },
    status: "New",
    chat: [],
  },

  // 2. Warm buyer — within month, partial requirements
  {
    id: "seed-002-warm-buyer",
    createdAt: "2026-09-24T14:30:00+05:30",
    isSample: true,
    form: {
      name: "Rajesh Patel",
      location: "Andheri East",
      requirement: "2 or 3 BHK for family",
      budget: "1.2 Cr",
      timeline: "Next 2-3 weeks",
      message:
        "We are a family of 4 looking for a good flat. Preferably 2 or 3 BHK. Budget around 1.2 crore. We want good schools nearby. Can you send brochure and pricing?",
    },
    analysis: {
      lead_summary:
        "Family buyer with moderate budget, comparing options. Interested but still in research phase with partial requirements.",
      customer_intent: "buy",
      key_requirements: [
        "2 or 3 BHK",
        "Family-friendly",
        "Good schools nearby",
      ],
      objections: [],
      missing_info: ["Preferred floor", "Carpet area preference", "Parking needs"],
      recommended_next_action:
        "Send brochure and pricing, then follow up to narrow down BHK preference",
      suggested_response:
        "Hello Rajesh! Thank you for your interest. I'm sharing our brochure and pricing details. We have both 2 BHK and 3 BHK options. There are several reputed schools within 2 km. May I know if you have a preference for a specific floor or carpet area?",
      signals: {
        timeline_urgency: "within_month",
        budget_clarity: "clear",
        budget_fit: "fits",
        requirement_clarity: "partial",
        action_requests: ["brochure", "pricing"],
        financing_readiness: "unknown",
        objections_severity: "none",
      },
      provider: "gemini",
    },
    score: {
      value: 56,
      label: "Warm",
      reasons: [
        "Looking within a month",
        "Budget fits project range",
        "Requirements partially clear — ask follow-up",
      ],
    },
    status: "New",
    chat: [],
  },

  // 3. Cold browser — vague everything, just looking
  {
    id: "seed-003-cold-browser",
    createdAt: "2026-09-23T09:15:00+05:30",
    isSample: true,
    form: {
      name: "Amit Verma",
      location: "Mumbai",
      requirement: "Something nice",
      budget: "flexible",
      timeline: "No hurry",
      message: "Just checking options. Send me details.",
    },
    analysis: {
      lead_summary:
        "Very early-stage inquiry with no specific requirements, budget, or timeline. Appears to be casually browsing.",
      customer_intent: "unknown",
      key_requirements: [],
      objections: [],
      missing_info: [
        "BHK preference",
        "Budget range",
        "Timeline",
        "Location preference",
        "Purpose (buy/rent/invest)",
      ],
      recommended_next_action:
        "Send project highlights and ask qualifying questions about budget, BHK, and timeline",
      suggested_response:
        "Hi Amit! Thanks for reaching out. I'd love to help you find the right option. Could you share what type of flat you're looking for (1/2/3 BHK), your approximate budget, and when you're planning to move? This will help me suggest the best units for you.",
      signals: {
        timeline_urgency: "unknown",
        budget_clarity: "unknown",
        budget_fit: "unknown",
        requirement_clarity: "vague",
        action_requests: ["none"],
        financing_readiness: "unknown",
        objections_severity: "none",
      },
      provider: "groq",
    },
    score: {
      value: 4,
      label: "Cold",
      reasons: ["Requirements are vague", "Limited information available"],
    },
    status: "New",
    chat: [],
  },

  // 4. Hinglish lead — warm, needs loan
  {
    id: "seed-004-hinglish",
    createdAt: "2026-09-22T16:45:00+05:30",
    isSample: true,
    form: {
      name: "Suresh Kumar",
      location: "Thane",
      requirement: "2 BHK, ground floor if possible",
      budget: "90L",
      timeline: "Jaldi chahiye",
      message:
        "Bhai mujhe 2 BHK chahiye ground floor pe. Budget 90 lakh hai. Loan lena padega. Kal site visit ho sakta hai kya? Mummy ke liye lift nahi chahiye isliye ground floor. Jaldi finalise karna hai.",
    },
    analysis: {
      lead_summary:
        "Urgent Hinglish buyer looking for a 2 BHK ground floor for his mother. Needs a home loan. Wants to visit tomorrow and finalize quickly.",
      customer_intent: "buy",
      key_requirements: [
        "2 BHK",
        "Ground floor",
        "No lift dependency (for mother)",
      ],
      objections: [],
      missing_info: ["Exact carpet area preference", "Loan pre-approval status"],
      recommended_next_action:
        "Schedule site visit for tomorrow and share ground floor availability with loan assistance details",
      suggested_response:
        "Suresh bhai, bilkul! Hamare paas ground floor 2 BHK available hai. Kal site visit arrange kar deta hoon — subah 10 baje chalega? Loan ke liye bhi humara tie-up hai, main details share kar dunga. Aapki mummy ke liye perfect hoga.",
      signals: {
        timeline_urgency: "immediate",
        budget_clarity: "clear",
        budget_fit: "fits",
        requirement_clarity: "clear",
        action_requests: ["site_visit"],
        financing_readiness: "needs_loan",
        objections_severity: "none",
      },
      provider: "gemini",
    },
    score: {
      value: 84,
      label: "Hot",
      reasons: [
        "Immediate timeline — high urgency",
        "Budget fits project range",
        "Requested site visit — strong buying signal",
      ],
    },
    status: "New",
    chat: [],
  },

  // 5. Contradictory budget — form says 60L, message says 1.5 Cr
  {
    id: "seed-005-contradictory",
    createdAt: "2026-09-21T11:20:00+05:30",
    isSample: true,
    form: {
      name: "Meena Iyer",
      location: "Powai",
      requirement: "3 BHK with parking",
      budget: "60L",
      timeline: "3 months",
      message:
        "I want a 3 BHK in your project. My husband and I have saved around 1.5 crore for this. We need 2 parking spots. Also worried about construction quality — saw some complaints online. Please share RERA details.",
    },
    analysis: {
      lead_summary:
        "Interested buyer with contradictory budget (form: 60L vs message: 1.5 Cr). Has quality concerns from online reviews. Wants RERA details and parking.",
      customer_intent: "buy",
      key_requirements: ["3 BHK", "2 parking spots", "RERA details"],
      objections: ["Construction quality concerns from online complaints"],
      missing_info: ["Clarify actual budget (60L or 1.5 Cr)", "Preferred floor"],
      recommended_next_action:
        "Clarify budget discrepancy, share RERA certificate, and address quality concerns with evidence",
      suggested_response:
        "Hi Meena! Thank you for your interest. I noticed your budget — could you confirm if it's around 60 lakh or 1.5 crore? This will help me suggest the right units. Regarding quality, I'd love to share our RERA registration and take you for a site visit so you can see the construction firsthand. We have 3 BHK units with 2 parking spots available.",
      signals: {
        timeline_urgency: "1_to_3_months",
        budget_clarity: "vague",
        budget_fit: "unknown",
        requirement_clarity: "clear",
        action_requests: ["none"],
        financing_readiness: "unknown",
        objections_severity: "minor",
      },
      provider: "groq",
    },
    score: {
      value: 42,
      label: "Warm",
      reasons: [
        "Timeline is 1-3 months out",
        "Budget is vague — needs qualification",
        "Requirements partially clear — ask follow-up",
      ],
    },
    status: "New",
    chat: [],
  },
];
