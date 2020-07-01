import "./pipelinerun.scss";

import React from "react";
import { observer } from "mobx-react";
import { RouteComponentProps } from "react-router";
import { Trans } from "@lingui/macro";
import { PipelineRun, pipelineRunApi, TaskRun } from "../../api/endpoints";
import { pipelineRunStore } from "./pipelinerun.store";
import { pipelineStore } from "../+tekton-pipeline/pipeline.store";
import { KubeObjectMenu, KubeObjectMenuProps } from "../kube-object";
import { KubeObjectListLayout } from "../kube-object";
import { apiManager } from "../../api/api-manager";
import { observable } from "mobx";
import { PipelineGraph } from "../+graphs/pipeline-graph";
import { Graph } from "../+graphs/graph";
import { taskRunStore } from "../+tekton-taskrun";

enum sortBy {
  name = "name",
  ownernamespace = "ownernamespace",
  pods = "pods",
  age = "age",
}

interface Props extends RouteComponentProps {}

@observer
export class PipelineRuns extends React.Component<Props> {
  @observable isHiddenPipelineGraph: boolean = true;
  @observable graph: any = null;
  @observable timeIntervalID: any;

  getNodeData(pipelineName: string): any {
    const pipeline = pipelineStore.getByName(pipelineName);
    let nodeData: any;
    pipeline.getAnnotations().filter((item) => {
      const tmp = item.split("=");
      if (tmp[0] == "node_data") {
        nodeData = tmp[1];
      }
    });
    return JSON.parse(nodeData);
  }

  secondsToHms(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor((seconds % 3600) % 60);

    let hDisplay = h > 0 ? h + (h == 1 ? "h " : "h") : "";
    let mDisplay = m > 0 ? m + (m == 1 ? "m " : "m") : "";
    let sDisplay = s > 0 ? s + (s == 1 ? "s " : "s") : "";
    return hDisplay + mDisplay + sDisplay;
  }

