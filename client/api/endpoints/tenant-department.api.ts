import {apiBase, tenantBase} from "../index";
import {stringify} from "querystring";
import {autobind} from "../../utils";
import {resolve} from "dns";


interface ITenantDepartmentList {
    [x: string]: any;
}

export const tenantDepartmentApi = {
    list() {
        return tenantBase
            .get<ITenantDepartmentList>('/v1/departments')
            .then(data => {
                return data.map(TenantDepartment.create);
                // return Object
                //   .values(data)
                //   .reduce((allData, repoData) => allData.concat(Object.values(repoData)), [])
                //   .map(TetantDepartment.create);
            });
    },

    createApi() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject('')
            }, 2000)
        })
    }
}

@autobind()
export class TenantDepartment {
    constructor(data: any) {
        Object.assign(this, data);
    }

    static create(data: any) {
        return new TenantDepartment(data);
    }

    id: string
    name: string


    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }
}