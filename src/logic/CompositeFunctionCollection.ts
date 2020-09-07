import { IFunction } from "pip-services3-expressions-node";
import { IFunctionCollection } from "pip-services3-expressions-node";
import { DefaultFunctionCollection } from "pip-services3-expressions-node";

/**
 * A composite collection that extends standard functions with user defined ones.
 */
export class CompositeFunctionCollection implements IFunctionCollection {
    private _udfFuncs: IFunctionCollection;
    private _standardFuncs: DefaultFunctionCollection;

    public constructor(udfFuncs: IFunctionCollection) {
        this._udfFuncs = udfFuncs;
        this._standardFuncs = new DefaultFunctionCollection();
    }

    /**
     * Adds a new function to the collection.
     * @param function a function to be added.
     */
    public add(func: IFunction): void {
        this._standardFuncs.add(func);
    }

    /**
     * Gets a number of functions stored in the collection.
     * @returns a number of stored functions.
     */
    public get length(): number {
        let result = this._udfFuncs != null ? this._udfFuncs.length : 0;
        result = result + this._standardFuncs.length;
        return result;
    }

    /**
     * Get a function by its index.
     * @param index a function index.
     * @returns a retrieved function.
     */
    public get(index: number): IFunction {
        if (this._udfFuncs != null && index < this._udfFuncs.length) {
            return this._udfFuncs.get(index);
        } else {
            index = this._udfFuncs != null ? index - this._udfFuncs.length : index;
            return this._standardFuncs.get(index);
        }
    }

    /**
     * Get all functions stores in the collection
     * @returns a list with functions.
     */
    public getAll(): IFunction[] {
        let result: IFunction[] = [];
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
    public findIndexByName(name: string): number {
        if (this._udfFuncs != null) {
            let result = this._udfFuncs.findIndexByName(name);
            if (result >= 0) return result;
        }

        let result = this._standardFuncs.findIndexByName(name);
        if (result < 0) return result;

        result = this._udfFuncs != null ? result + this._udfFuncs.length : result;
    }

    /**
     * Finds function in the list by it's name.
     * @param name The function name to be found.
     * @returns A function or <code>null</code> if function was not found.
     */
    public findByName(name: string): IFunction {
        if (this._udfFuncs != null) {
            let result = this._udfFuncs.findByName(name);
            if (result != null) return result;
        }

        return this._standardFuncs.findByName(name);
    }

    /**
     * Removes a function by its index.
     * @param index a index of the function to be removed.
     */
    public remove(index: number): void {
        if (this._udfFuncs != null && index < this._udfFuncs.length) {
            this._udfFuncs.remove(index);
        } else {
            index = this._udfFuncs != null ? index - this._udfFuncs.length : index;
            this._standardFuncs.remove(index);
        }
    }

    /**
     * Removes function by it's name.
     * @param name The function name to be removed.
     */
    public removeByName(name: string): void {
        if (this._udfFuncs != null) {
            this._udfFuncs.removeByName(name);
        }
        this._standardFuncs.removeByName(name);
    }

    /**
     * Clears the collection.
     */
    public clear(): void {
        if (this._udfFuncs != null) {
            this._udfFuncs.clear();
        }
        this._standardFuncs.clear();
    }
}