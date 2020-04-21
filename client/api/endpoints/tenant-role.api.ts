import { apiBase,tenantBase} from "../index";
import { stringify } from "querystring";
import { autobind } from "../../utils";
import { resolve } from "dns";

interface ITetantRoleList{
    [x: string]: any;
}

export const tetantRoleApi = {
    list() {
        return tenantBase
            .get<ITetantRoleList>('/tenant/role')
            .then(data => {
                return data.map(TetantRole.create);
            });
    },

    createApi(){
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                reject('dasfasd')
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
export class TetantRole{
    constructor(data: any) {
        Object.assign(this, data);
    }

    static create(data: any) {
        return new TetantRole(data);
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