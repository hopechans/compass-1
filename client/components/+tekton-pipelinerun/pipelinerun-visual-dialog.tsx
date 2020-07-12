import "./pipelinerun-visual-dialog.scss"

import React from "react";
import {observable} from "mobx";
import {Trans} from "@lingui/macro";
import {Dialog} from "../dialog";
import {Wizard, WizardStep} from "../wizard";
import {observer} from "mobx-react";
import {PipelineRun, Pod} from "../../api/endpoints";
import {graphId, Graphs, initData} from "../+tekton-graph/graphs";
import {taskRunStore} from "../+tekton-taskrun";
import {podsStore} from "../+workloads-pods/pods.store";
import {PodLogsDialog} from "../+workloads-pods/pod-logs-dialog";
import {secondsToHms} from "../../api/endpoints/tekton-graph.api";


interface Props extends Partial<Props> {
}

@observer
export class PipelineRunVisualDialog extends React.Component<Props> {

  @observable static isOpen = false;
  @observable static Data: PipelineRun = null;
  @observable graph: any = null;
  @observable currentNode: any = null;
  @observable pendingTimeInterval: any = null;
  @observable updateTimeInterval: any = null;

  get pipelineRun() {
    return PipelineRunVisualDialog.Data
  }

  static open(pipelineRun: PipelineRun) {
    PipelineRunVisualDialog.isOpen = true;
    PipelineRunVisualDialog.Data = pipelineRun;
  }

  getTaskRunName(pipelinerun: PipelineRun): string[] {
    if (pipelinerun?.status == undefined) {
      return [];
    }
    if (pipelinerun?.status?.taskRuns == undefined) {
      return [];
    }
    return (
      Object.keys(pipelinerun?.status?.taskRuns).map((item: any) => {
        return item;
      }).slice() || []
    );
  }

  getTaskRun(names: string[]): any {
    let taskMap: any = new Map<string, any>();
    names.map((name: string, index: number) => {
      const currentTask = taskRunStore.getByName(name);
      if (currentTask?.spec !== undefined) {
        taskMap[currentTask.spec.taskRef.name] = currentTask;
      }
    });

    return taskMap;
  }

  showLogs(podName: string) {
    let pod: Pod = podsStore.getByName(podName);
    let container: any = pod.getContainerStatuses();
    PodLogsDialog.open(pod, container);
  }

  onOpen = async () => {

    let nodeData = this.pipelineRun.getNodeData();

    setTimeout(() => {

      const anchor = document.getElementsByClassName("step-content")[0]
      // const anchor = document.getElementById("container")
      const width = anchor.scrollWidth - 50;
      const height = anchor.scrollHeight - 60;

      this.graph = new Graphs(width, height);
      this.graph.init();


      if (nodeData === undefined || nodeData === "") {
        this.graph.instance.data(initData);
      } else {
        this.graph.instance.data(nodeData);
      }

      this.graph.bindClickOnNode((currentNode: any) => {

        const group = currentNode.getContainer();
        let shape = group.get("children")[2];
        const name = shape.attrs.text;

        const names = this.getTaskRunName(this.pipelineRun);
        const currentTaskRunMap = this.getTaskRun(names);
        const currentTaskRun = currentTaskRunMap[name];
        const podName = currentTaskRun.status.podName;

        this.showLogs(podName);
      });

      this.graph.render();

    }, 100)

    this.pendingTimeInterval = setInterval(() => {
      const names = this.pipelineRun.getTaskRunName();
      if (names.length > 0) {

        const currentTaskRunMap = this.getTaskRun(names);
        nodeData.nodes.map((item: any, index: number) => {
          const currentTaskRun = currentTaskRunMap[item.taskName];
          if (currentTaskRun !== undefined) {
            //should check when the pipeline-run status
            nodeData.nodes[index].status =
              currentTaskRun.status.conditions[0].reason;
          } else {
            nodeData.nodes[index].status = "Pendding";
          }
          nodeData.nodes[index].showtime = true;
        });

        this.graph.instance.clear();
        this.graph.instance.changeData(nodeData);
      }
    }, 500);

    //Interval 1s update status and time in graph
    this.updateTimeInterval = setInterval(() => {

      const names = this.pipelineRun.getTaskRunName();

      console.log(names)
      if (names.length > 0) {

        const currentTaskRunMap = this.getTaskRun(names);
        console.log(currentTaskRunMap);
        console.log(nodeData);
        nodeData.nodes.map((item: any, index: number) => {
          // //set current node status,just like:Failed Succeed... and so on.

          const currentTaskRun = currentTaskRunMap[item.taskName];
          console.log("currentTaskRun", currentTaskRun);
          if (currentTaskRun !== undefined) {
            //should get current node itme and update the time.
            let currentItem = this.graph.instance.findById(nodeData.nodes[index].id);
            //dynimic set the state: missing notreay
            if (currentTaskRun?.status?.conditions[0]?.reason == undefined) {
              return;
            }

            this.graph.instance.setItemState(
              currentItem, currentTaskRun?.status?.conditions[0]?.reason, "");

            //when show pipeline will use current date time  less start time and then self-increment。
            let completionTime = currentTaskRun.status.completionTime;
            let totalTime: string;
            const currentStartTime = currentTaskRun.metadata.creationTimestamp;
            const st = new Date(currentStartTime).getTime();
            if (completionTime !== undefined) {
              const ct = new Date(completionTime).getTime();
              let result = Math.floor((ct - st) / 1000);
              totalTime = secondsToHms(result);
            } else {
              const ct = new Date().getTime();
              let result = Math.floor((ct - st) / 1000);
              totalTime = secondsToHms(result);
            }

            //set the time
            this.graph.instance.setItemState(currentItem, "time", totalTime);
          }
        });
      }
    }, 1000);
  }

  static close() {
    PipelineRunVisualDialog.isOpen = false;
  }

  close = () => {
    this.reset();
    PipelineRunVisualDialog.close();
  };

  reset = () => {
    this.graph = null;
    clearInterval(this.pendingTimeInterval);
    this.pendingTimeInterval = null;
    clearInterval(this.updateTimeInterval);
    this.updateTimeInterval = null;
  }

  render() {
    const header = (
      <h5>
        <Trans>PipelineRun Visualization</Trans>
      </h5>
    );

    return (
      <Dialog
        isOpen={PipelineRunVisualDialog.isOpen}
        className="PipelineRunVisualDialog"
        onOpen={this.onOpen}
        close={this.close}>
        <Wizard header={header} done={this.close}>
          <WizardStep contentClass="flex gaps column" nextLabel={<Trans>Save</Trans>}>
            <div className="container" id={graphId}/>
          </WizardStep>
        </Wizard>
      </Dialog>
    )
  }

}