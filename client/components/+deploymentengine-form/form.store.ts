import {autobind} from "../../utils";
import {KubeObjectStore} from "../../kube-object.store";
import {Form, formApi} from "../../api/endpoints/form.api";
import {apiManager} from "../../api/api-manager";

@autobind()
export class FormStore extends KubeObjectStore<Form> {
    api = formApi
}

export const formStore = new FormStore();
apiManager.registerStore(formApi, formStore);
