import { v4 as uuidv4 } from 'uuid';

interface User {
  id: string;
  apiKey: string;
  usage: {
    tokens: number;
    images: number;
  };
  balance: number;
  createdAt: Date;
}

interface AIResponse {
  model: string;
  response: string;
}

class MoreThanFreeAPI {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  generateApiKey(): string {
    return uuidv4();
  }

  registerUser(): User {
    const id = uuidv4();
    const newUser: User = {
      id,
      apiKey: this.generateApiKey(),
      usage: { tokens: 0, images: 0 },
      balance: 0,
      createdAt: new Date(),
    };
    this.users.set(id, newUser);
    return newUser;
  }

  processTokens(apiKey: string, tokenCount: number): number {
    const user = this.getUserByApiKey(apiKey);
    if (!user) throw new Error('Invalid API key');

    user.usage.tokens += tokenCount;
    const earnings = tokenCount / 1000000;
    user.balance += earnings;

    console.log(`Processed ${tokenCount} tokens for user ${user.id}. Earnings: $${earnings.toFixed(6)}`);
    return earnings;
  }

  processImages(apiKey: string, imageCount: number): number {
    const user = this.getUserByApiKey(apiKey);
    if (!user) throw new Error('Invalid API key');

    user.usage.images += imageCount;
    const earnings = imageCount / 100;
    user.balance += earnings;

    console.log(`Processed ${imageCount} images for user ${user.id}. Earnings: $${earnings.toFixed(2)}`);
    return earnings;
  }

  getUserInfo(apiKey: string): User | null {
    return this.getUserByApiKey(apiKey);
  }

  generateResponse(model: string, prompt: string): AIResponse {
    const responses: { [key: string]: string[] } = {
      'gpt-4o': [
        "As an AI language model, I'm here to assist you with any questions or tasks you may have.",
        "I'm processing your request and formulating a comprehensive response...",
        "Based on my analysis, here's what I can tell you about your query...",
      ],
      'openai-o1': [
        "Analyzing your input to generate the most accurate and helpful response...",
        "Processing query through advanced language models for optimal results...",
        "Leveraging cutting-edge AI technology to provide you with the best possible answer...",
      ],
      'flux-1': [
        '<img src="https://picsum.photos/300/200?random=1" alt="Generated Image">',
        '<img src="https://picsum.photos/300/200?random=2" alt="Generated Image">',
        '<img src="https://picsum.photos/300/200?random=3" alt="Generated Image">',
      ],
    };

    const randomIndex = Math.floor(Math.random() * (responses[model]?.length || 0));
    const response = responses[model]?.[randomIndex] || "Model not found or no response available.";

    return { model, response };
  }

  countTokens(text: string): number {
    return text.split(/\s+/).length;
  }

  private getUserByApiKey(apiKey: string): User | null {
    for (const user of this.users.values()) {
      if (user.apiKey === apiKey) return user;
    }
    return null;
  }
}

const mtfreeApi = new MoreThanFreeAPI();

export = mtfreeApi;