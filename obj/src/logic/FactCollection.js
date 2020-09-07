"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_expressions_node_1 = require("pip-services3-expressions-node");
const pip_services3_expressions_node_2 = require("pip-services3-expressions-node");
const pip_services3_expressions_node_3 = require("pip-services3-expressions-node");
/**
 * Fact collection combines fact variables with rule parameters
 * that are exposed as variables.
 */
class FactCollection {
    constructor(variables, parameters) {
        // Define variables
        this._variables = variables || new pip_services3_expressions_node_3.VariableCollection();
        // Define parameters
        this._parameters = new pip_services3_expressions_node_3.VariableCollection();
        if (parameters != null) {
            for (let name of parameters.getKeys()) {
                let value = parameters.get(name);
                let variable = new pip_services3_expressions_node_1.Variable(name, new pip_services3_expressions_node_2.Variant(value));
                this._parameters.add(variable);
            }
        }
    }
    /**
     * Adds a new variable to the collection.
     * @param variable a variable to be added.
     */
    add(variable) {
        // Create variable in facts
        this._variables.add(variable);
    }
    /**
     * Gets a number of variables stored in the collection.
     * @returns a number of stored variables.
     */
    get length() {
        return this._variables.length + this._parameters.length;
    }
    /**
     * Get a variable by its index.
     * @param index a variable index.
     * @returns a retrieved variable.
     */
    get(index) {
        if (index < this._variables.length) {
            return this._variables.get(index);
        }
        else {
            index = index - this._variables.length;
            return this._parameters.get(index);
        }
    }
    /**
     * Get all variables stores in the collection
     * @returns a list with variables.
     */
    getAll() {
        let result = [];
        result.push(...this._variables.getAll());
        result.push(...this._parameters.getAll());
        return result;
    }
    /**
     * Finds variable index in the list by it's name.
     * @param name The variable name to be found.
     * @returns Variable index in the list or <code>-1</code> if variable was not found.
     */
    findIndexByName(name) {
        let result = this._variables.findIndexByName(name);
        if (result >= 0)
            return result;
        result = this._parameters.findIndexByName(name);
        if (result > 0)
            return result + this._variables.length;
        return -1;
    }
    /**
     * Finds variable in the list by it's name.
     * @param name The variable name to be found.
     * @returns A variable or <code>null</code> if function was not found.
     */
    findByName(name) {
        let result = this._variables.findByName(name);
        if (result != null)
            return result;
        result = this._parameters.findByName(name);
        return result;
    }
    /**
     * Finds variable in the list or create a new one if variable was not found.
     * @param name The variable name to be found.
     * @returns Found or created variable.
     */
    locate(name) {
        let result = this.findByName(name);
        if (result != null)
            return result;
        // Otherwise create variable in facts
        return this._variables.locate(name);
    }
    /**
     * Removes a variable by its index.
     * @param index a index of the variable to be removed.
     */
    remove(index) {
        if (index < this._variables.length) {
            this._variables.remove(index);
        }
        else {
            this._parameters.remove(index - this._variables.length);
        }
    }
    /**
     * Removes variable by it's name.
     * @param name The variable name to be removed.
     */
    removeByName(name) {
        this._variables.removeByName(name);
        this._parameters.removeByName(name);
    }
    /**
     * Clears the collection.
     */
    clear() {
        this._variables.clear();
        this._parameters.clear();
    }
    /**
     * Clears all stored variables (assigns null values).
     */
    clearValues() {
        this._variables.clearValues();
        this._parameters.clearValues();
    }
}
exports.FactCollection = FactCollection;
//# sourceMappingURL=FactCollection.js.map