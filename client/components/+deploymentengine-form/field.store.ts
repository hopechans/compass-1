import {autobind} from "../../utils";
import {KubeObjectStore} from "../../kube-object.store";
import {Field, fieldApi} from "../../api/endpoints";
import {apiManager} from "../../api/api-manager";

@autobind()
export class FieldStore extends KubeObjectStore<Field> {
    api = fieldApi
}

export const fieldStore = new FieldStore();
apiManager.registerStore(fieldApi, fieldStore);
