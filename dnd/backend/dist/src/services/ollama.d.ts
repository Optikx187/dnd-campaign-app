export interface OllamaResponse {
    model: string;
    response: string;
    done: boolean;
}
export declare function generateResponse(prompt: string, model?: string): Promise<string>;
export declare function checkOllamaConnection(): Promise<boolean>;
//# sourceMappingURL=ollama.d.ts.map