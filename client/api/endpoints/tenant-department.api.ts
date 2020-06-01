import {KubeObject} from "../kube-object";
import {KubeApi} from "../kube-api";
import {autobind} from "../../utils";
import {apiTenant} from "../index"

@autobind()
export class TenantDepartment extends KubeObject {
    static kind = "BaseDepartment";

}

export const tenantDepartmentApi = new KubeApi({
    kind: TenantDepartment.kind,
    apiBase: "/apis/fuxi.nip.io/v1/basedepartments",
    isNamespaced: true,
    objectConstructor: TenantDepartment,
    request: apiTenant
});
