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
import {SequelFieldDialog} from "./sequel-field-dialog";

enum sortBy {
    name = "name",
    namespace = "namespace",
    age = "age",
}


interface Props extends RouteComponentProps<IFieldRouteParams> {
}

@observer
export class Fields extends React.Component<Props> {

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
                <MenuItem onClick={() => SequelFieldDialog.open(object)}>
                    <Icon material="code" title={_i18n._(t`Show`)} interactive={toolbar}/>
                    <span className="title"><Trans>Show</Trans></span>
                </MenuItem>
                <MenuItem onClick={() => ConfigFieldDialog.open(object)}>
                    <Icon material="settings_ethernet" title={_i18n._(t`Config`)} interactive={toolbar}/>
                    <span className="title"><Trans>Config</Trans></span>
                </MenuItem>
            </KubeObjectMenu>
            <ConfigFieldDialog/>
            <SequelFieldDialog/>
        </>
    )
}

apiManager.registerViews(fieldApi, {
    Menu: FieldMenu,
})
