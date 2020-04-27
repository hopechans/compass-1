import { observable,action, autorun,reaction} from "mobx";
import { observer,disposeOnUnmount} from 'mobx-react'
import { autobind } from "../../utils";
import { TenantMember,tenantMemberApi } from "../../api/endpoints/tenant-member.api";
import { ItemStore } from "../../item.store";


@autobind()
export class MemberStore extends ItemStore<TenantMember> {

    @observable name:string
    @observable dialogType:string
 
    @action
    changeItemName(name:string){
      this.name = name
    }

    @action
    changeDialogType(type:string){
      this.dialogType = type
    }

    @action
    clean(){
      setTimeout(()=>{
        this.name = ''
        this.dialogType = 'add'
      },1000)
    }

    loadAll() {
      return this.loadItems(() => tenantMemberApi.list());
    }

    getByName(name: string, repo: string) {
      return this.items.find(item => item.getName() === name);
    }

    async removeSelectedItems(){
      console.log('---------delete',this.selectedItems)
    }
}


export const memberStore = new MemberStore();
