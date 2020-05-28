import {KubeObject} from "../kube-object";
import {KubeApi} from "../kube-api";
import {autobind} from "../../utils";

@autobind()
export class TenantPermission extends KubeObject {
    static kind = "BasePermission";

}

export const tenantPermissionApi = new KubeApi({
    kind: TenantPermission.kind,
    apiBase: "/base/apis/fuxi.nip.io/v1/basepermissions",
    isNamespaced: true,
    objectConstructor: TenantPermission,
});