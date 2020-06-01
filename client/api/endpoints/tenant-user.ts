import {KubeObject} from "../kube-object";
import {KubeApi} from "../kube-api";
import {autobind} from "../../utils";
import {apiTenant} from "../index";

@autobind()
export class TenantUser extends KubeObject {
    static kind = "BaseUsers";

}

export const tenantUserApi = new KubeApi({
    kind: TenantUser.kind,
    apiBase: "/base/apis/fuxi.nip.io/v1/baseusers",
    isNamespaced: true,
    objectConstructor: TenantUser,
    request: apiTenant
});