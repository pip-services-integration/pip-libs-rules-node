import { Variant } from "pip-services3-expressions-node";
import { FunctionCollection } from "pip-services3-expressions-node";
import { DelegatedFunction } from "pip-services3-expressions-node";

import { CompositeFunctionCollection } from "../../src/logic/CompositeFunctionCollection";

const assert = require('chai').assert;

suite('CompositeFunctionCollection', ()=> {

    let testFunc = (stack, operations, callback) => {
        callback(null, new Variant("ABC"));
    }

    test('AddRemoveFunctions', () => {
        let udfFuncs = new FunctionCollection();
        let func1 = new DelegatedFunction("ABC", testFunc);
        udfFuncs.add(func1);
        let func2 = new DelegatedFunction("XYZ", testFunc);
        udfFuncs.add(func2);

        let funcs = new CompositeFunctionCollection(udfFuncs);
        assert.isTrue(funcs.length > 10);

        let index = funcs.findIndexByName("abc");
        assert.equal(0, index);

        let func = funcs.findByName("Xyz");
        assert.equal(func2, func);

        let funcLength = funcs.length;
        funcs.remove(0);
        assert.equal(funcLength - 1, funcs.length);

        funcs.removeByName("XYZ");
        assert.equal(funcLength - 2, funcs.length);
    });    

});