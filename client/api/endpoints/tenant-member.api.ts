import { apiBase,tenantBase} from "../index";
import { stringify } from "querystring";
import { autobind } from "../../utils";
import { resolve } from "dns";

interface ITenantMemberList{
    [x: string]: any;
}

export const tenantMemberApi = {
    list() {
        return tenantBase
            .get<ITenantMemberList>('/tenant/member')
            .then(data => {
                return data.map(TenantMember.create);
            });
    },

    createApi(){
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                reject('')
            },2000)
        })
    },
}

@autobind()
export class TenantMember{
    constructor(data: any) {
        Object.assign(this, data);
    }

    static create(data: any) {
        return new TenantMember(data);
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
}