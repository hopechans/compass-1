import { observable,action, autorun,reaction} from "mobx";
import { observer,disposeOnUnmount} from 'mobx-react'
import { autobind } from "../../utils";
import { TenantDepartment, tenantDepartmentApi } from "../../api/endpoints/tenant-department.api";
import { ItemStore } from "../../item.store";
import flatten from "lodash/flatten"

@autobind()
export class DepartmentStore extends ItemStore<TenantDepartment> {

    @observable deptName:string
    @observable dialogType:string
 
    @action
    changeItemName(name:string){
      this.deptName = name
    }

    @action
    changeDialogType(type:string){
      this.dialogType = type
    }

    @action
    clean(){
      setTimeout(()=>{
          this.deptName = ''
          this.dialogType = 'add'
      },1000)
     
    }

    loadAll() {
      return this.loadItems(() => tenantDepartmentApi.list());
    }

    getByName(name: string, repo: string) {
      return this.items.find(item => item.getName() === name);
    }

    async removeSelectedItems(){
      //console.log('---------delete',this.selectedItems)
    }
}


export const departmentStore = new DepartmentStore();
