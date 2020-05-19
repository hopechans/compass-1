import "./form.scss"

import * as React from "react";
import {observer} from "mobx-react";
import {RouteComponentProps} from "react-router";
import {Trans} from "@lingui/macro";
import {KubeObjectMenu, KubeObjectMenuProps} from "../kube-object/kube-object-menu";
import {KubeObjectListLayout} from "../kube-object";
import {IFormRouteParams} from "./form.route";
import {formStore} from "./form.store";
import {Form, formApi} from "../../api/endpoints/form.api";
import {apiManager} from "../../api/api-manager";

enum sortBy {
    name = "name",
    namespace = "namespace",
    age = "age",
}

interface Props extends RouteComponentProps<IFormRouteParams> {
}

@observer
export class Forms extends React.Component<Props> {
    spec: { scaleTargetRef: any; };

    render() {
        return (
            <KubeObjectListLayout
                className="Forms" store={formStore}
                sortingCallbacks={{
                    [sortBy.name]: (item: Form) => item.getName(),
                    [sortBy.namespace]: (item: Form) => item.getNs(),
                }}
                searchFilters={[
                    (item: Form) => item.getSearchFields()
                ]}
                renderHeaderTitle={<Trans>Forms</Trans>}
                renderTableHeader={[
                    {title: <Trans>Name</Trans>, className: "name", sortBy: sortBy.name},
                    {title: <Trans>Namespace</Trans>, className: "namespace", sortBy: sortBy.namespace},
                    {title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age},
                ]}
                renderTableContents={(form: Form) => [
                    form.getName(),
                    form.getNs(),
                    form.getAge(),
                ]}
                renderItemMenu={(item: Form) => {
                    return <FormMenu object={item}/>
                }}
            />
        );
    }
}

export function FormMenu(props: KubeObjectMenuProps<Form>) {
    return (
        <KubeObjectMenu {...props}/>
    )
}

apiManager.registerViews(formApi, {
    Menu: FormMenu,
})
