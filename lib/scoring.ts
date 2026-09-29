import type { Signals, Score, ScoreLabel } from "@/types/lead";

/**
 * Pure function: compute lead priority score from AI-extracted signals.
 * Score computed in CODE, never by the model. Status does not affect score.
 */
export function computeScore(signals: Signals): Score {
  let value = 0;
  const reasons: string[] = [];

  // --- Urgency: 0-30 ---
  switch (signals.timeline_urgency) {
    case "immediate":
      value += 30;
      reasons.push("Immediate timeline — high urgency");
      break;
    case "within_month":
      value += 22;
      reasons.push("Looking within a month");
      break;
    case "1_to_3_months":
      value += 12;
      reasons.push("Timeline is 1-3 months out");
      break;
    case "later":
      value += 5;
      reasons.push("No immediate urgency");
      break;
    // "unknown" is neutral — 0 points, no penalty
  }

  // --- Budget clarity + fit: 0-20 ---
  let budgetScore = 0;
  if (signals.budget_clarity === "clear") {
    budgetScore += 10;
  } else if (signals.budget_clarity === "vague") {
    budgetScore += 4;
    reasons.push("Budget is vague — needs qualification");
  }
  // unknown budget clarity = 0, neutral

  if (signals.budget_fit === "fits") {
    budgetScore += 10;
    reasons.push("Budget fits project range");
  } else if (signals.budget_fit === "above") {
    budgetScore += 8;
  } else if (signals.budget_fit === "below") {
    budgetScore += 2;
    reasons.push("Budget is below project range");
  }
  // unknown budget fit = 0, neutral
  value += budgetScore;

  // --- Requirement clarity: 0-20 ---
  switch (signals.requirement_clarity) {
    case "clear":
      value += 20;
      break;
    case "partial":
      value += 10;
      reasons.push("Requirements partially clear — ask follow-up");
      break;
    case "vague":
      value += 4;
      reasons.push("Requirements are vague");
      break;
  }

  // --- Intent + action signals: 0-30 ---
  let intentScore = 0;

  if (signals.action_requests.includes("site_visit")) {
    intentScore += 15;
    reasons.push("Requested site visit — strong buying signal");
  }
  if (signals.action_requests.includes("callback")) {
    intentScore += 8;
  }
  if (signals.action_requests.includes("pricing")) {
    intentScore += 6;
  }
  if (signals.action_requests.includes("brochure")) {
    intentScore += 3;
  }

  if (signals.financing_readiness === "ready") {
    intentScore += 5;
    reasons.push("Financing ready");
  } else if (signals.financing_readiness === "needs_loan") {
    intentScore += 2;
  }

  // Cap intent section at 30
  value += Math.min(intentScore, 30);

  // --- Objection penalty: up to -10 ---
  if (signals.objections_severity === "major") {
    value -= 10;
    reasons.push("Has major objections");
  } else if (signals.objections_severity === "minor") {
    value -= 4;
  }

  // Clamp 0-100
  value = Math.max(0, Math.min(100, value));

  // Label
  let label: ScoreLabel;
  if (value >= 70) label = "Hot";
  else if (value >= 40) label = "Warm";
  else label = "Cold";

  // Ensure 2-5 reasons
  if (reasons.length < 2) {
    if (value >= 70) reasons.push("Strong overall buying signals");
    else if (value >= 40) reasons.push("Moderate interest shown");
    else reasons.push("Limited information available");
  }
  if (reasons.length < 2) {
    reasons.push("Needs further qualification");
  }

  return { value, label, reasons: reasons.slice(0, 5) };
}
