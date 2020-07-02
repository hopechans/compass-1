import React from "react";
import {KubeObjectDetailsProps} from "../kube-object";
import {Task, taskApi} from "../../api/endpoints";
import {observer} from "mobx-react";
import {KubeObjectMeta} from "../kube-object/kube-object-meta";
import {apiManager} from "../../api/api-manager";
import {Trans} from "@lingui/macro";
import {DrawerItem, DrawerTitle} from "../drawer";
import {KubeEventDetails} from "../+events/kube-event-details";
import {Divider} from "@material-ui/core";

interface Props extends KubeObjectDetailsProps<Task> {
}

@observer
export class TaskDetails extends React.Component<Props> {
  render() {
    const {object: task} = this.props;
    if (!task) {
      return null;
    }

    return (
      <div className="PipelineResourceDetails">
        <KubeObjectMeta object={task}/>
        <KubeEventDetails object={task}/>

        <DrawerTitle title={<Trans>Steps</Trans>}/>
        {
          task.spec.steps?.map((item: any) => {
              return (
                <div>
                  {
                    Object.entries(item).map(
                      ([name, value]) =>
                        <DrawerItem key={name} name={name}>
                          {JSON.stringify(value)}
                        </DrawerItem>
                    )
                  }
                  <br/><br/>
                </div>
              )
            }
          )
        }

        <DrawerTitle title={<Trans>Volumes</Trans>}/>
        {
          task.spec.volumes?.map((item: any) => {
              return (
                <div>
                  {
                    Object.entries(item).map(
                      ([name, value]) =>
                        <DrawerItem key={name} name={name}>
                          {JSON.stringify(value)}
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

apiManager.registerViews(taskApi, {
  Details: TaskDetails
})