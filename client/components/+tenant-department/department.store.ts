import { observable } from "mobx";
import { autobind } from "../../utils";
import { TetantDepartment, tetantDepartmentApi } from "../../api/endpoints/tenant-department.api";
import { ItemStore } from "../../item.store";
import flatten from "lodash/flatten"

@autobind()
export class TenantDepartmentStore extends ItemStore<TetantDepartment> {
    loadAll() {
      return this.loadItems(() => tetantDepartmentApi.list());
    }

    getByName(name: string, repo: string) {
      return this.items.find(item => item.getName() === name);
    }

    async removeSelectedItems(){
      console.log('---------delete',this.selectedItems)
    }
}


export const tenantDepartmentStore = new TenantDepartmentStore();