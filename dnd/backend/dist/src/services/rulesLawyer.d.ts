export declare function askRulesLawyer(question: string): Promise<string>;
export declare function checkRule(ruleQuery: string): Promise<{
    answer: string;
    confidence: 'high' | 'medium' | 'low';
    sources: string[];
}>;
//# sourceMappingURL=rulesLawyer.d.ts.map