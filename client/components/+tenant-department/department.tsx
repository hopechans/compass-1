
import './department.scss'
import * as React from 'react'
import { observer } from "mobx-react";
import { Trans } from "@lingui/macro";
import { RouteComponentProps } from "react-router";
import { cssNames, stopPropagation } from "../../utils";
import { getDetailsUrl,getDetails } from "../../navigation";
import { apiManager } from "../../api/api-manager";
import { departmentStore } from "./department.store";
import { TenantDepartment } from "../../api/endpoints/tenant-department.api";
import { DepartmentMenu } from './department-menu'
import { computed } from "mobx";
import { ItemListLayout, ItemListLayoutProps } from "../item-object-list/item-list-layout";
import { AddDepartmentDialog } from './department-dialog-add'
import { DepartmentDeatil } from './department-detail'
import { navigation } from "../../navigation";
import { tenantDepartmentURL } from '../+tenant';


interface IDepartmentRouteProps{
    id:string
    name:string
}

export interface DepartmentProps extends RouteComponentProps<IDepartmentRouteProps>{
    store: TenantDepartment;
}
enum sortBy {
    name = "name",
}

@observer
export class Department extends React.Component<DepartmentProps>{

    constructor(props:any){
        super(props)
    }

    componentDidMount() {
    }

    get selectedDepartment() {
        const paramsDetail = getDetails()
        return departmentStore.items.find(department => {
            return department.getId() == paramsDetail ;
         });
    }

    hideDetails = () => {
        this.showDetails(null);
    }

    showDetails = (item: TenantDepartment) => {
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
                    className="tetantDepartment"
                    store={departmentStore}
                    isClusterScoped={true}
                    isSelectable={true}
                    sortingCallbacks={{
                        [sortBy.name]: (item: TenantDepartment) => item.getName(),
                    }}
                    searchFilters={[
                        (item: TenantDepartment) => item.getName(),
                        (item: TenantDepartment) => item.getId(),
                   
                    ]}
                    renderHeaderTitle={<Trans>Department Manager</Trans>}
                    renderTableHeader={[
                        { title: <Trans>ID</Trans>, className: "id" },
                        { title: <Trans>name</Trans>, className: "name", sortBy:sortBy.name},

                    ]}
                    renderTableContents={(item: TenantDepartment) => [
                        item.getId(),
                        item.getName(),
                    ]}
                    renderItemMenu={(item: TenantDepartment) => {
                        return <DepartmentMenu object={item}/>
                    }}
                    addRemoveButtons={{
                        onAdd: () => AddDepartmentDialog.open(),
                        addTooltip: <Trans>Create new department</Trans>
                    }}
                    detailsItem={this.selectedDepartment}
                    onDetails={this.showDetails}
                />
                <AddDepartmentDialog/>
                <DepartmentDeatil
                    selectItem={this.selectedDepartment}
                    hideDetails={this.hideDetails}
                >
                </DepartmentDeatil>
            </>
        )
    }
}


