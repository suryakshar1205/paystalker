declare module '@google/generative-ai' {
  export interface GenerativeModel {
    generateContent(prompt: string): Promise<{
      response: {
        text(): string;
      };
    }>;
  }

  export class GoogleGenerativeAI {
    constructor(apiKey: string);
    getGenerativeModel(options: { model: string }): GenerativeModel;
  }
}
