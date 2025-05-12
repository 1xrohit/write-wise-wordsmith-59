const API_BASE_URL = 'https://deepak191z-fastapi-chat3.hf.space/v1';

export class ChatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ChatError';
  }
}

export interface GrammarCheckPrompt {
  text: string;
}

export async function sendMessage(content: string, replyToContent?: string): Promise<Response> {
  try {
    // Combine replyToContent and user input if reply exists
    const finalContent = replyToContent 
      ? `${replyToContent}\n\n${content}`
      : content;

    const response = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: finalContent,
          },
        ],
        model: 'gpt-4o-mini',
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new ChatError(`Server error: ${response.status}`);
    }

    return response;
  } catch (error) {
    if (error instanceof ChatError) {
      throw error;
    }
    throw new ChatError('Failed to connect to chat service');
  }
}

// Updated prompt to match the requested format
export const createGrammarCheckPrompt = (text: string): string => {
  return `You are an expert English grammar assistant. Given any input text, you will:

1. Identify all grammar, spelling, and punctuation errors.
2. Provide clear explanations and corrected versions.
3. Respond in the following JSON format:
{
  "original": "Original input text",
  "mistakes": [
    {
      "error": "Incorrect sentence or phrase",
      "suggestion": "Corrected version",
      "reason": "Brief explanation"
    },
    ...
  ],
  "corrected": "The fully corrected version of the original text."
}

Here is the text to analyze:
"${text}"`;
};
