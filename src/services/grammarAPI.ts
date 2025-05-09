
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

export const createGrammarCheckPrompt = (text: string): string => {
  return `Please analyze the following text for grammar, spelling, punctuation, and style issues. Return the results in a JSON format with an array called "corrections" where each correction has the following structure:
  {
    "original": "the incorrect text",
    "suggestion": "the corrected text",
    "type": "grammar/spelling/punctuation/style",
    "explanation": "why this correction is needed",
    "startIndex": the character position where the error starts in the original text,
    "endIndex": the character position where the error ends in the original text
  }
  
  Here is the text to analyze:
  "${text}"`;
};
