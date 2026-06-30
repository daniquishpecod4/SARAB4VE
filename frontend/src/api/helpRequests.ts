export type HelpRequestPayload = {
  requesterName: string;
  contactMethod: string;
  contactValue: string;
  needType: string;
  description?: string;
  latitude?: number | null;
  longitude?: number | null;
  urgency?: string;
};

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function sendHelpRequest(payload: HelpRequestPayload) {
  const res = await fetch(`${API}/api/help-requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || res.statusText || `HTTP ${res.status}`);
  }

  // Return parsed JSON when available, otherwise null
  try {
    return await res.json();
  } catch {
    return null;
  }
}
