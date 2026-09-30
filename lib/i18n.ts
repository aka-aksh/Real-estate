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
  sourceLocations: "Mumbai Â· Pune Â· Bengaluru Â· Hyderabad", hot: "Hot", warm: "Warm", cold: "Cold", unscored: "Unscored",
  overduePromises: "Overdue promises", inboxButton: "Open Lead inbox", leadsFromEmpty: "Add a lead to see its city here.",
  prefillFailed: "Could not load this lead into the form. Please try again.", addLeadTitle: "Add New Lead", loading: "Loading...",
  leadsEmpty: "No leads yet. Add a lead or restore the sample leads.", promiseKeeperEmpty: "Promise Keeper is disabled. Leads are ranked by score.",
  loginTitle: "Sign in to Trust-Estate", demoCredentials: "Demo credentials: demo@trustestate.app / demo1234", email: "Email", password: "Password",
  signIn: "Sign in", continueDemo: "Continue as demo", authValidation: "Enter a valid email and a password with at least 6 characters.",
  sessionError: "Could not save this demo session. Check browser storage settings.", logout: "Log out", regenerateLanguage: "Regenerate in current language", regenerating: "Regenerating...",
};

export type TranslationKey = keyof typeof enText;
export type Language = "en" | "hi" | "hinglish";

