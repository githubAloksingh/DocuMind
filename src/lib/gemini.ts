import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

if (!apiKey) {
  console.warn('Gemini API key not found. Please add VITE_GEMINI_API_KEY to your environment variables.');
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function generateSummary(
  text: string, 
  length: 'short' | 'medium' | 'long' = 'medium'
): Promise<string> {
  if (!apiKey) {
    throw new Error('Gemini API key is required. Please add your API key to continue.');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const lengthInstructions = {
    short: 'in 2-3 concise sentences, focusing only on the most critical points (max 60 words)',
    medium: 'in 1-2 well-structured paragraphs, covering main ideas and key details (max 150 words)',
    long: 'in 3-4 comprehensive paragraphs, providing thorough analysis and context (max 300 words)'
  };

  const prompt = `
    Please provide a comprehensive summary of the following text ${lengthInstructions[length]}. 
    Focus on the main ideas, key points, and important details. Make it clear, well-structured, and actionable.
    Use bullet points for key takeaways when appropriate.
    
    Text to summarize:
    ${text.slice(0, 50000)} ${text.length > 50000 ? '...(truncated for processing)' : ''}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error('Failed to generate summary. Please check your API key and try again.');
  }
}

export async function generateSuggestions(summary: string, originalText: string): Promise<string[]> {
  if (!apiKey) {
    throw new Error('Gemini API key is required');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
    Based on the following summary and original text, provide exactly 3 specific improvement suggestions.
    Focus on:
    1. Clarity and readability improvements
    2. Structural organization enhancements
    3. Missing critical information or better emphasis
    
    Return only the suggestions as a simple numbered list without additional commentary.
    Each suggestion should be actionable and specific.
    
    Summary:
    ${summary}
    
    Original Text (first 5000 chars):
    ${originalText.slice(0, 5000)}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text.split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(suggestion => suggestion.length > 10)
      .slice(0, 3);
  } catch (error) {
    console.error('Error generating suggestions:', error);
    throw new Error('Failed to generate suggestions. Please try again.');
  }
}