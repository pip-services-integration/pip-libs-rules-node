const async = require('async');
const _ = require('lodash');

import { IVariableCollection } from 'pip-services3-expressions-node';
import { Variant } from 'pip-services3-expressions-node';
import { VariantType } from 'pip-services3-expressions-node';
import { ExpressionCalculator } from 'pip-services3-expressions-node';
import { ExpressionTokenType } from 'pip-services3-expressions-node';
import { IFunctionCollection } from 'pip-services3-expressions-node';
import { ExpressionException } from 'pip-services3-expressions-node';

import { Rule } from '../data/Rule';
import { FactCollection } from './FactCollection';
import { CompositeFunctionCollection } from './CompositeFunctionCollection';
import { IRuleEngine } from './IRuleEngine';

export class RuleEngine implements IRuleEngine {
    public cacheRules(rules: Rule[]) {
        // Todo...
    }

    private findInCache(expression: string): ExpressionCalculator {
        // Todo...
        return null;
    }

    public clearCache() {
        // Todo...
    }

    private checkVariablesAndFunctions(calculator: ExpressionCalculator,
        facts: IVariableCollection, funcs: IFunctionCollection): void {
        for (let token of calculator.resultTokens) {
            // Check fact variable
            if (token.type == ExpressionTokenType.Variable) {
                let factName = token.value.asString;
                if (facts.findByName(factName) == null) {
                    throw new ExpressionException(null, "VAR_NOT_FOUND", "Fact variable was not found.");
                }
            }
            // Check function
            if (token.type == ExpressionTokenType.Function) {
                let funcName = token.value.asString;
                if (funcs.findByName(funcName) == null) {
                    throw new ExpressionException(null, "FUNC_NOT_FOUND", "Function was not found.");
                }
            }
        }
    }

    private createCalculator(expression: string,
        facts: IVariableCollection, funcs: IFunctionCollection,
        callback: (err: any, calculator: ExpressionCalculator) => void): void {
        let calculator: ExpressionCalculator;
        try {
            calculator = this.findInCache(expression);        
            if (calculator == null) {
                calculator = new ExpressionCalculator();
                calculator.expression = expression;
            }
            this.checkVariablesAndFunctions(calculator, facts, funcs);
        } catch (err) {
            callback(err, null);
            return;
        }
        callback(null, calculator);
    }

    /**
     * Verifies rule condition and action expressions given facts and supported functions.
     * @param rule the rule to be tested
     * @param facts a set of facts (variables) to be passed to condition and action expressions.
     * @param conditionFunctions a set of functions for condition expression. 
     * @param actionFunctions a set of functions for action expression.
     * @param callback a callback that returns the test result.
     */
    public verifyRule(rule: Rule, facts: IVariableCollection,
        conditionFunctions: IFunctionCollection,
        actionFunctions: IFunctionCollection,
        callback: (err: any) => void) {

        let allFacts = new FactCollection(facts, rule.params);
        let allConditionFuncs = new CompositeFunctionCollection(conditionFunctions);
        let allActionFuncs = new CompositeFunctionCollection(actionFunctions);

        async.series([
            // Verify condition expression
            (callback) => {
                this.createCalculator(rule.condition, allFacts, allConditionFuncs, callback);
            },
            // Verify action expression
            (callback) => {
                this.createCalculator(rule.action, allFacts, allActionFuncs, callback);
            }
        ], callback);
    }

    /**
     * Calculates the condition expression and returns the result.
     * @param rule the rule to be calculated.
     * @param facts a set of facts (variables) to be passed to condition and action expressions.
     * @param conditionFunctions a set of functions for condition expression. 
     * @param callback a callback that returns the test result.
     */
    public testRule(rule: Rule, facts: IVariableCollection,
        conditionFunctions: IFunctionCollection,
        callback: (err: any, result: boolean) => void) {

        let allFacts = new FactCollection(facts, rule.params);
        let allFuncs = new CompositeFunctionCollection(conditionFunctions);

        let calculator: ExpressionCalculator;
        let result: Variant;

        async.series([
            // Create condition expression
            (callback) => {
                this.createCalculator(rule.condition, allFacts, allFuncs, (err, calc) => {
                    calculator = calc;
                    callback(err);
                });
            },
            // Calculate condition
            (callback) => {
                calculator.evaluateWithVariablesAndFunctions(
                    allFacts, allFuncs, (err, res) => {
                        result = res;
                        callback(err);
                    }
                )
            }
        ], (err) => {
            if (err != null) {
                callback(err, null);
                return;
            }

            if (result.type != VariantType.Boolean) {
                err = new ExpressionException(null, "WRONG_RESULT_TYPE", "Expected boolean result in condition expression");
                callback(err, null);
                return;
            }

            callback(null, result.asBoolean);
        });    
    }
    
