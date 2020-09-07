"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const async = require('async');
const _ = require('lodash');
const pip_services3_expressions_node_1 = require("pip-services3-expressions-node");
const pip_services3_expressions_node_2 = require("pip-services3-expressions-node");
const pip_services3_expressions_node_3 = require("pip-services3-expressions-node");
const pip_services3_expressions_node_4 = require("pip-services3-expressions-node");
const FactCollection_1 = require("./FactCollection");
const CompositeFunctionCollection_1 = require("./CompositeFunctionCollection");
class RuleEngine {
    cacheRules(rules) {
        // Todo...
    }
    findInCache(expression) {
        // Todo...
        return null;
    }
    clearCache() {
        // Todo...
    }
    checkVariablesAndFunctions(calculator, facts, funcs) {
        for (let token of calculator.resultTokens) {
            // Check fact variable
            if (token.type == pip_services3_expressions_node_3.ExpressionTokenType.Variable) {
                let factName = token.value.asString;
                if (facts.findByName(factName) == null) {
                    throw new pip_services3_expressions_node_4.ExpressionException(null, "VAR_NOT_FOUND", "Fact variable was not found.");
                }
            }
            // Check function
            if (token.type == pip_services3_expressions_node_3.ExpressionTokenType.Function) {
                let funcName = token.value.asString;
                if (funcs.findByName(funcName) == null) {
                    throw new pip_services3_expressions_node_4.ExpressionException(null, "FUNC_NOT_FOUND", "Function was not found.");
                }
            }
        }
    }
    createCalculator(expression, facts, funcs, callback) {
        let calculator;
        try {
            calculator = this.findInCache(expression);
            if (calculator == null) {
                calculator = new pip_services3_expressions_node_2.ExpressionCalculator();
                calculator.expression = expression;
            }
            this.checkVariablesAndFunctions(calculator, facts, funcs);
        }
        catch (err) {
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
    verifyRule(rule, facts, conditionFunctions, actionFunctions, callback) {
        let allFacts = new FactCollection_1.FactCollection(facts, rule.params);
        let allConditionFuncs = new CompositeFunctionCollection_1.CompositeFunctionCollection(conditionFunctions);
        let allActionFuncs = new CompositeFunctionCollection_1.CompositeFunctionCollection(actionFunctions);
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
    testRule(rule, facts, conditionFunctions, callback) {
        let allFacts = new FactCollection_1.FactCollection(facts, rule.params);
        let allFuncs = new CompositeFunctionCollection_1.CompositeFunctionCollection(conditionFunctions);
        let calculator;
        let result;
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
                calculator.evaluateWithVariablesAndFunctions(allFacts, allFuncs, (err, res) => {
                    result = res;
                    callback(err);
                });
            }
        ], (err) => {
            if (err != null) {
                callback(err, null);
                return;
            }
            if (result.type != pip_services3_expressions_node_1.VariantType.Boolean) {
                err = new pip_services3_expressions_node_4.ExpressionException(null, "WRONG_RESULT_TYPE", "Expected boolean result in condition expression");
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
    testFirstRule(rules, facts, conditionFunctions, callback) {
        let resultRule = null;
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
    testAllRules(rules, facts, conditionFunctions, callback) {
        let resultRules = [];
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
    actUponRule(rule, facts, actionFunctions, callback) {
        let allFacts = new FactCollection_1.FactCollection(facts, rule.params);
        let allFuncs = new CompositeFunctionCollection_1.CompositeFunctionCollection(actionFunctions);
        let calculator;
        let result;
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
                calculator.evaluateWithVariablesAndFunctions(allFacts, allFuncs, (err, res) => {
                    result = res;
                    callback(err);
                });
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
    actUponAllRules(rules, facts, actionFunctions, callback) {
        let results = [];
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
exports.RuleEngine = RuleEngine;
//# sourceMappingURL=RuleEngine.js.map