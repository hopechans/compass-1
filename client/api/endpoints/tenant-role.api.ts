import { apiBase,tenantBase} from "../index";
import { stringify } from "querystring";
import { autobind } from "../../utils";
import { resolve } from "dns";

interface ITenantRoleList{
    [x: string]: any;
}

export const tenantRoleApi = {
    list() {
        return tenantBase
            .get<ITenantRoleList>('/tenant/role')
            .then(data => {
                return data.map(TenantRole.create);
            });
    },

    createApi(){
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                reject('')
            },2000)
        })
    },

    getPermissionsList(){
        return tenantBase
        .get<any>('/tenant/permissions')
        .then(data => {
            return data
        });
    }
}

@autobind()
export class TenantRole{
    constructor(data: any) {
        Object.assign(this, data);
    }

    static create(data: any) {
        return new TenantRole(data);
    }

    id:string
    name:string
    permissions:Array<any>

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getPermissions() {
        return this.permissions;
    }
}