    /**
     * Finds the 1st rule with a positive condition expression taking into account
     * priority and disabled flags.
     * @param rule the rule to be calculated.
     * @param facts a set of facts (variables) to be passed to condition and action expressions.
     * @param conditionFunctions a set of functions for condition expression. 
     * @param callback a callback that returns the found rulet.
     */
    public testFirstRule(rules: Rule[], facts: IVariableCollection,
        conditionFunctions: IFunctionCollection,
        callback: (err: any, rule: Rule) => void) {

        let resultRule: Rule = null;
        
        // Remove all disabled rules
        rules = _.filter(rules, (rule) => !rule.disabled);
        // Sort rules by priority
        rules = _.sortBy(rules, ['priority']);

        async.each(rules, (rule, callback) => {
            if (resultRule != null) {
                callback();
                return;
            }

            this.testRule(rule, facts, conditionFunctions, (err, result) => {
                if (err != null) {
                    callback(err);
                    return;
                }

                if (result) {
                    resultRule = rule;
                }

                callback(null);
            });
        }, (err) => {
            callback(err, resultRule);
        });
    }

    /**
     * Finds the all rules with a positive condition expression.
     * The function list takes into account disabled flag and sorted by priority.
     * @param rule the rule to be calculated.
     * @param facts a set of facts (variables) to be passed to condition and action expressions.
     * @param conditionFunctions a set of functions for condition expression. 
     * @param callback a callback that returns the found rules.
     */
    public testAllRules(rules: Rule[], facts: IVariableCollection,
        conditionFunctions: IFunctionCollection,
        callback: (err: any, rules: Rule[]) => void) {

        let resultRules: Rule[] = [];
        
        // Remove all disabled rules
        rules = _.filter(rules, (rule) => !rule.disabled);
        // Sort rules by priority
        rules = _.sortBy(rules, ['priority']);

        async.each(rules, (rule, callback) => {
            this.testRule(rule, facts, conditionFunctions, (err, result) => {
                if (err != null) {
                    callback(err);
                    return;
                }

                if (result) {
                    resultRules.push(rule);
                }

                callback(null);
            });
        }, (err) => {
            callback(err, resultRules);
        });    
    }

    /**
     * Calculates the action expression and returns the result.
     * @param rule the rule to be calculated.
     * @param facts a set of facts (variables) to be passed to condition and action expressions.
     * @param actionFunctions a set of functions for action expression.
     * @param callback a callback that returns the action expression result.
     */
    public actUponRule(rule: Rule, facts: IVariableCollection,
        actionFunctions: IFunctionCollection,
        callback: (err: any, result: any) => void) {

        let allFacts = new FactCollection(facts, rule.params);
        let allFuncs = new CompositeFunctionCollection(actionFunctions);

        let calculator: ExpressionCalculator;
        let result: Variant;

        async.series([
            // Create action expression
            (callback) => {
                this.createCalculator(rule.action, allFacts, allFuncs, (err, calc) => {
                    calculator = calc;
                    callback(err);
                });
            },
            // Calculate action
            (callback) => {
                calculator.evaluateWithVariablesAndFunctions(
                    allFacts, allFuncs, (err, res) => {
                        result = res;
                        callback(err);
                    }
                )
            }
        ], (err) => {
            if (err != null) {
                callback(err, null);
                return;
            }

            callback(null, result);
        });    
    }

    /**
     * Calculates an action expression for all specified rules.
     * The function list takes into account disabled flag and sorted by priority.
     * @param rule the rule to be calculated.
     * @param facts a set of facts (variables) to be passed to condition and action expressions.
     * @param actionFunctions a set of functions for action expression.
     * @param callback a callback that returns executed rules and their action results.
     */
    public actUponAllRules(rules: Rule[], facts: IVariableCollection,
        actionFunctions: IFunctionCollection,
        callback: (err: any, results: any[]) => void) {
        let results: Variant[] = [];

        // Remove all disabled rules
        rules = _.filter(rules, (rule) => !rule.disabled);
        // Sort rules by priority
        rules = _.sortBy(rules, ['priority']);

        async.each(rules, (rule, callback) => {
            this.actUponRule(rule, facts, actionFunctions, (err, result) => {
                if (err == null) {
                    results.push(result);
                }
                callback(err);
            });
        }, (err) => {
            callback(err, results);
        });
    }        
}