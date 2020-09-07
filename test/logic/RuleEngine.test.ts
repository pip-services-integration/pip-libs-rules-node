const async = require('async');

import { IVariableCollection, DelegatedFunction} from "pip-services3-expressions-node";
import { VariableCollection} from "pip-services3-expressions-node";
import { IFunctionCollection} from "pip-services3-expressions-node";
import { FunctionCollection} from "pip-services3-expressions-node";
import { Variable } from "pip-services3-expressions-node";
import { Variant } from "pip-services3-expressions-node";

import { Rule } from "../../src/data/Rule";
import { RulePriority } from "../../src/data/RulePriority";
import { RuleEngine } from "../../src/logic/RuleEngine";

const assert = require('chai').assert;


suite('RuleEngine', ()=> {
    let RULE1: Rule = {
        id: '1',
        name: 'Test rule 1',
        group: 'test',
        priority: RulePriority.Low,
        disabled: false,
        description: 'A test rule',
        condition: 'A > B',
        action: 'TEST(1)',
        params: null
    };
    let RULE2: Rule = {
        id: '2',
        name: 'Test rule 2',
        group: 'test',
        priority: RulePriority.Medium,
        disabled: true,
        description: 'A test rule',
        condition: 'TRUE',
        action: 'TEST(2)',
        params: null
    };
    let RULE3: Rule = {
        id: '3',
        name: 'Test rule 3',
        group: 'test',
        priority: RulePriority.High,
        disabled: false,
        description: 'A test rule',
        condition: 'A <> B',
        action: 'TEST(3)',
        params: null
    };
    let RULES: Rule[] = [RULE1, RULE2, RULE3];

    function createFacts(): IVariableCollection {
        let facts = new VariableCollection();
        facts.add(new Variable("A", Variant.fromInteger(1)));
        facts.add(new Variable("B", Variant.fromInteger(2)));
        return facts;
    }

    let testFunc = (params, operations, callback) => {
        let result = params[0];
        callback(null, result);
    }

    function createFunctions(): IFunctionCollection {
        let funcs = new FunctionCollection();
        funcs.add(new DelegatedFunction("Test", testFunc));
        return funcs;
    }

    test('VerifyRule', (done) => {
        let engine = new RuleEngine();
        let facts = createFacts();
        let funcs = createFunctions();

        engine.verifyRule(RULE1, facts, funcs, funcs, (err) => {
            assert.isNull(err);
            done();
        });
    });    

    test('TestRule', (done) => {
        let engine = new RuleEngine();
        let facts = createFacts();
        let funcs = createFunctions();

        async.series([
            (callback) => {
                engine.testRule(RULE1, facts, funcs, (err, result) => {
                    assert.isNull(err);
                    assert.isFalse(result);

                    callback();
                });
            },
            (callback) => {
                engine.testRule(RULE2, facts, funcs, (err, result) => {
                    assert.isNull(err);
                    assert.isTrue(result);

                    callback();
                });
            },
            (callback) => {
                engine.testRule(RULE3, facts, funcs, (err, result) => {
                    assert.isNull(err);
                    assert.isTrue(result);

                    callback();
                });
            }
        ], done);
    });    

    test('TestFirstRule', (done) => {
        let engine = new RuleEngine();
        let facts = createFacts();
        let funcs = createFunctions();

        engine.testFirstRule(RULES, facts, funcs, (err, rule) => {
            assert.isNull(err);
            assert.equal(RULE3, rule);

            done();
        });
    });            

    test('TestAllRules', (done) => {
        let engine = new RuleEngine();
        let facts = createFacts();
        let funcs = createFunctions();

        engine.testAllRules(RULES, facts, funcs, (err, rules) => {
            assert.isNull(err);
            assert.equal(1, rules.length);
            assert.equal(RULE3, rules[0]);

            done();
        });
    });            

    test('ActUponRule', (done) => {
        let engine = new RuleEngine();
        let facts = createFacts();
        let funcs = createFunctions();

        engine.actUponRule(RULE2, facts, funcs, (err, result) => {
            assert.isNull(err);
            assert.equal(2, result.asInteger);

            done();
        });
    });            

    test('ActUponAllRules', (done) => {
        let engine = new RuleEngine();
        let facts = createFacts();
        let funcs = createFunctions();

        engine.actUponAllRules(RULES, facts, funcs, (err, results) => {
            assert.isNull(err);
            assert.equal(2, results.length);
            assert.equal(3, results[0].asInteger);
            assert.equal(1, results[1].asInteger);

            done();
        });
    });            

});