const hiText: Partial<Record<TranslationKey, string>> = {
  dashboard: "à¤¡à¥ˆà¤¶à¤¬à¥‹à¤°à¥à¤¡", today: "à¤†à¤œ", leadInbox: "à¤²à¥€à¤¡ à¤‡à¤¨à¤¬à¥‰à¤•à¥à¤¸", openDatabase: "à¤²à¥€à¤¡ à¤¡à¥‡à¤Ÿà¤¾à¤¬à¥‡à¤¸ à¤–à¥‹à¤²à¥‡à¤‚",
  addLead: "à¤²à¥€à¤¡ à¤œà¥‹à¤¡à¤¼à¥‡à¤‚", headline: "à¤†à¤ªà¤•à¥€ à¤²à¥€à¤¡à¥à¤¸à¥¤ à¤ªà¥à¤°à¤¾à¤¥à¤®à¤¿à¤•à¤¤à¤¾ à¤•à¥‡ à¤¸à¤¾à¤¥à¥¤ à¤•à¤¾à¤°à¥à¤°à¤µà¤¾à¤ˆ à¤•à¥‡ à¤²à¤¿à¤ à¤¤à¥ˆà¤¯à¤¾à¤°à¥¤",
  heroSupport: "à¤œà¤¾à¤¨à¥‡à¤‚ à¤•à¤¿à¤¸à¥‡ à¤§à¥à¤¯à¤¾à¤¨ à¤¦à¥‡à¤¨à¤¾ à¤¹à¥ˆ à¤”à¤° à¤…à¤—à¤²à¤¾ à¤•à¤¦à¤® à¤•à¥à¤¯à¤¾ à¤¹à¥ˆà¥¤", demoReady: "à¤…à¤—à¤²à¥€ à¤¬à¤¾à¤¤à¤šà¥€à¤¤ à¤•à¥‡ à¤²à¤¿à¤ à¤¤à¥ˆà¤¯à¤¾à¤°",
  todayGlance: "à¤†à¤œ à¤•à¥€ à¤à¤²à¤•", locations: "à¤²à¥€à¤¡ à¤•à¥‡ à¤¶à¤¹à¤°", inboundTitle: "à¤²à¥€à¤¡ à¤‡à¤¨à¤¬à¥‰à¤•à¥à¤¸",
  inboundSupport: "à¤«à¥‰à¤°à¥à¤® à¤­à¤°à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤à¤• à¤ªà¥‚à¤›à¤¤à¤¾à¤› à¤šà¥à¤¨à¥‡à¤‚à¥¤", copy: "à¤•à¥‰à¤ªà¥€ à¤•à¤°à¥‡à¤‚", copied: "à¤•à¥‰à¤ªà¥€ à¤¹à¥‹ à¤—à¤¯à¤¾",
  useLead: "à¤‡à¤¸ à¤²à¥€à¤¡ à¤•à¤¾ à¤‰à¤ªà¤¯à¥‹à¤— à¤•à¤°à¥‡à¤‚", noLeads: "à¤•à¥‹à¤ˆ à¤¸à¥ˆà¤‚à¤ªà¤² à¤ªà¥‚à¤›à¤¤à¤¾à¤› à¤‰à¤ªà¤²à¤¬à¥à¤§ à¤¨à¤¹à¥€à¤‚ à¤¹à¥ˆà¥¤", pasteLead: "à¤²à¥€à¤¡ à¤ªà¥‡à¤¸à¥à¤Ÿ à¤•à¤°à¥‡à¤‚",
  pasteHint: "à¤›à¤¹ à¤Ÿà¥ˆà¤¬-à¤…à¤²à¤— à¤•à¥‰à¤²à¤® à¤µà¤¾à¤²à¥€ à¤¸à¥à¤ªà¥à¤°à¥‡à¤¡à¤¶à¥€à¤Ÿ à¤ªà¤‚à¤•à¥à¤¤à¤¿ à¤ªà¥‡à¤¸à¥à¤Ÿ à¤•à¤°à¥‡à¤‚à¥¤", pasteApply: "à¤ªà¤‚à¤•à¥à¤¤à¤¿ à¤¸à¥‡ à¤«à¥‰à¤°à¥à¤® à¤­à¤°à¥‡à¤‚",
  pasteInvalid: "à¤›à¤¹ à¤•à¥‰à¤²à¤® à¤¨à¤¹à¥€à¤‚ à¤®à¤¿à¤²à¥‡à¥¤ à¤•à¥à¤› à¤¨à¤¹à¥€à¤‚ à¤¬à¤¦à¤²à¤¾ à¤—à¤¯à¤¾à¥¤", sampleRestored: "à¤¸à¥ˆà¤‚à¤ªà¤² à¤²à¥€à¤¡ à¤¬à¤¹à¤¾à¤² à¤¹à¥à¤ˆà¤‚", restoreSamples: "à¤¸à¥ˆà¤‚à¤ªà¤² à¤²à¥€à¤¡ à¤¬à¤¹à¤¾à¤² à¤•à¤°à¥‡à¤‚",
  deleteLead: "à¤•à¥à¤¯à¤¾ à¤¯à¤¹ à¤²à¥€à¤¡ à¤¹à¤Ÿà¤¾à¤à¤?", cannotUndo: "à¤‡à¤¸à¥‡ à¤µà¤¾à¤ªà¤¸ à¤¨à¤¹à¥€à¤‚ à¤•à¤¿à¤¯à¤¾ à¤œà¤¾ à¤¸à¤•à¤¤à¤¾à¥¤", cancel: "à¤°à¤¦à¥à¤¦ à¤•à¤°à¥‡à¤‚", delete: "à¤¹à¤Ÿà¤¾à¤à¤",
  status: "à¤¸à¥à¤¥à¤¿à¤¤à¤¿", deleted: "à¤²à¥€à¤¡ à¤¹à¤Ÿà¤¾à¤ˆ à¤—à¤ˆ", leadStatusNew: "à¤¨à¤ˆ", leadStatusContacted: "à¤¸à¤‚à¤ªà¤°à¥à¤• à¤•à¤¿à¤¯à¤¾",
  leadStatusVisit: "à¤¸à¤¾à¤‡à¤Ÿ à¤µà¤¿à¤œà¤¼à¤¿à¤Ÿ à¤¤à¤¯", leadStatusClosed: "à¤¬à¤‚à¤¦", hot: "à¤¹à¥‰à¤Ÿ", warm: "à¤µà¤¾à¤°à¥à¤®", cold: "à¤•à¥‹à¤²à¥à¤¡", unscored: "à¤¸à¥à¤•à¥‹à¤° à¤¨à¤¹à¥€à¤‚",
  overduePromises: "à¤¸à¤®à¤¯ à¤¸à¥‡ à¤ªà¥€à¤›à¥‡ à¤µà¤¾à¤¦à¥‡", inboxButton: "à¤²à¥€à¤¡ à¤‡à¤¨à¤¬à¥‰à¤•à¥à¤¸ à¤–à¥‹à¤²à¥‡à¤‚", leadsFromEmpty: "à¤¯à¤¹à¤¾à¤ à¤¶à¤¹à¤° à¤¦à¥‡à¤–à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤²à¥€à¤¡ à¤œà¥‹à¤¡à¤¼à¥‡à¤‚à¥¤",
  addLeadTitle: "à¤¨à¤ˆ à¤²à¥€à¤¡ à¤œà¥‹à¤¡à¤¼à¥‡à¤‚", loading: "à¤²à¥‹à¤¡ à¤¹à¥‹ à¤°à¤¹à¤¾ à¤¹à¥ˆ...", leadsEmpty: "à¤…à¤­à¥€ à¤•à¥‹à¤ˆ à¤²à¥€à¤¡ à¤¨à¤¹à¥€à¤‚à¥¤ à¤²à¥€à¤¡ à¤œà¥‹à¤¡à¤¼à¥‡à¤‚ à¤¯à¤¾ à¤¸à¥ˆà¤‚à¤ªà¤² à¤¬à¤¹à¤¾à¤² à¤•à¤°à¥‡à¤‚à¥¤",
  promiseKeeperEmpty: "Promise Keeper à¤¬à¤‚à¤¦ à¤¹à¥ˆà¥¤ à¤²à¥€à¤¡ à¤¸à¥à¤•à¥‹à¤° à¤•à¥‡ à¤…à¤¨à¥à¤¸à¤¾à¤° à¤¹à¥ˆà¤‚à¥¤",
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
  loginTitle: "\u091f\u094d\u0930\u0938\u094d\u091f-\u090f\u0938\u094d\u091f\u0947\u091f \u092e\u0947\u0902 \u0938\u093e\u0907\u0928 \u0907\u0928 \u0915\u0930\u0947\u0902", demoCredentials: "\u0921\u0947\u092e\u094b \u0932\u0949\u0917\u093f\u0928: demo@trustestate.app / demo1234", email: "\u0908\u092e\u0947\u0932", password: "\u092a\u093e\u0938\u0935\u0930\u094d\u0921",
  signIn: "\u0938\u093e\u0907\u0928 \u0907\u0928", continueDemo: "\u0921\u0947\u092e\u094b \u0915\u0947 \u0930\u0942\u092a \u092e\u0947\u0902 \u091c\u093e\u0930\u0940 \u0930\u0916\u0947\u0902", authValidation: "\u0938\u0939\u0940 \u0908\u092e\u0947\u0932 \u0914\u0930 \u0915\u092e \u0938\u0947 \u0915\u092e 6 \u0905\u0915\u094d\u0937\u0930 \u0915\u093e \u092a\u093e\u0938\u0935\u0930\u094d\u0921 \u0926\u0930\u094d\u091c \u0915\u0930\u0947\u0902",
  sessionError: "\u0921\u0947\u092e\u094b \u0938\u0947\u0936\u0928 \u0938\u0947\u0935 \u0928\u0939\u0940\u0902 \u0939\u0941\u0906", logout: "\u0932\u0949\u0917 \u0906\u0909\u091f", regenerateLanguage: "\u0907\u0938\u0940 \u092d\u093e\u0937\u093e \u092e\u0947\u0902 \u092b\u093f\u0930 \u0938\u0947 \u092c\u0928\u093e\u090f\u0902", regenerating: "\u092b\u093f\u0930 \u0938\u0947 \u092c\u0928 \u0930\u0939\u093e \u0939\u0948...",
  statusUpdated: "\u0938\u094d\u0925\u093f\u0924\u093f \u0905\u092a\u0921\u0947\u091f \u0939\u0941\u0908",
  sample: "\u0938\u0948\u0902\u092a\u0932", deleteLeadLabel: "\u0932\u0940\u0921 \u0939\u091f\u093e\u090f\u0901", leadDeleted: "\u0932\u0940\u0921 \u0939\u091f\u093e\u0908 \u0917\u0908",
  failedDelete: "\u0932\u0940\u0921 \u0939\u091f \u0928\u0939\u0940\u0902 \u0938\u0915\u0940à¥¤ \u092b\u093f\u0930 \u0915\u094b\u0936\u093f\u0936 \u0915\u0930\u0947\u0902à¥¤",
  failedSave: "\u0938\u094d\u0925\u093f\u0924\u093f \u0938\u0947\u0935 \u0928\u0939\u0940\u0902 \u0939\u0941\u0908à¥¤ \u092b\u093f\u0930 \u0915\u094b\u0936\u093f\u0936 \u0915\u0930\u0947\u0902à¥¤",
};
const hinglishExtra: Partial<Record<TranslationKey, string>> = {
  loginTitle: "Trust-Estate mein sign in karein", demoCredentials: "Demo login: demo@trustestate.app / demo1234", email: "Email", password: "Password",
  signIn: "Sign in karein", continueDemo: "Demo ke roop mein continue karein", authValidation: "Valid email aur kam se kam 6 characters ka password daalein.",
  sessionError: "Demo session save nahi hua. Browser storage settings check karein.", logout: "Log out", regenerateLanguage: "Current language mein regenerate karein", regenerating: "Regenerate ho raha hai...",
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

