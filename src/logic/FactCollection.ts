import { IVariableCollection } from "pip-services3-expressions-node";
import { Variable } from "pip-services3-expressions-node";
import { Variant } from "pip-services3-expressions-node";
import { IVariable } from "pip-services3-expressions-node";
import { VariableCollection } from "pip-services3-expressions-node";
import { AnyValueMap } from "pip-services3-commons-node";

/**
 * Fact collection combines fact variables with rule parameters
 * that are exposed as variables.
 */
export class FactCollection implements IVariableCollection {
    private _variables: IVariableCollection;
    private _parameters: VariableCollection;

    public constructor(variables: IVariableCollection, parameters: AnyValueMap) {
        // Define variables
        this._variables = variables || new VariableCollection();

        // Define parameters
        this._parameters = new VariableCollection();
        if (parameters != null) {
            for (let name of parameters.getKeys()) {
                let value = parameters.get(name);
                let variable = new Variable(name, new Variant(value));
                this._parameters.add(variable);
            }
        }
    }

    /**
     * Adds a new variable to the collection.
     * @param variable a variable to be added.
     */
    public add(variable: IVariable): void {
        // Create variable in facts
        this._variables.add(variable);
    }

    /**
     * Gets a number of variables stored in the collection.
     * @returns a number of stored variables.
     */
    public get length(): number {
        return this._variables.length + this._parameters.length;
    }

    /**
     * Get a variable by its index.
     * @param index a variable index.
     * @returns a retrieved variable.
     */
    public get(index: number): IVariable {
        if (index < this._variables.length) {
            return this._variables.get(index);
        } else {
            index = index - this._variables.length;
            return this._parameters.get(index);
        }
    }

    /**
     * Get all variables stores in the collection
     * @returns a list with variables.
     */
    public getAll(): IVariable[] {
        let result: IVariable[] = [];
        result.push(...this._variables.getAll());
        result.push(...this._parameters.getAll());
        return result;
    }

    /**
     * Finds variable index in the list by it's name. 
     * @param name The variable name to be found.
     * @returns Variable index in the list or <code>-1</code> if variable was not found.
     */
    public findIndexByName(name: string): number {
        let result = this._variables.findIndexByName(name);
        if (result >= 0) return result;

        result = this._parameters.findIndexByName(name);
        if (result > 0) return result + this._variables.length;

        return -1;
    }

    /**
     * Finds variable in the list by it's name.
     * @param name The variable name to be found.
     * @returns A variable or <code>null</code> if function was not found.
     */
    public findByName(name: string): IVariable {
        let result = this._variables.findByName(name);
        if (result != null) return result;

        result = this._parameters.findByName(name);
        return result;
    }

    /**
     * Finds variable in the list or create a new one if variable was not found.
     * @param name The variable name to be found.
     * @returns Found or created variable.
     */
    public locate(name: string): IVariable {
        let result = this.findByName(name);
        if (result != null) return result;

        // Otherwise create variable in facts
        return this._variables.locate(name);
    }

    /**
     * Removes a variable by its index.
     * @param index a index of the variable to be removed.
     */
    public remove(index: number): void {
        if (index < this._variables.length) {
            this._variables.remove(index);
        } else {
            this._parameters.remove(index - this._variables.length);
        }
    }

    /**
     * Removes variable by it's name.
     * @param name The variable name to be removed.
     */
    public removeByName(name: string): void {
        this._variables.removeByName(name);
        this._parameters.removeByName(name);
    }

    /**
     * Clears the collection.
     */
    public clear(): void {
        this._variables.clear();
        this._parameters.clear();
    }

    /**
     * Clears all stored variables (assigns null values).
     */
    public clearValues(): void {
        this._variables.clearValues();
        this._parameters.clearValues();
    }
}