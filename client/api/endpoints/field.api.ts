import {KubeObject} from "../kube-object";
import {KubeApi} from "../kube-api";
import {autobind} from "../../utils";


export interface SelectStore {
    key?: string
    value?: string
}

export interface FormDataConfig {
    name?: string
    description?: string
    // For String
    select?: SelectStore[]
    // For Number
    min?: number
    // For Number
    max?: number
    // For Bool
    default?: boolean
    "ui:widget"?: string
    prefix?: string
    suffix?: string
}

export interface LooseObject {
    [key: string]: any
}

@autobind()
export class Field extends KubeObject {
    static kind = "Field";

    spec: {
        field_type: string;
        form_data_config: FormDataConfig;
        props_schema: LooseObject;
    }
}

export const fieldApi = new KubeApi({
    kind: Field.kind,
    apiBase: "/apis/fuxi.nip.io/v1/fields",
    isNamespaced: true,
    objectConstructor: Field,
});
