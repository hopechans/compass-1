import { observable,action, autorun,reaction} from "mobx";
import { observer,disposeOnUnmount} from 'mobx-react'
import { autobind } from "../../utils";
import { TetantRole, tetantRoleApi } from "../../api/endpoints/tenant-role.api";
import { ItemStore } from "../../item.store";
import flatten from "lodash/flatten"

@autobind()
export class RoleStore extends ItemStore<TetantRole> {

    @observable roleName:string
    @observable dialogType:string
 
    @action
    changeItemName(name:string){
      this.roleName = name
    }

    @action
    changeDialogType(type:string){
      this.dialogType = type
    }

    @action
    clean(){
      setTimeout(()=>{
        this.roleName = ''
        this.dialogType = 'add'
      },1000)
    }

    loadAll() {
      return this.loadItems(() => tetantRoleApi.list());
    }

    getByName(name: string, repo: string) {
      return this.items.find(item => item.getName() === name);
    }

    async removeSelectedItems(){
      console.log('---------delete',this.selectedItems)
    }
}


export const roleStore = new RoleStore();
