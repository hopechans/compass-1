import { apiBase,tenantBase} from "../index";
import { stringify } from "querystring";
import { autobind } from "../../utils";
import { resolve } from "dns";

interface ITetantMemberList{
    [x: string]: any;
}

export const tetantMemberApi = {
    list() {
        return tenantBase
            .get<ITetantMemberList>('/tenant/member')
            .then(data => {
                return data.map(TetantMember.create);
            });
    },

    createApi(){
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                reject('dasfasd')
            },2000)
        })
    },

}

@autobind()
export class TetantMember{
    constructor(data: any) {
        Object.assign(this, data);
    }

    static create(data: any) {
        return new TetantMember(data);
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