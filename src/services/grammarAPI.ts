
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
  return `Please analyze the following text for grammar, spelling, punctuation, and style issues. Only identify actual errors - do not suggest changes for correct text or stylistic preferences. Return the results in ONLY valid JSON format with an array called "corrections" where each correction has the following structure:
  {
    "original": "the incorrect text exactly as it appears in the original",
    "suggestion": "the corrected text",
    "type": "grammar/spelling/punctuation/style",
    "explanation": "why this correction is needed",
    "startIndex": the character position where the error starts in the original text,
    "endIndex": the character position where the error ends in the original text
  }

  Important guidelines:
  - Be extremely precise with startIndex and endIndex values - they must match the exact positions in the original text
  - Make sure the original field contains the exact error text as it appears, and the suggestion contains only the corrected version of that exact text
  - The correction should be a direct replacement - same words/phrase but corrected
  - Do NOT include any surrounding context words in either original or suggestion fields
  - Ensure your response ONLY contains valid JSON without any markdown formatting or additional text
  - Handle spacing carefully - do not introduce extra spaces or remove necessary spaces
  - Do not suggest corrections for proper nouns, technical terms, or intentional stylistic choices
  - Double check all startIndex and endIndex values before returning
  
  Here is the text to analyze:
  "${text}"`;
};
