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
  sourceLocations: "Mumbai | Pune | Bengaluru | Hyderabad", hot: "Hot", warm: "Warm", cold: "Cold", unscored: "Unscored",
  overduePromises: "Overdue promises", inboxButton: "Open Lead inbox", leadsFromEmpty: "Add a lead to see its city here.",
  prefillFailed: "Could not load this lead into the form. Please try again.", addLeadTitle: "Add New Lead", loading: "Loading...",
  leadsEmpty: "No leads yet. Add a lead or restore the sample leads.", promiseKeeperEmpty: "Promise Keeper is disabled. Leads are ranked by score.",
  loginTitle: "Sign in to Trust-Estate", demoCredentials: "Demo credentials: demo@trustestate.app / demo1234", email: "Email", password: "Password",
  signIn: "Sign in", continueDemo: "Continue as demo", authValidation: "Enter a valid email and a password with at least 6 characters.",
  sessionError: "Could not save this demo session. Check browser storage settings.", logout: "Log out", regenerateLanguage: "Regenerate in current language", regenerating: "Regenerating...",
};

export type TranslationKey = keyof typeof enText;
export type Language = "en" | "hi" | "hinglish";

// Unicode escapes keep Hindi source text stable across Windows editor encodings.
export const en: Record<TranslationKey, string> = enText;
export const hi: Record<TranslationKey, string> = {
  dashboard: "\u0921\u0948\u0936\u092c\u094b\u0930\u094d\u0921", today: "\u0906\u091c", leadInbox: "\u0932\u0940\u0921 \u0907\u0928\u092c\u0949\u0915\u094d\u0938", openDatabase: "\u0932\u0940\u0921 \u0921\u0947\u091f\u093e\u092c\u0947\u0938 \u0916\u094b\u0932\u0947\u0902",
  addLead: "\u0932\u0940\u0921 \u091c\u094b\u0921\u093c\u0947\u0902", headline: "\u0906\u092a\u0915\u0940 \u0932\u0940\u0921\u094d\u0938, \u092a\u094d\u0930\u093e\u0925\u092e\u093f\u0915\u0924\u093e \u0915\u0947 \u0938\u093e\u0925", heroSupport: "\u091c\u093e\u0928\u0947\u0902 \u0915\u093f\u0938\u0947 \u0927\u094d\u092f\u093e\u0928 \u091a\u093e\u0939\u093f\u090f \u0914\u0930 \u0905\u0917\u0932\u093e \u0915\u0926\u092e \u0915\u094d\u092f\u093e \u0939\u0948",
  demoReady: "\u0905\u0917\u0932\u0940 \u092c\u093e\u0924\u091a\u0940\u0924 \u0915\u0947 \u0932\u093f\u090f \u0924\u0948\u092f\u093e\u0930", todayGlance: "\u0906\u091c \u0915\u0940 \u091d\u0932\u0915", locations: "\u0932\u0940\u0921 \u0915\u0947 \u0936\u0939\u0930",
  inboundTitle: "\u0932\u0940\u0921 \u0907\u0928\u092c\u0949\u0915\u094d\u0938", inboundSupport: "\u0932\u0940\u0921 \u092b\u093c\u0949\u0930\u094d\u092e \u092d\u0930\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u090f\u0915 \u092a\u0942\u091b\u0924\u093e\u091b \u091a\u0941\u0928\u0947\u0902", copy: "\u0915\u0949\u092a\u0940", copied: "\u0915\u0949\u092a\u0940 \u0939\u094b \u0917\u092f\u093e",
  useLead: "\u0907\u0938 \u0932\u0940\u0921 \u0915\u093e \u0909\u092a\u092f\u094b\u0917 \u0915\u0930\u0947\u0902", copyFailed: "\u0915\u0949\u092a\u0940 \u0928\u0939\u0940\u0902 \u0939\u0941\u0906. \u0932\u0940\u0921 \u0915\u0940 \u0935\u093f\u0935\u0930\u0923\u0940 \u091a\u0941\u0928\u0915\u0930 \u0915\u0949\u092a\u0940 \u0915\u0930\u0947\u0902", noLeads: "\u0915\u094b\u0908 \u0928\u092e\u0942\u0928\u093e \u092a\u0942\u091b\u0924\u093e\u091b \u0909\u092a\u0932\u092c\u094d\u0927 \u0928\u0939\u0940\u0902",
  pasteLead: "\u0932\u0940\u0921 \u092a\u0947\u0938\u094d\u091f \u0915\u0930\u0947\u0902", pasteHint: "\u091b\u0939 \u091f\u0948\u092c \u0935\u093e\u0932\u0947 \u0938\u094d\u092a\u094d\u0930\u0947\u0921\u0936\u0940\u091f \u0915\u0940 \u092a\u0902\u0915\u094d\u0924\u093f \u092a\u0947\u0938\u094d\u091f \u0915\u0930\u0947\u0902", pasteApply: "\u092a\u0902\u0915\u094d\u0924\u093f \u0938\u0947 \u092b\u093c\u0949\u0930\u094d\u092e \u092d\u0930\u0947\u0902",
  pasteInvalid: "\u091b\u0939 \u0915\u0949\u0932\u092e \u0928\u0939\u0940\u0902 \u092e\u093f\u0932\u0947. \u0915\u0941\u091b \u0928\u0939\u0940\u0902 \u092c\u0926\u0932\u093e", sampleRestored: "\u0928\u092e\u0942\u0928\u093e \u0932\u0940\u0921 \u092c\u0939\u093e\u0932 \u0939\u0941\u0908\u0902", restoreSamples: "\u0928\u092e\u0942\u0928\u093e \u0932\u0940\u0921 \u092c\u0939\u093e\u0932 \u0915\u0930\u0947\u0902",
  deleteLead: "\u092f\u0939 \u0932\u0940\u0921 \u0939\u091f\u093e\u090f\u0902?", cannotUndo: "\u0907\u0938\u0947 \u0935\u093e\u092a\u0938 \u0928\u0939\u0940\u0902 \u0915\u093f\u092f\u093e \u091c\u093e \u0938\u0915\u0924\u093e", cancel: "\u0930\u0926\u094d\u0926 \u0915\u0930\u0947\u0902", delete: "\u0939\u091f\u093e\u090f\u0902", status: "\u0938\u094d\u0925\u093f\u0924\u093f",
  failedSave: "\u0938\u094d\u0925\u093f\u0924\u093f \u0938\u0947\u0935 \u0928\u0939\u0940\u0902 \u0939\u0941\u0908. \u092b\u093f\u0930 \u0915\u094b\u0936\u093f\u0936 \u0915\u0930\u0947\u0902", failedDelete: "\u0932\u0940\u0921 \u0939\u091f \u0928\u0939\u0940\u0902 \u0938\u0915\u0940. \u092b\u093f\u0930 \u0915\u094b\u0936\u093f\u0936 \u0915\u0930\u0947\u0902", deleted: "\u0932\u0940\u0921 \u0939\u091f\u093e\u0908 \u0917\u0908",
  sample: "\u0928\u092e\u0942\u0928\u093e", deleteLeadLabel: "\u0932\u0940\u0921 \u0939\u091f\u093e\u090f\u0902", leadDeleted: "\u0932\u0940\u0921 \u0939\u091f\u093e\u0908 \u0917\u0908", statusUpdated: "\u0938\u094d\u0925\u093f\u0924\u093f \u0905\u092a\u0921\u0947\u091f \u0939\u0941\u0908",
  leadStatusNew: "\u0928\u092f\u093e", leadStatusContacted: "\u0938\u0902\u092a\u0930\u094d\u0915 \u0915\u093f\u092f\u093e", leadStatusVisit: "\u0938\u093e\u0907\u091f \u0935\u093f\u091c\u093c\u093f\u091f \u0924\u092f", leadStatusClosed: "\u092c\u0902\u0926",
  sourceLocations: "\u092e\u0941\u0902\u092c\u0908 | \u092a\u0941\u0923\u0947 | \u092c\u0947\u0902\u0917\u0932\u0941\u0930\u0941 | \u0939\u0948\u0926\u0930\u093e\u092c\u093e\u0926", hot: "\u0939\u0949\u091f", warm: "\u0935\u093e\u0930\u094d\u092e", cold: "\u0915\u094b\u0932\u094d\u0921", unscored: "\u0938\u094d\u0915\u094b\u0930 \u0928\u0939\u0940\u0902",
  overduePromises: "\u0938\u092e\u092f \u0938\u0947 \u092a\u0939\u0932\u0947 \u0915\u0947 \u0935\u093e\u0926\u0947", inboxButton: "\u0932\u0940\u0921 \u0907\u0928\u092c\u0949\u0915\u094d\u0938 \u0916\u094b\u0932\u0947\u0902", leadsFromEmpty: "\u092f\u0939\u093e\u0901 \u0936\u0939\u0930 \u0926\u0947\u0916\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u0932\u0940\u0921 \u091c\u094b\u0921\u093c\u0947\u0902",
  prefillFailed: "\u0932\u0940\u0921 \u092b\u093c\u0949\u0930\u094d\u092e \u092e\u0947\u0902 \u0928\u0939\u0940\u0902 \u092d\u0930\u0940. \u092b\u093f\u0930 \u0915\u094b\u0936\u093f\u0936 \u0915\u0930\u0947\u0902", addLeadTitle: "\u0928\u092f\u0940 \u0932\u0940\u0921 \u091c\u094b\u0921\u093c\u0947\u0902", loading: "\u0932\u094b\u0921 \u0939\u094b \u0930\u0939\u093e \u0939\u0948...",
  leadsEmpty: "\u0905\u092d\u0940 \u0915\u094b\u0908 \u0932\u0940\u0921 \u0928\u0939\u0940\u0902. \u0932\u0940\u0921 \u091c\u094b\u0921\u093c\u0947\u0902 \u092f\u093e \u0928\u092e\u0942\u0928\u093e \u0932\u094c\u091f\u093e\u090f\u0902", promiseKeeperEmpty: "\u092a\u094d\u0930\u0949\u092e\u093f\u0938 \u0915\u0940\u092a\u0930 \u092c\u0902\u0926 \u0939\u0948. \u0932\u0940\u0921 \u0938\u094d\u0915\u094b\u0930 \u0915\u0947 \u0905\u0928\u0941\u0938\u093e\u0930 \u0939\u0948\u0902",
  loginTitle: "\u091f\u094d\u0930\u0938\u094d\u091f-\u090f\u0938\u094d\u091f\u0947\u091f \u092e\u0947\u0902 \u0938\u093e\u0907\u0928 \u0907\u0928 \u0915\u0930\u0947\u0902", demoCredentials: "\u0921\u0947\u092e\u094b: demo@trustestate.app / demo1234", email: "\u0908\u092e\u0947\u0932", password: "\u092a\u093e\u0938\u0935\u0930\u094d\u0921",
  signIn: "\u0938\u093e\u0907\u0928 \u0907\u0928", continueDemo: "\u0921\u0947\u092e\u094b \u0915\u0947 \u0930\u0942\u092a \u092e\u0947\u0902 \u091c\u093e\u0930\u0940 \u0930\u0916\u0947\u0902", authValidation: "\u0938\u0939\u0940 \u0908\u092e\u0947\u0932 \u0914\u0930 \u0915\u092e \u0938\u0947 \u0915\u092e 6 \u0905\u0915\u094d\u0937\u0930 \u0915\u093e \u092a\u093e\u0938\u0935\u0930\u094d\u0921 \u0926\u0930\u094d\u091c \u0915\u0930\u0947\u0902",
  sessionError: "\u0921\u0947\u092e\u094b \u0938\u0947\u0936\u0928 \u0938\u0947\u0935 \u0928\u0939\u0940\u0902 \u0939\u0941\u0906. \u092c\u094d\u0930\u093e\u0909\u091c\u093c\u0930 \u0938\u094d\u091f\u094b\u0930\u0947\u091c \u091c\u093e\u0902\u091a\u0947\u0902", logout: "\u0932\u0949\u0917 \u0906\u0909\u091f", regenerateLanguage: "\u0907\u0938\u0940 \u092d\u093e\u0937\u093e \u092e\u0947\u0902 \u092b\u093f\u0930 \u0938\u0947 \u092c\u0928\u093e\u090f\u0902", regenerating: "\u092b\u093f\u0930 \u0938\u0947 \u092c\u0928 \u0930\u0939\u093e \u0939\u0948...",
};

