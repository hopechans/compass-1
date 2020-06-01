import {KubeObject} from "../kube-object";
import {KubeApi} from "../kube-api";
import {autobind} from "../../utils";
import {apiTenant} from "../index";

@autobind()
export class TenantRolePerm extends KubeObject {
    static kind = "BaseRolePerms";
}

export const tenantRolePermApi = new KubeApi({
    kind: TenantRolePerm.kind,
    apiBase: "/apis/fuxi.nip.io/v1/baseroleperms",
    isNamespaced: true,
    objectConstructor: TenantRolePerm,
    request: apiTenant
});