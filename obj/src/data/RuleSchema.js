"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
class RuleSchema extends pip_services3_commons_node_1.ObjectSchema {
    constructor() {
        super();
        this.withOptionalProperty('id', pip_services3_commons_node_2.TypeCode.String);
        this.withRequiredProperty('group', pip_services3_commons_node_2.TypeCode.String);
        this.withRequiredProperty('name', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('description', pip_services3_commons_node_2.TypeCode.Map);
        this.withRequiredProperty('priority', pip_services3_commons_node_2.TypeCode.Integer);
        this.withOptionalProperty('params', pip_services3_commons_node_2.TypeCode.Map);
        this.withRequiredProperty('condition', pip_services3_commons_node_2.TypeCode.String);
        this.withRequiredProperty('action', pip_services3_commons_node_2.TypeCode.String);
    }
}
exports.RuleSchema = RuleSchema;
//# sourceMappingURL=RuleSchema.js.map