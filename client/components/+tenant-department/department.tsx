
import './department.scss'
import * as React from 'react'
import { observer } from "mobx-react";
import { Trans } from "@lingui/macro";
import { RouteComponentProps } from "react-router";
import { cssNames, stopPropagation } from "../../utils";
import { getDetailsUrl } from "../../navigation";
import { apiManager } from "../../api/api-manager";
import { tenantDepartmentStore } from "./department.store";
import { TetantDepartment } from "../../api/endpoints/tenant-department.api";
import { DepartmentMenu } from './department-menu'
import { computed } from "mobx";
import { ItemListLayout, ItemListLayoutProps } from "../item-object-list/item-list-layout";


export interface DepartmentProps  {
    store: TetantDepartment;
}


enum sortBy {
    name = "name",
}

@observer
export class Department extends React.Component<DepartmentProps>{

    componentDidMount() {
        tenantDepartmentStore.loadAll();
    }

    render(){
        return(
            <>
               <ItemListLayout
                    className="tetantDepartment"
                    store={tenantDepartmentStore}
                    isClusterScoped={true}
                    isSelectable={true}
                    sortingCallbacks={{
                        [sortBy.name]: (item: TetantDepartment) => item.getName(),
                    }}
                    searchFilters={[
                        (item: TetantDepartment) => item.getName(),
                   
                    ]}
                    renderHeaderTitle={<Trans>Department Manager</Trans>}
                    renderTableHeader={[
                        { title: <Trans>ID</Trans>, className: "id" },
                        { title: <Trans>部门名称</Trans>, className: "name", sortBy:sortBy.name},

                    ]}
                    renderTableContents={(item: TetantDepartment) => [
                        item.getId(),
                        item.getName(),
                    ]}
                    renderItemMenu={(item: TetantDepartment) => {
                        return <DepartmentMenu object={item}/>
                    }}
                    addRemoveButtons={{
                        onAdd: () => {},
                        addTooltip: <Trans>Create new department</Trans>
                    }}
                />
            </>
        )
    }
}


