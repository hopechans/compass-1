import {KubeObject} from "../kube-object";
import {KubeApi} from "../kube-api";
import {autobind} from "../../utils";
import {apiTenant} from "../index";

@autobind()
export class TenantRole extends KubeObject {
    static kind = "BaseRoles";
}

export const tenantRoleApi = new KubeApi({
    kind: TenantRole.kind,
    apiBase: "/apis/fuxi.nip.io/v1/baseroles",
    isNamespaced: true,
    objectConstructor: TenantRole,
    request: apiTenant
});

