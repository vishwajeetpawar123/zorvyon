import { Transaction, CategoryStat, Insight } from '../../types';

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export async function getLisaResponse(
  messages: ChatMessage[],
  context: {
    transactions: Transaction[];
    stats: CategoryStat[];
    insights: Insight[];
    profileName: string;
    currency: string;
  }
) {
  const API_KEY = import.meta.env.VITE_AI_API_KEY;

  if (!API_KEY) {
    throw new Error('API key not found. Please add VITE_AI_AI_KEY to your .env.local file.');
  }

  const systemInstructions = `
You are LISA (Lead Intelligent Savings Assistant), a premium financial AI advisor for the Zorvyn Fintech platform.
Your goal is to provide deep, actionable insights into the user's spending habits.

USER CONTEXT:
- Name: ${context.profileName}
- Currency: ${context.currency}
- Total Transactions: ${context.transactions.length}
- Top Categories: ${context.stats.map(s => `${s.category}: ${s.total}`).join(', ')}
- Current AI Insights: ${context.insights.map(i => i.title + ': ' + i.description).join(' | ')}

GUIDELINES:
1. Be professional, concise, and highly analytical.
2. Use the provided spending data to give specific advice.
3. If the user is over budget, suggest ways to cut back in their highest spending categories.
4. Maintain a "Premium Fintech" persona - helpful, data-driven, and sophisticated.
5. Format your responses with markdown for readability.

Respond as LISA.
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: systemInstructions }]
          },
          ...messages
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to get response from LISA AI');
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}
