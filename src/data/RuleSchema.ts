import { ObjectSchema } from 'pip-services3-commons-node';
import { ArraySchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';

export class RuleSchema extends ObjectSchema {
    public constructor() {
        super();
        this.withOptionalProperty('id', TypeCode.String);
        this.withRequiredProperty('group', TypeCode.String);
        this.withRequiredProperty('name', TypeCode.String);
        this.withOptionalProperty('description', TypeCode.Map);
        this.withRequiredProperty('priority', TypeCode.Integer);
        this.withOptionalProperty('params', TypeCode.Map);
        this.withRequiredProperty('condition', TypeCode.String);
        this.withRequiredProperty('action', TypeCode.String);
    }
}
