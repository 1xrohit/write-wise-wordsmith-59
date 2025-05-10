
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

// Improved prompt with explicit instructions about preserving spacing
export const createGrammarCheckPrompt = (text: string): string => {
  return `Please analyze the following text for grammar, spelling, punctuation, and style issues. Only identify actual errors - do not suggest changes for correct text or stylistic preferences. Return the results in ONLY valid JSON format with an array called "corrections" where each correction has the following structure:
  {
    "original": "the incorrect text exactly as it appears in the original",
    "suggestion": "the corrected text",
    "type": "grammar/spelling/punctuation/style",
    "explanation": "why this correction is needed",
    "startIndex": the exact character position where the error starts in the original text,
    "endIndex": the exact character position where the error ends in the original text
  }

  Critical guidelines for accurate corrections:
  - Be extremely precise with startIndex and endIndex - these must match the EXACT positions in the original text
  - The "original" field MUST contain the exact error text as it appears in the input - copy it exactly from the original
  - Ensure the "suggestion" maintains proper spacing - corrections should not change surrounding spacing
  - Do not introduce new spaces or remove necessary spaces around words
  - If there's a spacing error (like missing space between words), properly include that in the correction
  - Handle multi-word corrections carefully to maintain proper spacing with surrounding text
  - Do NOT include any context words in either original or suggestion fields - just the exact text to replace
  - Validate all startIndex and endIndex values with the original text before returning
  - Only return valid JSON without any markdown formatting or additional text

  Here is the text to analyze (read it carefully to calculate exact character positions):
  "${text}"`;
};
