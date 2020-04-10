import { apiBase,tenantBase} from "../index";
import { stringify } from "querystring";
import { autobind } from "../../utils";


interface ITetantDepartmentList{
    [x: string]: any;

}

export const tetantDepartmentApi = {
    list() {
        return tenantBase
            .get<ITetantDepartmentList>('/tenant/obj')
            .then(data => {
                console.log(data)
                return data.map(TetantDepartment.create);
            // return Object
            //   .values(data)
            //   .reduce((allData, repoData) => allData.concat(Object.values(repoData)), [])
            //   .map(TetantDepartment.create);
            });
        },
}

@autobind()
export class TetantDepartment{
    constructor(data: any) {
        Object.assign(this, data);
    }

    static create(data: any) {
        return new TetantDepartment(data);
    }


    id:string
    name:string

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }
    

}