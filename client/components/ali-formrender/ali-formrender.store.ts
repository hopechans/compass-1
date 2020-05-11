import {autobind, interval} from "../../utils";
import {formRenderApi} from "../../api/endpoints";


@autobind()
export class FormRenderStore {
    api = formRenderApi

    propsSchema = {};
    uiSchema = {};

    constructor(params: { namespace: string, render_name: string }) {
        this.api.getFormRenderSpec(
            {namespace: params.namespace, name: params.render_name}).then((res: any) => this.setSchema(res))
    }

    setSchema(res: any) {
        this.propsSchema = JSON.parse(res.spec.props_schema)
        this.uiSchema = JSON.parse(res.spec.ui_schema)
    }
}
