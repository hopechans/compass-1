import {autobind} from "../../utils";
import {KubeObjectStore} from "../../kube-object.store";
import {TenantRole, tenantRoleApi} from "../../api/endpoints";
import {apiManager} from "../../api/api-manager";

@autobind()
export class TenantDepartmentStore extends KubeObjectStore<TenantRole> {
    api = tenantRoleApi
}

export const tenantDepartmentStore = new TenantDepartmentStore();
apiManager.registerStore(tenantRoleApi, tenantDepartmentStore);