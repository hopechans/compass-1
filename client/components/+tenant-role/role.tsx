import * as React from "react";
import {observer} from "mobx-react";
import {RouteComponentProps} from "react-router";
import {t, Trans} from "@lingui/macro";
import {KubeObjectMenu, KubeObjectMenuProps} from "../kube-object";
import {KubeObjectListLayout} from "../kube-object";
import {TenantRole, tenantRoleApi} from "../../api/endpoints";
import {apiManager} from "../../api/api-manager";
import {tenantRoleStore} from "./role.store"

import {AddRoleDialog} from "./add-role-dialog";

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
export class TenantRoles extends React.Component<Props> {
    spec: { scaleTargetRef: any; };

    render() {
        return (
            <>
                <KubeObjectListLayout
                    className="TenantRoles" store={tenantRoleStore}
                    sortingCallbacks={{
                        [sortBy.name]: (item: TenantRole) => item.getName(),
                        [sortBy.namespace]: (item: TenantRole) => item.getNs(),
                    }}
                    searchFilters={[
                        (item: TenantRole) => item.getSearchFields()
                    ]}
                    renderHeaderTitle={<Trans>Roles</Trans>}
                    renderTableHeader={[
                        {title: <Trans>Name</Trans>, className: "name", sortBy: sortBy.name},
                        {title: <Trans>Namespace</Trans>, className: "namespace", sortBy: sortBy.namespace},
                        {title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age},
                    ]}
                    renderTableContents={(role: TenantRole) => [
                        role.getName(),
                        role.getNs(),
                        role.getAge(),
                    ]}
                    renderItemMenu={(item: TenantRole) => {
                        return <RoleMenu object={item}/>
                    }}
                    addRemoveButtons={{
                        onAdd: () => AddRoleDialog.open(),
                        addTooltip: <Trans>Create new Role</Trans>
                    }}
                />
                <AddRoleDialog/>
            </>
        );
    }
}

export function RoleMenu(props: KubeObjectMenuProps<TenantRole>) {
    return (
        <>
            <KubeObjectMenu {...props} />
        </>
    )
}

apiManager.registerViews(tenantRoleApi, {
    Menu: RoleMenu,
})
