import {autobind} from "../../utils";
import {KubeObjectStore} from "../../kube-object.store";
import {TenantPermission, tenantPermissionApi} from "../../api/endpoints";
import {apiManager} from "../../api/api-manager";

@autobind()
export class TenantPermissionStore extends KubeObjectStore<TenantPermission> {
    api = tenantPermissionApi
}

export const tenantPermissionStore = new TenantPermissionStore();
apiManager.registerStore(tenantPermissionApi, tenantPermissionStore);