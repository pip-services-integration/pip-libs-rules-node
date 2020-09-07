import { IVariableCollection } from 'pip-services3-expressions-node';
import { IFunctionCollection } from 'pip-services3-expressions-node';
import { Rule } from '../data/Rule';
import { IRuleEngine } from './IRuleEngine';
export declare class RuleEngine implements IRuleEngine {
    cacheRules(rules: Rule[]): void;
    private findInCache;
    clearCache(): void;
    private checkVariablesAndFunctions;
    private createCalculator;
    /**
     * Verifies rule condition and action expressions given facts and supported functions.
     * @param rule the rule to be tested
     * @param facts a set of facts (variables) to be passed to condition and action expressions.
     * @param conditionFunctions a set of functions for condition expression.
     * @param actionFunctions a set of functions for action expression.
     * @param callback a callback that returns the test result.
     */
    verifyRule(rule: Rule, facts: IVariableCollection, conditionFunctions: IFunctionCollection, actionFunctions: IFunctionCollection, callback: (err: any) => void): void;
    /**
     * Calculates the condition expression and returns the result.
     * @param rule the rule to be calculated.
     * @param facts a set of facts (variables) to be passed to condition and action expressions.
     * @param conditionFunctions a set of functions for condition expression.
     * @param callback a callback that returns the test result.
     */
    testRule(rule: Rule, facts: IVariableCollection, conditionFunctions: IFunctionCollection, callback: (err: any, result: boolean) => void): void;
    /**
     * Finds the 1st rule with a positive condition expression taking into account
     * priority and disabled flags.
     * @param rule the rule to be calculated.
     * @param facts a set of facts (variables) to be passed to condition and action expressions.
     * @param conditionFunctions a set of functions for condition expression.
     * @param callback a callback that returns the found rulet.
     */
    testFirstRule(rules: Rule[], facts: IVariableCollection, conditionFunctions: IFunctionCollection, callback: (err: any, rule: Rule) => void): void;
    /**
     * Finds the all rules with a positive condition expression.
     * The function list takes into account disabled flag and sorted by priority.
     * @param rule the rule to be calculated.
     * @param facts a set of facts (variables) to be passed to condition and action expressions.
     * @param conditionFunctions a set of functions for condition expression.
     * @param callback a callback that returns the found rules.
     */
    testAllRules(rules: Rule[], facts: IVariableCollection, conditionFunctions: IFunctionCollection, callback: (err: any, rules: Rule[]) => void): void;
    /**
     * Calculates the action expression and returns the result.
     * @param rule the rule to be calculated.
     * @param facts a set of facts (variables) to be passed to condition and action expressions.
     * @param actionFunctions a set of functions for action expression.
     * @param callback a callback that returns the action expression result.
     */
    actUponRule(rule: Rule, facts: IVariableCollection, actionFunctions: IFunctionCollection, callback: (err: any, result: any) => void): void;
    /**
     * Calculates an action expression for all specified rules.
     * The function list takes into account disabled flag and sorted by priority.
     * @param rule the rule to be calculated.
     * @param facts a set of facts (variables) to be passed to condition and action expressions.
     * @param actionFunctions a set of functions for action expression.
     * @param callback a callback that returns executed rules and their action results.
     */
    actUponAllRules(rules: Rule[], facts: IVariableCollection, actionFunctions: IFunctionCollection, callback: (err: any, results: any[]) => void): void;
}
