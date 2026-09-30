const enText = {
  dashboard: "Dashboard", today: "Today", leadInbox: "Lead inbox", openDatabase: "Open leads database",
  addLead: "Add a lead", headline: "Your leads. Ranked. Actionable.", heroSupport: "Know who needs attention and what to do next.",
  demoReady: "Ready for your next conversation", todayGlance: "Today at a glance", locations: "Leads from",
  inboundTitle: "Lead inbox", inboundSupport: "Choose an inquiry to prefill the lead form.", copy: "Copy", copied: "Copied",
  useLead: "Use this lead", copyFailed: "Copy failed. Select and copy the lead details.", noLeads: "No sample inquiries available.",
  pasteLead: "Paste lead", pasteHint: "Paste one spreadsheet row with six tab-separated columns.", pasteApply: "Fill form from row",
  pasteInvalid: "We couldn't read six columns. Nothing was changed.", sampleRestored: "Sample leads restored", restoreSamples: "Restore sample leads",
  deleteLead: "Delete this lead?", cannotUndo: "This cannot be undone.", cancel: "Cancel", delete: "Delete", status: "Status",
  failedSave: "Could not save status. Please try again.", failedDelete: "Could not delete lead. Please try again.", deleted: "Lead deleted",
  sample: "Sample", deleteLeadLabel: "Delete lead", leadDeleted: "Lead deleted", statusUpdated: "Status updated",
  leadStatusNew: "New", leadStatusContacted: "Contacted", leadStatusVisit: "Site visit scheduled", leadStatusClosed: "Closed",
  sourceLocations: "Mumbai · Pune · Bengaluru · Hyderabad", hot: "Hot", warm: "Warm", cold: "Cold", unscored: "Unscored",
  overduePromises: "Overdue promises", inboxButton: "Open Lead inbox", leadsFromEmpty: "Add a lead to see its city here.",
  prefillFailed: "Could not load this lead into the form. Please try again.", addLeadTitle: "Add New Lead", loading: "Loading...",
  leadsEmpty: "No leads yet. Add a lead or restore the sample leads.", promiseKeeperEmpty: "Promise Keeper is disabled. Leads are ranked by score.",
};

export type TranslationKey = keyof typeof enText;
export type Language = "en" | "hi" | "hinglish";

const hiText: Partial<Record<TranslationKey, string>> = {
  dashboard: "डैशबोर्ड", today: "आज", leadInbox: "लीड इनबॉक्स", openDatabase: "लीड डेटाबेस खोलें",
  addLead: "लीड जोड़ें", headline: "आपकी लीड्स। प्राथमिकता के साथ। कार्रवाई के लिए तैयार।",
  heroSupport: "जानें किसे ध्यान देना है और अगला कदम क्या है।", demoReady: "अगली बातचीत के लिए तैयार",
  todayGlance: "आज की झलक", locations: "लीड के शहर", inboundTitle: "लीड इनबॉक्स",
  inboundSupport: "फॉर्म भरने के लिए एक पूछताछ चुनें।", copy: "कॉपी करें", copied: "कॉपी हो गया",
  useLead: "इस लीड का उपयोग करें", noLeads: "कोई सैंपल पूछताछ उपलब्ध नहीं है।", pasteLead: "लीड पेस्ट करें",
  pasteHint: "छह टैब-अलग कॉलम वाली स्प्रेडशीट पंक्ति पेस्ट करें।", pasteApply: "पंक्ति से फॉर्म भरें",
  pasteInvalid: "छह कॉलम नहीं मिले। कुछ नहीं बदला गया।", sampleRestored: "सैंपल लीड बहाल हुईं", restoreSamples: "सैंपल लीड बहाल करें",
  deleteLead: "क्या यह लीड हटाएँ?", cannotUndo: "इसे वापस नहीं किया जा सकता।", cancel: "रद्द करें", delete: "हटाएँ",
  status: "स्थिति", deleted: "लीड हटाई गई", leadStatusNew: "नई", leadStatusContacted: "संपर्क किया",
  leadStatusVisit: "साइट विज़िट तय", leadStatusClosed: "बंद", hot: "हॉट", warm: "वार्म", cold: "कोल्ड", unscored: "स्कोर नहीं",
  overduePromises: "समय से पीछे वादे", inboxButton: "लीड इनबॉक्स खोलें", leadsFromEmpty: "यहाँ शहर देखने के लिए लीड जोड़ें।",
  addLeadTitle: "नई लीड जोड़ें", loading: "लोड हो रहा है...", leadsEmpty: "अभी कोई लीड नहीं। लीड जोड़ें या सैंपल बहाल करें।",
  promiseKeeperEmpty: "Promise Keeper बंद है। लीड स्कोर के अनुसार हैं।",
};

