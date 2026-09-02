const API_URL = process.env.NEXT_PUBLIC_AI_API_URL;

export interface AskResponse {
  answer: string;
}

export async function askAI(question: string): Promise<AskResponse> {
  if (!API_URL) {
    throw new Error('AI API URL is not configured');
  }

  const response = await fetch(`${API_URL}/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} - ${response.statusText}`);
  }

  return response.json();
}