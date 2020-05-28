import * as React from "react";
import {observer} from "mobx-react";
import {RouteComponentProps} from "react-router";
import {t, Trans} from "@lingui/macro";
import {KubeObjectMenu, KubeObjectMenuProps} from "../kube-object";
import {KubeObjectListLayout} from "../kube-object";
import {TenantPermission, tenantPermissionApi} from "../../api/endpoints";
import {tenantPermissionStore} from "./permission.store";
import {apiManager} from "../../api/api-manager";


import {AddPermissionDialog} from "./add-permission-dialog";

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
export class TenantPermissions extends React.Component<Props> {
    spec: { scaleTargetRef: any; };

    render() {
        return (
            <>
                <KubeObjectListLayout
                    className="TenantPermissions" store={tenantPermissionStore}
                    sortingCallbacks={{
                        [sortBy.name]: (item: TenantPermission) => item.getName(),
                        [sortBy.namespace]: (item: TenantPermission) => item.getNs(),
                    }}
                    searchFilters={[
                        (item: TenantPermission) => item.getSearchFields()
                    ]}
                    renderHeaderTitle={<Trans>Permissions</Trans>}
                    renderTableHeader={[
                        {title: <Trans>Name</Trans>, className: "name", sortBy: sortBy.name},
                        {title: <Trans>Namespace</Trans>, className: "namespace", sortBy: sortBy.namespace},
                        {title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age},
                    ]}
                    renderTableContents={(permission: TenantPermission) => [
                        permission.getName(),
                        permission.getNs(),
                        permission.getAge(),
                    ]}
                    renderItemMenu={(item: TenantPermission) => {
                        return <PermissionMenu object={item}/>
                    }}
                    addRemoveButtons={{
                        onAdd: () => AddPermissionDialog.open(),
                        addTooltip: <Trans>Create new Permission</Trans>
                    }}
                />
                <AddPermissionDialog/>
            </>
        );
    }
}

export function PermissionMenu(props: KubeObjectMenuProps<TenantPermission>) {
    return (
        <>
            <KubeObjectMenu {...props} />
        </>
    )
}

apiManager.registerViews(tenantPermissionApi, {
    Menu: PermissionMenu,
})
