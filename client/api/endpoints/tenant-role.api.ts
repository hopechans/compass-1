import {KubeObject} from "../kube-object";
import {KubeApi} from "../kube-api";
import {autobind} from "../../utils";

@autobind()
export class TenantRole extends KubeObject {
    static kind = "BaseRoles";
}

export const tenantRoleApi = new KubeApi({
    kind: TenantRole.kind,
    apiBase: "/base/apis/fuxi.nip.io/v1/baseroles",
    isNamespaced: true,
    objectConstructor: TenantRole,
});

