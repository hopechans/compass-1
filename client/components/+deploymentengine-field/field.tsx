import "./field.scss"

import * as React from "react";
import {observer} from "mobx-react";
import {RouteComponentProps} from "react-router";
import {Trans} from "@lingui/macro";
import {KubeObjectMenu, KubeObjectMenuProps} from "../kube-object";
import {KubeObjectListLayout} from "../kube-object";
import {IFieldRouteParams} from "./field.route";
import {fieldStore} from "./field.store";
import {Field, fieldApi} from "../../api/endpoints/field.api";
import {apiManager} from "../../api/api-manager";

enum sortBy {
    name = "name",
    namespace = "namespace",
    age = "age",
}

interface Props extends RouteComponentProps<IFieldRouteParams> {
}

@observer
export class Fields extends React.Component<Props> {
    spec: { scaleTargetRef: any; };

    render() {
        return (
            <KubeObjectListLayout
                className="Fields" store={fieldStore}
                sortingCallbacks={{
                    [sortBy.name]: (item: Field) => item.getName(),
                    [sortBy.namespace]: (item: Field) => item.getNs(),
                }}
                searchFilters={[
                    (item: Field) => item.getSearchFields()
                ]}
                renderHeaderTitle={<Trans>Fields</Trans>}
                renderTableHeader={[
                    {title: <Trans>Name</Trans>, className: "name", sortBy: sortBy.name},
                    {title: <Trans>Namespace</Trans>, className: "namespace", sortBy: sortBy.namespace},
                    {title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age},
                ]}
                renderTableContents={(field: Field) => [
                    field.getName(),
                    field.getNs(),
                    field.getAge(),
                ]}
                renderItemMenu={(item: Field) => {
                    return <FieldMenu object={item}/>
                }}
            />
        );
    }
}

export function FieldMenu(props: KubeObjectMenuProps<Field>) {
    return (
        <KubeObjectMenu {...props}/>
    )
}

apiManager.registerViews(fieldApi, {
    Menu: FieldMenu,
})
