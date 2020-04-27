import {observable, action, computed, autorun, reaction, when} from "mobx";
import {observer, disposeOnUnmount} from 'mobx-react'
import {autobind} from "../../utils";
import {TenantRole, tenantRoleApi} from "../../api/endpoints/tenant-role.api";
import {ItemStore} from "../../item.store";
import flatten from "lodash/flatten"

@autobind()
export class RolePermissionStore {

    @observable allItem: Array<any> = []
    @observable curItem: Array<any> = []
    @observable isLoading = false;
    @observable isLoaded = false;


    @action
    changeAllPermission(data: Array<any>) {
        this.allItem = data
    }

    @action
    changeCurPermission(data: Array<any>) {
        this.curItem = data
    }

    @action
    clean() {
        this.allItem = []
    }

    async loadAll() {
        if (true) {
            await when(() => !this.isLoading);
            this.isLoading = true;
            try {
                let items = await tenantRoleApi.getPermissionsList();
                this.changeAllPermission(items)
                this.isLoaded = true;
            } finally {
                this.isLoading = false;
            }

        }
    }
}


export const permissionsStore = new RolePermissionStore();
