import * as React from "react";
import {observer} from "mobx-react";
import {RouteComponentProps} from "react-router";
import {t, Trans} from "@lingui/macro";
import {KubeObjectMenu, KubeObjectMenuProps} from "../kube-object";
import {KubeObjectListLayout} from "../kube-object";
import {TenantDepartment, tenantDepartmentApi} from "../../api/endpoints";
import {apiManager} from "../../api/api-manager";
import {tenantDepartmentStore} from "./department.store";

import {AddDepartmentDialog} from "./add-department-dialog";

enum sortBy {
    name = "name",
    namespace = "namespace",
    age = "age",
}


interface RoleProps {
}

interface Props extends RouteComponentProps<RoleProps> {
}

@observer
export class TenantDepartments extends React.Component<Props> {
    spec: { scaleTargetRef: any; };

    render() {
        return (
            <>
                <KubeObjectListLayout
                    onDetails={() => {}}
                    className="Departments" store={tenantDepartmentStore}
                    sortingCallbacks={{
                        [sortBy.name]: (item: TenantDepartment) => item.getName(),
                        [sortBy.namespace]: (item: TenantDepartment) => item.getNs(),
                    }}
                    searchFilters={[
                        (item: TenantDepartment) => item.getSearchFields()
                    ]}
                    renderHeaderTitle={<Trans>Departments</Trans>}
                    renderTableHeader={[
                        {title: <Trans>Name</Trans>, className: "name", sortBy: sortBy.name},
                        {title: <Trans>Namespace</Trans>, className: "namespace", sortBy: sortBy.namespace},
                        {title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age},
                    ]}
                    renderTableContents={(department: TenantDepartment) => [
                        department.getName(),
                        department.getNs(),
                        department.getAge(),
                    ]}
                    renderItemMenu={(item: TenantDepartment) => {
                        return <DepartmentMenu object={item}/>
                    }}
                    addRemoveButtons={{
                        onAdd: () => AddDepartmentDialog.open(),
                        addTooltip: <Trans>Create new Department</Trans>
                    }}
                />
                <AddDepartmentDialog/>
            </>
        );
    }
}

export function DepartmentMenu(props: KubeObjectMenuProps<TenantDepartment>) {
    return (
        <>
            <KubeObjectMenu {...props} />
        </>
    )
}

apiManager.registerViews(tenantDepartmentApi, {
    Menu: DepartmentMenu,
})
