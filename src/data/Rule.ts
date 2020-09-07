let _ = require('lodash');

import { IStringIdentifiable } from 'pip-services3-commons-node';
import { AnyValueMap } from 'pip-services3-commons-node';

export class Rule implements IStringIdentifiable {
    public id: string;
    public group: string;
    public name: string;
    public description?: string;
    public priority: number;
    public disabled: boolean;
    public params: AnyValueMap;
    public condition: string;
    public action: string;
}