import * as React from "react";
import {observer} from "mobx-react";
import {RouteComponentProps} from "react-router";
import {t, Trans} from "@lingui/macro";
import {KubeObjectMenu, KubeObjectMenuProps} from "../kube-object";
import {KubeObjectListLayout} from "../kube-object";
import {apiManager} from "../../api/api-manager";
import {SubNet, subNetApi} from "../../api/endpoints/subnet.api";
import {subNetStore} from "./subnet.route";
import {ISubNetRouteParams} from "./subnet.store";
import {CopyAddDeployDialog} from "../+deploy/copy-deploy-dialog";
import {AddSubNetDialog} from "./add-subnet-dialog";


enum sortBy {
    name = "name",
    namespace = "namespace",
    age = "age",
}


interface Props extends RouteComponentProps<ISubNetRouteParams> {
}

@observer
export class SubNets extends React.Component<Props> {

    render() {
        return (
            <>
                <KubeObjectListLayout
                    onDetails={() => {
                    }}
                    className="SubNet" store={subNetStore}
                    sortingCallbacks={{
                        [sortBy.name]: (item: SubNet) => item.getName(),
                        [sortBy.namespace]: (item: SubNet) => item.getNs(),
                    }}
                    searchFilters={[
                        (item: SubNet) => item.getSearchFields()
                    ]}
                    renderHeaderTitle={<Trans>SubNet</Trans>}
                    renderTableHeader={[
                        {title: <Trans>Name</Trans>, className: "name", sortBy: sortBy.name},
                        {title: <Trans>Protocol</Trans>, className: "protocol"},
                        {title: <Trans>GateWay</Trans>, className: "gateway"},
                        {title: <Trans>CIDR Block</Trans>, className: "cidrBlock"},
                        {title: <Trans>ExcludeIP</Trans>, className: "excludeIps"},
                        {title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age},
                    ]}
                    renderTableContents={(field: SubNet) => [
                        field.getName(),
                        field.spec.protocol,
                        field.spec.gateway,
                        field.spec.cidrBlock,
                        field.spec.excludeIps,
                        field.getAge(),
                    ]}
                    renderItemMenu={(item: SubNet) => {
                        return <SubNetMenu object={item}/>
                    }}
                    addRemoveButtons={{
                        addTooltip: <Trans>AddSubNetDialog</Trans>,
                        onAdd: () => AddSubNetDialog.open()
                    }}
                />
                <AddSubNetDialog />
            </>
        );
    }
}

export function SubNetMenu(props: KubeObjectMenuProps<SubNet>) {

    const {object, toolbar} = props;

    return (
        <>
            <KubeObjectMenu {...props} />
        </>
    )
}

apiManager.registerViews(subNetApi, {
    Menu: SubNetMenu,
})
