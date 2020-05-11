import {autobind, interval} from "../../utils";
import {FormRender, formRenderApi} from "../../api/endpoints";
import {KubeObjectStore} from "../../kube-object.store";

@autobind()
export class FormRenderStore extends KubeObjectStore{
    api = formRenderApi

    constructor() {
        super();
        this.load()
    }

    private namespace = "kube-system";
    private render_name = "example-formrender";

    public propsSchema = {};
    public uiSchema = {};

    setSchema(res: any){
        this.propsSchema = JSON.parse(res.spec.props_schema)
        this.uiSchema = JSON.parse(res.spec.ui_schema)
    }

    load () {
        return this.api.getFormRenderSpec(
            {namespace: this.namespace, name: this.render_name}
            ).then((res: any) => this.setSchema(res))
    }

}

export const formRenderStore = new FormRenderStore();
