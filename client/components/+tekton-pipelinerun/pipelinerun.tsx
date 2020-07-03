import "./pipelinerun.scss";

import React, { Fragment } from "react";
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
import { TooltipContent } from "../tooltip";
import { StatusBrick } from "../status-brick";
import { cssNames } from "../../utils";
import { MenuItem } from "../menu";
import { Icon } from "../icon";
import { Notifications } from "../notifications";


enum sortBy {
  name = "name",
  ownernamespace = "ownernamespace",
  reason = "reason",
  age = "age",
}

interface Props extends RouteComponentProps { }

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
    // let taskruns = pipelinerun.status.taskRuns;
    // let taskRunNames: string[] = [];
    // if (taskruns !== undefined) {
    //   Object.keys(taskruns).map(function (key: string, index: number) {
    //     taskRunNames.push(key);
    //   });
    // } else {
    //   console.error("getTaskRunName error:", pipelinerun.status);
    // }

    // return taskRunNames;

    if (pipelinerun?.status == undefined) {
      return [];
    }
    if (pipelinerun?.status?.taskRuns == undefined) {
      return [];
    }
    return (
      Object.keys(pipelinerun?.status?.taskRuns)
        .map((item: any) => {
          return item;
        })
        .slice() || []
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

  renderTasks(pipelinerun: PipelineRun) {
    const names = this.getTaskRunName(pipelinerun);

    if (names.length > 0) {
      // TODO:
      return names.map((item: string) => {
        const taskRun = taskRunStore.getByName(item);
        if (taskRun === undefined) {
          return;
        }
        let status = taskRun?.status?.conditions[0]?.reason;
        if (status === undefined) {
          status = "pending";
        }
        status = status.toLowerCase().toString();
        const stat = status;
        const name = taskRun.getName();
        const tooltip = (
          <TooltipContent tableView>
            <Fragment>
              <div className="title">
                Name - <span className="text-secondary">{name}</span>
              </div>
              <div className="title">
                LastTransitionTime -{" "}
                <span className="text-secondary">
                  {taskRun?.status?.conditions[0]?.lastTransitionTime}
                </span>
              </div>
              <div className="title">
                Massage -{" "}
                <span className="text-secondary">
                  {taskRun?.status?.conditions[0]?.message}
                </span>
              </div>
              <div className="title">
                Reason -{" "}
                <span className="text-secondary">
                  {taskRun?.status?.conditions[0]?.reason}
                </span>
              </div>
            </Fragment>
          </TooltipContent>
        );
        return (
          <Fragment key={name}>
            <StatusBrick className={cssNames(stat)} tooltip={tooltip} />
          </Fragment>
        );
      });
    }
  }

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
            [sortBy.ownernamespace]: (pipelineRun: PipelineRun) => pipelineRun.getOwnerNamespace(),
            [sortBy.reason]: (pipelineRun: PipelineRun) => pipelineRun.getErrorReason(),
            [sortBy.age]: (pipelineRun: PipelineRun) => pipelineRun.getAge(false),
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
            { title: <Trans>Name</Trans>, className: "name", sortBy: sortBy.name },
            { title: <Trans>OwnerNamespace</Trans>, className: "ownernamespace", sortBy: sortBy.ownernamespace },
            { title: <Trans>ErrorReason</Trans>, className: "reason", sortBy: sortBy.reason },
            { title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age },
            { title: <Trans>Tasks</Trans>, className: "tasks" },
            { title: <Trans>StartTime</Trans>, className: "startTime" },
            { title: <Trans>CompletionTime</Trans>, className: "completionTime", },
          ]}
          renderTableContents={(pipelineRun: PipelineRun) => [
            pipelineRun.getName(),
            pipelineRun.getOwnerNamespace(),
            pipelineRun.hasIssues() && <Icon material="warning" className={"pipelineRunWarningIcon"} />,
            pipelineRun.getErrorReason(),
            pipelineRun.getAge(),
            this.renderTasks(pipelineRun),
            pipelineRun.getStartTime() != "" ? new Date(pipelineRun.status.startTime).toLocaleString() : "",
            pipelineRun.getCompletionTime() != "" ? new Date(pipelineRun.status.startTime).toLocaleString() : "",
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
  const { object, toolbar } = props;
  return (
    <KubeObjectMenu {...props}>
      <MenuItem
        onClick={() => {
          //Cancel
          let pipelineRun = object;
          pipelineRun.spec.status = "PipelineRunCancelled";
          try {
            // //will update pipelineRun
            pipelineRunStore.update(pipelineRun, { ...pipelineRun });
            Notifications.ok(
              <>pipeline-run {pipelineRun.getName()} cancel successed</>
            );
          } catch (err) {
            Notifications.error(err);
          }
        }}
      >
        <Icon material="cancel" title={"cancel"} interactive={toolbar} />
        <span className="title">
          <Trans>Cancel</Trans>
        </span>
      </MenuItem>
      <MenuItem
        onClick={() => {
          //Cancel
          const pipelineRun = object;
          try {
            // //will delete pipelineRun
            pipelineRunStore.remove(pipelineRun);
            //and then create it. will re-run
            pipelineRunStore.create(
              { name: pipelineRun.getName(), namespace: "" },
              {
                spec: pipelineRun.spec,
              }
            );

            Notifications.ok(
              <>pipeline-run: {pipelineRun.getName()} rerun successed</>
            );
          } catch (err) {
            Notifications.error(err);
          }
        }}
      >
        <Icon material="autorenew" title={"rerun"} interactive={toolbar} />
        <span className="title">
          <Trans>Rerun</Trans>
        </span>
      </MenuItem>
    </KubeObjectMenu>
  );
}

apiManager.registerViews(pipelineRunApi, { Menu: PipelineRunMenu });
