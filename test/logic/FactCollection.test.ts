import { VariableCollection, Variable } from "pip-services3-expressions-node";
import { AnyValueMap } from "pip-services3-commons-node";

import { FactCollection } from "../../src/logic/FactCollection";

const assert = require('chai').assert;


suite('FactCollection', ()=> {

    test('AddRemoveVariables', () => {
        let vars = new VariableCollection();
        let var1 = new Variable("Var1");
        vars.add(var1);
        let var2 = new Variable("Var2");
        vars.add(var2);

        let params = AnyValueMap.fromTuples(
            "param1", "ABC",
            "param2", "XYZ"
        )

        let facts = new FactCollection(vars, params);
        assert.equal(4, facts.length);

        let index = facts.findIndexByName("var1");
        assert.equal(0, index);

        let v = facts.findByName("var2");
        assert.equal(var2, v);

        let var3 = facts.locate("var3");
        assert.isDefined(var3);
        assert.equal("var3", var3.name);
        assert.equal(5, facts.length);

        facts.remove(0);
        assert.equal(4, facts.length);

        facts.removeByName("var3");
        assert.equal(3, facts.length);
    });    

});