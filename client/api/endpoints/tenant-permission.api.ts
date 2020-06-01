import {KubeObject} from "../kube-object";
import {KubeApi} from "../kube-api";
import {autobind} from "../../utils";
import {apiTenant} from "../index"

@autobind()
export class TenantPermission extends KubeObject {
    static kind = "BasePermission";

}

export const tenantPermissionApi = new KubeApi({
    kind: TenantPermission.kind,
    apiBase: "/apis/fuxi.nip.io/v1/basepermissions",
    isNamespaced: true,
    objectConstructor: TenantPermission,
    request: apiTenant
});