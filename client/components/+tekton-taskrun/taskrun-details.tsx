import * as React from "react";
import {disposeOnUnmount, observer} from "mobx-react";
import {TaskRun, taskRunApi} from "../../api/endpoints";
import {KubeEventDetails} from "../+events/kube-event-details";
import {KubeObjectDetailsProps} from "../kube-object";
import {apiManager} from "../../api/api-manager";
import {KubeObjectMeta} from "../kube-object/kube-object-meta";
import {TaskRunDetailsSteps} from "./taskrun-details-steps";
import {Trans} from "@lingui/macro";
import {DrawerTitle} from "../drawer";

interface Props extends KubeObjectDetailsProps<TaskRun> {
}

@observer
export class TaskRunDetails extends React.Component<Props> {

  render() {
    const {object: taskRun} = this.props;
    if (!taskRun) return null;
    return (
      <div className="TaskRunDetails">
        <KubeObjectMeta object={taskRun}/>
        <KubeEventDetails object={taskRun}/>
        <DrawerTitle title={<Trans>Steps</Trans>}/>
        {taskRun.status.steps !== undefined && taskRun.status.steps.length > 0 ? taskRun.status.steps.map(step => {
          return (
            <TaskRunDetailsSteps stepState={step}/>
          )
        }) : <></>}
      </div>
    )
  }
}

apiManager.registerViews(taskRunApi, {
  Details: TaskRunDetails
})