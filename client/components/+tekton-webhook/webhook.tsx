import "./webhook.scss";

import {RouteComponentProps} from "react-router";
import {observer} from "mobx-react";
import React from "react";
import {KubeObjectListLayout, KubeObjectMenu, KubeObjectMenuProps} from "../kube-object";
import {tektonWebHookStore} from "./webhook.store";
import {t, Trans} from "@lingui/macro";
import {TektonWebHook, tektonWebHookApi} from "../../api/endpoints/tekton-webhook.api";
import {AddWebhookDialog} from "./add-webhook-dialog";
import {apiManager} from "../../api/api-manager";
import {ConfigWebhookDialog} from "./config-webhook-dialog";
import {MenuItem} from "../menu";
import {Icon} from "../icon";
import {_i18n} from "../../i18n";
import {Link} from "react-router-dom";
import {stopPropagation} from "../../utils";
import Tooltip from "@material-ui/core/Tooltip";
import {WebHookDetails} from "./webhook-details";

enum sortBy {
  name = "name",
  namespace = "namespace",
  git = "git",
  branch = "branch",
  pipelineRun = "pipelineRun",
  age = "age",
}

interface Props extends RouteComponentProps {
}

@observer
export class WebHook extends React.Component<Props> {

  renderWebHookeName(tektonWebHook: TektonWebHook) {
    const name = tektonWebHook.getName();
    return (
      <Link
        onClick={(event) => {
          stopPropagation(event);
          ConfigWebhookDialog.open(tektonWebHook);
        }}
        to={null}
      >
        <Tooltip title={name} placement="top-start">
          <span>{name}</span>
        </Tooltip>
      </Link>
    );
  }

  render() {
    return (
      <>
        <KubeObjectListLayout
          isClusterScoped
          className="WebHook"
          store={tektonWebHookStore}
          sortingCallbacks={{
            [sortBy.name]: (tektonWebHook: TektonWebHook) => tektonWebHook.getName(),
            [sortBy.namespace]: (tektonWebHook: TektonWebHook) => tektonWebHook.getNs(),
            [sortBy.git]: (tektonWebHook: TektonWebHook) => tektonWebHook.spec.git || "",
            [sortBy.branch]: (tektonWebHook: TektonWebHook) => tektonWebHook.spec.branch || "",
            [sortBy.pipelineRun]: (tektonWebHook: TektonWebHook) => tektonWebHook.spec.pipeline_run || "",
            [sortBy.age]: (tektonWebHook: TektonWebHook) => tektonWebHook.getAge(false),
          }}
          searchFilters={[
            (tektonWebHook: TektonWebHook) => tektonWebHook.getSearchFields(),
          ]}
          renderHeaderTitle={<Trans>Tekton WebHook</Trans>}
          renderTableHeader={[
            {
              title: <Trans>Name</Trans>,
              className: "name",
              sortBy: sortBy.name,
            },
            {
              title: <Trans>Namespace</Trans>,
              className: "namespace",
              sortBy: sortBy.namespace,
            },
            {
              title: <Trans>Git Address</Trans>,
              className: "git",
              sortBy: sortBy.git,
            },
            {
              title: <Trans>Branch</Trans>,
              className: "branch",
              sortBy: sortBy.branch,
            },
            {
              title: <Trans>PipelineRun</Trans>,
              className: "pipelineRun",
              sortBy: sortBy.pipelineRun,
            },
            {
              title: <Trans>Age</Trans>,
              className: "age",
              sortBy: sortBy.age
            },
          ]}
          renderTableContents={(tektonWebHook: TektonWebHook) => [
            this.renderWebHookeName(tektonWebHook),
            tektonWebHook.getNs(),
            tektonWebHook.spec.git || "",
            tektonWebHook.spec.branch || "",
            tektonWebHook.spec.pipeline_run || "",
            tektonWebHook.getAge(),
          ]}
          renderItemMenu={(item: TektonWebHook) => {
            return <TektonWebHookMenu object={item}/>;
          }}
          addRemoveButtons={{
            addTooltip: <Trans>WebHook</Trans>,
            onAdd: () => {
              AddWebhookDialog.open();
            },
          }}
        />
        <AddWebhookDialog/>
        <ConfigWebhookDialog/>
      </>
    )
  }
}

export function TektonWebHookMenu(props: KubeObjectMenuProps<TektonWebHook>) {
  const {object, toolbar} = props;

  return (
    <KubeObjectMenu {...props} >
      <MenuItem onClick={() => {
        ConfigWebhookDialog.open(object)
      }}>
        <Icon material="sync_alt" title={_i18n._(t`Config`)} interactive={toolbar}/>
        <span className="title"><Trans>Config</Trans></span>
      </MenuItem>
    </KubeObjectMenu>
  );
}

apiManager.registerViews(tektonWebHookApi, {Menu: TektonWebHookMenu});