const hinglishOverrides: Partial<Record<TranslationKey, string>> = {
  dashboard: "Dashboard", today: "Aaj", leadInbox: "Lead inbox", addLead: "Lead add karein", headline: "Aapki leads, ranked aur ready for action.",
  heroSupport: "Jaanein kisko attention chahiye aur next step kya hai.", demoReady: "Agli conversation ke liye ready", todayGlance: "Aaj ka overview", locations: "Leads ke shehar",
  inboundTitle: "Lead inbox", inboundSupport: "Form prefill karne ke liye inquiry choose karein.", copy: "Copy", copied: "Copied", useLead: "Is lead ko use karein",
  pasteLead: "Lead paste karein", pasteApply: "Row se form bharein", sampleRestored: "Sample leads restore ho gaye", restoreSamples: "Sample leads restore karein",
  deleteLead: "Yeh lead delete karein?", cancel: "Cancel", delete: "Delete", status: "Status", hot: "Hot", warm: "Warm", cold: "Cold", unscored: "Unscored",
  loginTitle: "Trust-Estate mein sign in karein", email: "Email", password: "Password", signIn: "Sign in karein", continueDemo: "Demo ke roop mein continue karein",
  logout: "Log out", regenerateLanguage: "Current language mein regenerate karein", regenerating: "Regenerate ho raha hai...",
};
export const hinglish: Record<TranslationKey, string> = { ...en, ...hinglishOverrides };
export const dictionaries = { en, hi, hinglish } satisfies Record<Language, Record<TranslationKey, string>>;

export const leadStatusKeys = {
  New: "leadStatusNew",
  Contacted: "leadStatusContacted",
  "Site visit scheduled": "leadStatusVisit",
  Closed: "leadStatusClosed",
} as const;
