"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_expressions_node_1 = require("pip-services3-expressions-node");
/**
 * A composite collection that extends standard functions with user defined ones.
 */
class CompositeFunctionCollection {
    constructor(udfFuncs) {
        this._udfFuncs = udfFuncs;
        this._standardFuncs = new pip_services3_expressions_node_1.DefaultFunctionCollection();
    }
    /**
     * Adds a new function to the collection.
     * @param function a function to be added.
     */
    add(func) {
        this._standardFuncs.add(func);
    }
    /**
     * Gets a number of functions stored in the collection.
     * @returns a number of stored functions.
     */
    get length() {
        let result = this._udfFuncs != null ? this._udfFuncs.length : 0;
        result = result + this._standardFuncs.length;
        return result;
    }
    /**
     * Get a function by its index.
     * @param index a function index.
     * @returns a retrieved function.
     */
    get(index) {
        if (this._udfFuncs != null && index < this._udfFuncs.length) {
            return this._udfFuncs.get(index);
        }
        else {
            index = this._udfFuncs != null ? index - this._udfFuncs.length : index;
            return this._standardFuncs.get(index);
        }
    }
    /**
     * Get all functions stores in the collection
     * @returns a list with functions.
     */
    getAll() {
        let result = [];
        if (this._udfFuncs != null) {
            result.push(...this._udfFuncs.getAll());
        }
        result.push(...this._standardFuncs.getAll());
        return result;
    }
    /**
     * Finds function index in the list by it's name.
     * @param name The function name to be found.
     * @returns Function index in the list or <code>-1</code> if function was not found.
     */
    findIndexByName(name) {
        if (this._udfFuncs != null) {
            let result = this._udfFuncs.findIndexByName(name);
            if (result >= 0)
                return result;
        }
        let result = this._standardFuncs.findIndexByName(name);
        if (result < 0)
            return result;
        result = this._udfFuncs != null ? result + this._udfFuncs.length : result;
    }
    /**
     * Finds function in the list by it's name.
     * @param name The function name to be found.
     * @returns A function or <code>null</code> if function was not found.
     */
    findByName(name) {
        if (this._udfFuncs != null) {
            let result = this._udfFuncs.findByName(name);
            if (result != null)
                return result;
        }
        return this._standardFuncs.findByName(name);
    }
    /**
     * Removes a function by its index.
     * @param index a index of the function to be removed.
     */
    remove(index) {
        if (this._udfFuncs != null && index < this._udfFuncs.length) {
            this._udfFuncs.remove(index);
        }
        else {
            index = this._udfFuncs != null ? index - this._udfFuncs.length : index;
            this._standardFuncs.remove(index);
        }
    }
    /**
     * Removes function by it's name.
     * @param name The function name to be removed.
     */
    removeByName(name) {
        if (this._udfFuncs != null) {
            this._udfFuncs.removeByName(name);
        }
        this._standardFuncs.removeByName(name);
    }
    /**
     * Clears the collection.
     */
    clear() {
        if (this._udfFuncs != null) {
            this._udfFuncs.clear();
        }
        this._standardFuncs.clear();
    }
}
exports.CompositeFunctionCollection = CompositeFunctionCollection;
//# sourceMappingURL=CompositeFunctionCollection.js.map