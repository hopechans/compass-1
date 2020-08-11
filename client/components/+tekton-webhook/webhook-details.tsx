import {KubeObjectDetailsProps} from "../kube-object";
import {observer} from "mobx-react";
import React from "react";
import {KubeObjectMeta} from "../kube-object/kube-object-meta";
import {DrawerItem, DrawerItemLabels} from "../drawer";
import {Trans} from "@lingui/macro";
import {KubeEventDetails} from "../+events/kube-event-details";
import {apiManager} from "../../api/api-manager";
import {TektonWebHook, tektonWebHookApi} from "../../api/endpoints/tekton-webhook.api";

interface Props extends KubeObjectDetailsProps<TektonWebHook> {
}

@observer
export class WebHookDetails extends React.Component<Props> {

  render() {
    const {object: tektonWebHook} = this.props;
    if (!tektonWebHook) {
      return null;
    }

    return (
      <div className="WebHookDetails">
        <KubeObjectMeta object={tektonWebHook}/>
        <DrawerItem name={<Trans>Git Address</Trans>}>
          {tektonWebHook.spec.git}
        </DrawerItem>
        <DrawerItem name={<Trans>Branch</Trans>}>
          {tektonWebHook.spec.branch}
        </DrawerItem>
        <DrawerItem name={<Trans>PipelineRun</Trans>} >
          {tektonWebHook.spec.pipeline_run}
        </DrawerItem>
        <DrawerItemLabels name={<Trans>Args</Trans>} labels={tektonWebHook.spec.args} />
        <KubeEventDetails object={tektonWebHook}/>
      </div>
    )
  }
}

apiManager.registerViews(tektonWebHookApi, {Details: WebHookDetails});