import React from "react";
import {KubeObjectDetailsProps} from "../kube-object";
import {PipelineResource, pipelineResourceApi} from "../../api/endpoints";
import {observer} from "mobx-react";
import {KubeObjectMeta} from "../kube-object/kube-object-meta";
import {apiManager} from "../../api/api-manager";
import {Trans} from "@lingui/macro";
import {DrawerItem, DrawerTitle} from "../drawer";
import {KubeEventDetails} from "../+events/kube-event-details";
import {Divider} from "@material-ui/core";

interface Props extends KubeObjectDetailsProps<PipelineResource> {
}

@observer
export class PipelineResourceDetails extends React.Component<Props> {
  render() {
    const {object: pipelineResource} = this.props;
    if (!pipelineResource) {
      return null;
    }

    return (
      <div className="PipelineResourceDetails">
        <KubeObjectMeta object={pipelineResource}/>
        <KubeEventDetails object={pipelineResource}/>

        <DrawerTitle title={<Trans>Type</Trans>}/>
        {pipelineResource.spec?.type}

        <DrawerTitle title={<Trans>Params</Trans>}/>
        {
          pipelineResource.spec.params?.map(item => {
              return (
                <div>
                  {
                    Object.entries(item).map(
                      ([name, value]) =>
                        <DrawerItem key={name} name={name}>
                          {String(value)}
                        </DrawerItem>
                    )
                  }
                  <br/><br/>
                </div>
              )
            }
          )
        }
      </div>
    )
  }
}

apiManager.registerViews(pipelineResourceApi, {
  Details: PipelineResourceDetails
})