const hinglishText: Partial<Record<TranslationKey, string>> = {
  dashboard: "Dashboard", today: "Aaj", leadInbox: "Lead inbox", openDatabase: "Leads database kholo",
  addLead: "Lead add karein", headline: "Aapki leads. Ranked. Action ke liye ready.",
  heroSupport: "Samjhein kisko attention chahiye aur next step kya hai.", demoReady: "Agli conversation ke liye ready",
  todayGlance: "Aaj ka overview", locations: "Leads ke shehar", inboundTitle: "Lead inbox",
  inboundSupport: "Form prefill karne ke liye inquiry choose karein.", copy: "Copy", copied: "Copied",
  useLead: "Is lead ko use karein", noLeads: "Abhi koi sample inquiry nahi hai.", pasteLead: "Lead paste karein",
  pasteHint: "6 tab-separated columns wali spreadsheet row paste karein.", pasteApply: "Row se form bharein",
  pasteInvalid: "6 columns read nahi hue. Kuch change nahi hua.", sampleRestored: "Sample leads restore ho gaye",
  restoreSamples: "Sample leads restore karein", deleteLead: "Yeh lead delete karein?", cannotUndo: "Yeh undo nahi ho sakta.",
  cancel: "Cancel", delete: "Delete", status: "Status", deleted: "Lead delete hui", leadStatusNew: "New",
  leadStatusContacted: "Contacted", leadStatusVisit: "Site visit scheduled", leadStatusClosed: "Closed",
  hot: "Hot", warm: "Warm", cold: "Cold", unscored: "Unscored", overduePromises: "Overdue promises",
  inboxButton: "Lead inbox kholen", leadsFromEmpty: "Yahan city dekhne ke liye lead add karein.",
  addLeadTitle: "Nayi lead add karein", loading: "Loading...", leadsEmpty: "Abhi koi lead nahi. Lead add ya sample restore karein.",
  promiseKeeperEmpty: "Promise Keeper off hai. Leads score ke order mein hain.",
};

export const en: Record<TranslationKey, string> = enText;
const hiExtra: Partial<Record<TranslationKey, string>> = {
  statusUpdated: "\u0938\u094d\u0925\u093f\u0924\u093f \u0905\u092a\u0921\u0947\u091f \u0939\u0941\u0908",
  sample: "\u0938\u0948\u0902\u092a\u0932", deleteLeadLabel: "\u0932\u0940\u0921 \u0939\u091f\u093e\u090f\u0901", leadDeleted: "\u0932\u0940\u0921 \u0939\u091f\u093e\u0908 \u0917\u0908",
  failedDelete: "\u0932\u0940\u0921 \u0939\u091f \u0928\u0939\u0940\u0902 \u0938\u0915\u0940। \u092b\u093f\u0930 \u0915\u094b\u0936\u093f\u0936 \u0915\u0930\u0947\u0902।",
  failedSave: "\u0938\u094d\u0925\u093f\u0924\u093f \u0938\u0947\u0935 \u0928\u0939\u0940\u0902 \u0939\u0941\u0908। \u092b\u093f\u0930 \u0915\u094b\u0936\u093f\u0936 \u0915\u0930\u0947\u0902।",
};
const hinglishExtra: Partial<Record<TranslationKey, string>> = {
  sample: "Sample", deleteLeadLabel: "Lead delete karein", leadDeleted: "Lead delete hui", statusUpdated: "Status updated",
  failedDelete: "Lead delete nahi hui. Dobara try karein.", failedSave: "Status save nahi hua. Dobara try karein.",
};
export const hi: Record<TranslationKey, string> = { ...en, ...hiText, ...hiExtra };
export const hinglish: Record<TranslationKey, string> = { ...en, ...hinglishText, ...hinglishExtra };
export const dictionaries = { en, hi, hinglish } satisfies Record<Language, Record<TranslationKey, string>>;

export const leadStatusKeys = {
  New: "leadStatusNew",
  Contacted: "leadStatusContacted",
  "Site visit scheduled": "leadStatusVisit",
  Closed: "leadStatusClosed",
} as const;