  getTaskRunName(pipelinerun: PipelineRun): string[] {
    let taskruns = pipelinerun.status.taskRuns;
    let taskRunNames: string[] = [];
    if (taskruns !== undefined) {
      Object.keys(taskruns).map(function (key: string, index: number) {
        taskRunNames.push(key);
      });
    } else {
      console.error("getTaskRunName error:", pipelinerun.status);
    }

    return taskRunNames;
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

  componentDidMount() {
    this.graph = new PipelineGraph(0, 0);
  }

  //showCurrentPipelineRunStatus show pipeline run status
  showCurrentPipelineRunStatus(pipelinerun: PipelineRun) {
    this.isHiddenPipelineGraph = false;

    //by pipeline ref name get node data
    let nodeData = this.getNodeData(pipelinerun.spec.pipelineRef.name);

    if (nodeData === undefined || nodeData === "") {
    } else {
      this.graph.getGraph().clear();

      setTimeout(() => {
        this.graph.getGraph().changeData(nodeData);
      }, 200);

      let statusMap: any = new Map<any, any>();

      let drawPipeline = setInterval(() => {
        const names = this.getTaskRunName(pipelinerun);
        if (names.length > 0) {
          const currentTaskRunMap = this.getTaskRun(names);
          nodeData.nodes.map((item: any, index: number) => {
            const currentTaskRun = currentTaskRunMap[item.taskName];
            if (currentTaskRun !== undefined) {
              // if (currentTaskRun?.status?.conditions[0]?.reason !== undefined) {

              //   statusMap[index] = true;
              // } else {
              //   statusMap[index] = false;
              //   nodeData.nodes[index].status = "Pendding";
              // }

              //should check when the pipeline-run status
              nodeData.nodes[index].status =
                currentTaskRun.status.conditions[0].reason;
            } else {
              nodeData.nodes[index].status = "Pendding";
            }
            nodeData.nodes[index].showtime = true;
          });
          setTimeout(() => {
            this.graph.getGraph().clear();
            this.graph.getGraph().changeData(nodeData);
          });
          clearInterval(drawPipeline);
        }
      }, 1000);

      //Interval 1s update status and time in graph
      this.timeIntervalID = setInterval(() => {
        const newPipelineRun = pipelineRunStore.getByName(
          pipelinerun.getName()
        );
        const names = this.getTaskRunName(newPipelineRun);
        if (names.length > 0) {
          const currentTaskRunMap = this.getTaskRun(names);

          nodeData.nodes.map((item: any, index: number) => {
            // //set current node status,just like:Failed Succeed... and so on.

            const currentTaskRun = currentTaskRunMap[item.taskName];
            if (currentTaskRun !== undefined) {
              //should get current node itme and update the time.
              let currentitem = this.graph
                .getGraph()
                .findById(nodeData.nodes[index].id);
              //dynimic set the state: missing notreay
              if (currentTaskRun?.status?.conditions[0]?.reason == undefined) {
                return;
              }

              this.graph
                .getGraph()
                .setItemState(
                  currentitem,
                  currentTaskRun?.status?.conditions[0]?.reason,
                  ""
                );

              //when show pipeline will use current date time  less start time and then self-increment。
              let completionTime = currentTaskRun.status.completionTime;
              let totalTime: string;
              const currentStartTime = currentTaskRun.status.startTime;
              const st = new Date(currentStartTime).getTime();
              if (completionTime !== undefined) {
                const ct = new Date(completionTime).getTime();
                let result = Math.floor((ct - st) / 1000);
                totalTime = this.secondsToHms(result);
              } else {
                const ct = new Date().getTime();
                let result = Math.floor((ct - st) / 1000);
                totalTime = this.secondsToHms(result);
              }

              //set the time
              this.graph
                .getGraph()
                .setItemState(currentitem, "time", totalTime);
            }
          });
        }
      }, 1000);
    }
  }
  hiddenPipelineGraph = () => {
    clearInterval(this.timeIntervalID);
    this.isHiddenPipelineGraph = true;
  };
  render() {
    return (
      <>
        {/* 99.5% prevent horizontal scroll bar */}
        {/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ */}
        <div style={{ width: "99.5%" }}>
          <Graph
            open={this.isHiddenPipelineGraph}
            showSave={true}
            closeGraph={this.hiddenPipelineGraph}
          ></Graph>
        </div>
        <KubeObjectListLayout
          className="PipelineRuns"
          store={pipelineRunStore}
          dependentStores={[pipelineStore, taskRunStore]}
          sortingCallbacks={{
            [sortBy.name]: (pipelineRun: PipelineRun) => pipelineRun.getName(),
            [sortBy.ownernamespace]: (pipelineRun: PipelineRun) =>
              pipelineRun.getOwnerNamespace(),
            [sortBy.age]: (pipelineRun: PipelineRun) =>
              pipelineRun.getAge(false),
          }}
          onDetails={(pipeline: PipelineRun) => {
            clearInterval(this.timeIntervalID);
            this.showCurrentPipelineRunStatus(pipeline);
          }}
          searchFilters={[
            (pipelineRun: PipelineRun) => pipelineRun.getSearchFields(),
          ]}
          renderHeaderTitle={<Trans>PipelineRuns</Trans>}
          renderTableHeader={[
            {
              title: <Trans>Name</Trans>,
              className: "name",
              sortBy: sortBy.name,
            },
            {
              title: <Trans>OwnerNamespace</Trans>,
              className: "ownernamespace",
              sortBy: sortBy.ownernamespace,
            },
            { title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age },
          ]}
          renderTableContents={(pipelineRun: PipelineRun) => [
            pipelineRun.getName(),
            pipelineRun.getOwnerNamespace(),
            pipelineRun.getAge(),
          ]}
          renderItemMenu={(item: PipelineRun) => {
            return <PipelineRunMenu object={item} />;
          }}
        />
      </>
    );
  }
}

export function PipelineRunMenu(props: KubeObjectMenuProps<PipelineRun>) {
  return <KubeObjectMenu {...props} />;
}

apiManager.registerViews(pipelineRunApi, { Menu: PipelineRunMenu });
