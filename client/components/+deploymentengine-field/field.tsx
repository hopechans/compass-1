import "./field.scss"

import * as React from "react";
import {observer} from "mobx-react";
import {RouteComponentProps} from "react-router";
import {t, Trans} from "@lingui/macro";
import {KubeObjectMenu, KubeObjectMenuProps} from "../kube-object";
import {KubeObjectListLayout} from "../kube-object";
import {IFieldRouteParams} from "./field.route";
import {fieldStore} from "./field.store";
import {Field, fieldApi} from "../../api/endpoints";
import {apiManager} from "../../api/api-manager";
import {MenuItem} from "../menu";
import {Icon} from "../icon";
import {_i18n} from "../../i18n";

import {AddFieldDialog} from "./add-field-dialog";
import {ConfigFieldDialog} from "./config-field-dialog";

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
            <>
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
                        {title: <Trans>Type</Trans>, className: "type"},
                        {title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age},
                    ]}
                    renderTableContents={(field: Field) => [
                        field.getName(),
                        field.getNs(),
                        field.spec.field_type,
                        field.getAge(),
                    ]}
                    renderItemMenu={(item: Field) => {
                        return <FieldMenu object={item}/>
                    }}
                    addRemoveButtons={{
                        onAdd: () => AddFieldDialog.open(),
                        addTooltip: <Trans>Create new Field</Trans>
                    }}
                />
                <AddFieldDialog/>
            </>
        );
    }
}

export function FieldMenu(props: KubeObjectMenuProps<Field>) {

    const {object, toolbar} = props;

    return (
        <>
            <KubeObjectMenu {...props}>
                <MenuItem onClick={() => ConfigFieldDialog.open(object)}>
                    <Icon material="control_camera" title={_i18n._(t`Modal`)} interactive={toolbar}/>
                    <span className="title"><Trans>Modal</Trans></span>
                </MenuItem>
            </KubeObjectMenu>
            <ConfigFieldDialog/>
        </>
    )
}

apiManager.registerViews(fieldApi, {
    Menu: FieldMenu,
})
