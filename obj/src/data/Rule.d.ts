import { IStringIdentifiable } from 'pip-services3-commons-node';
import { AnyValueMap } from 'pip-services3-commons-node';
export declare class Rule implements IStringIdentifiable {
    id: string;
    group: string;
    name: string;
    description?: string;
    priority: number;
    disabled: boolean;
    params: AnyValueMap;
    condition: string;
    action: string;
}
