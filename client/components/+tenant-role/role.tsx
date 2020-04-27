
import './role.scss'
import * as React from 'react'
import { observer } from "mobx-react";
import { Trans } from "@lingui/macro";
import { RouteComponentProps } from "react-router";
import { cssNames, stopPropagation } from "../../utils";
import { getDetailsUrl,getDetails } from "../../navigation";
import { apiManager } from "../../api/api-manager";
import { roleStore } from "./role.store";
import { TenantRole } from "../../api/endpoints/tenant-role.api";
import { RoleMenu } from './role-menu'
import { computed } from "mobx";
import { ItemListLayout, ItemListLayoutProps } from "../item-object-list/item-list-layout";
import { navigation } from "../../navigation";
import { tenantDepartmentURL } from '../+tenant';
import { AddRoleDialog } from './role-dialog-add'
import { RoleDeatil } from './role-detail'
import { permissionsStore} from './role.store.premission'
interface IDepartmentRouteProps{
    id:string
    name:string
}

export interface DepartmentProps extends RouteComponentProps<IDepartmentRouteProps>{
    store: TenantRole;
}
enum sortBy {
    name = "name",
}

@observer
export class Role extends React.Component<DepartmentProps>{

    constructor(props:any){
        super(props)
    }

    componentDidMount() {
        permissionsStore.loadAll()
    }

    get selectedRole() {
        const paramsDetail = getDetails()
        return roleStore.items.find(item => {
            if(item.getId() == paramsDetail){
                permissionsStore.changeCurPermission(item.getPermissions())
                return true
            }
        });
    }

    fetchList(){
        permissionsStore.loadAll()
    }

    hideDetails = () => {
        this.showDetails(null);
    }

    showDetails = (item: TenantRole) => {
        if (!item) {
            navigation.searchParams.merge({
                details:null
            })
        }
        else {
          navigation.searchParams.merge({
              details: item.getId(),
          })
        }
    }
    render(){
        return(
            <>
               <ItemListLayout
                    className="tetantRole"
                    store={roleStore}
                    isClusterScoped={true}
                    isSelectable={true}
                    sortingCallbacks={{
                        [sortBy.name]: (item: TenantRole) => item.getName(),
                    }}
                    searchFilters={[
                        (item: TenantRole) => item.getName(),
                        (item: TenantRole) => item.getId(),
                   
                    ]}
                    renderHeaderTitle={<Trans>Role Manager</Trans>}
                    renderTableHeader={[
                        { title: <Trans>ID</Trans>, className: "id" },
                        { title: <Trans>name</Trans>, className: "name", sortBy:sortBy.name},

                    ]}
                    renderTableContents={(item: TenantRole) => [
                        item.getId(),
                        item.getName(),
                    ]}
                    renderItemMenu={(item: TenantRole) => {
                        return <RoleMenu object={item}/>
                    }}
                    addRemoveButtons={{
                        onAdd: () => AddRoleDialog.open(),
                        addTooltip: <Trans>Create new department</Trans>
                    }}
                    detailsItem={this.selectedRole}
                    onDetails={this.showDetails}
                />
                <AddRoleDialog/>
                <RoleDeatil
                    selectItem={this.selectedRole}
                    hideDetails={this.hideDetails}
                >
                </RoleDeatil>
            </>
        )
    }
}


