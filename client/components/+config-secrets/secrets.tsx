import "./secrets.scss"

import * as React from "react";
import { observer } from "mobx-react";
import { Trans, t } from "@lingui/macro";
import { RouteComponentProps } from "react-router";
import { Secret, secretsApi } from "../../api/endpoints";
import { KubeObjectMenu, KubeObjectMenuProps } from "../kube-object";
import { AddSecretDialog } from "./add-secret-dialog";
import { ISecretsRouteParams } from "./secrets.route";
import { KubeObjectListLayout } from "../kube-object";
import { Badge } from "../badge";
import { secretsStore, opsSecretsStore } from "./secrets.store";
import { apiManager } from "../../api/api-manager";
import { ConfigSecretDialog } from "./config-secret-dialog";
import { MenuItem } from "../menu";
import { Icon } from "../icon";
import { _i18n } from "../../i18n";
import { observable } from "mobx";

enum sortBy {
  name = "name",
  namespace = "namespace",
  labels = "labels",
  keys = "keys",
  type = "type",
  age = "age",
}

interface Props extends RouteComponentProps<ISecretsRouteParams> {
}

@observer
export class Secrets extends React.Component<Props> {

  @observable className: string = "Secrets"

  @observable addRemoveButtons = {}

  render() {
    const store = this.className == "Secrets" ? secretsStore : opsSecretsStore;
    return (
      <>
        <KubeObjectListLayout
          className={this.className}
          store={store}
          sortingCallbacks={{
            [sortBy.name]: (item: Secret) => item.getName(),
            [sortBy.namespace]: (item: Secret) => item.getNs(),
            [sortBy.labels]: (item: Secret) => item.getLabels(),
            [sortBy.keys]: (item: Secret) => item.getKeys(),
            [sortBy.type]: (item: Secret) => item.type,
            [sortBy.age]: (item: Secret) => item.getAge(false),
          }}
          searchFilters={[
            (item: Secret) => item.getSearchFields(),
            (item: Secret) => item.getKeys(),
          ]}
          renderHeaderTitle={_i18n._(this.className)}
          renderTableHeader={[
            { title: <Trans>Name</Trans>, className: "name", sortBy: sortBy.name },
            { title: <Trans>Namespace</Trans>, className: "namespace", sortBy: sortBy.namespace },
            { title: <Trans>Labels</Trans>, className: "labels", sortBy: sortBy.labels },
            { title: <Trans>Keys</Trans>, className: "keys", sortBy: sortBy.keys },
            { title: <Trans>Type</Trans>, className: "type", sortBy: sortBy.type },
            { title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age },
          ]}
          renderTableContents={(secret: Secret) => [
            secret.getName(),
            secret.getNs(),
            secret.getLabels().map(label => <Badge key={label} label={label} />),
            secret.getKeys().join(", "),
            secret.type,
            secret.getAge(),
          ]}
          renderItemMenu={(item: Secret) => {
            return <SecretMenu object={item} />
          }}
          addRemoveButtons={{
            onAdd: () => AddSecretDialog.open(),
            addTooltip: <Trans>Create new Secret</Trans>
          }}
        />
        <AddSecretDialog className={this.className} />
        <ConfigSecretDialog className={this.className} />
      </>
    );
  }
}

export function SecretMenu(props: KubeObjectMenuProps<Secret>) {

  const { object, toolbar } = props;
  return (
    <>
      <KubeObjectMenu {...props} >
        <MenuItem onClick={() => ConfigSecretDialog.open(object)}>
          <Icon material="sync_alt" title={_i18n._(t`Secret`)} interactive={toolbar} />
          <span className="title"><Trans>Config</Trans></span>
        </MenuItem>
      </KubeObjectMenu>
    </>
  )
}

apiManager.registerViews(secretsApi, {
  Menu: SecretMenu,
})
