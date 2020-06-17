import "./pipeline.scss";

import React from "react";
import { observer } from "mobx-react";
import { observable } from "mobx";
import { RouteComponentProps } from "react-router";
import { Trans } from "@lingui/macro";
import { Pipeline, pipelineApi } from "../../api/endpoints";
import { podsStore } from "../+workloads-pods/pods.store";
import { pipelineStore } from "./pipeline.store";
import { nodesStore } from "../+nodes/nodes.store";
import { eventStore } from "../+events/event.store";
import {
  KubeObjectMenu,
  KubeObjectMenuProps,
} from "../kube-object/kube-object-menu";
import { KubeObjectListLayout } from "../kube-object";
import { apiManager } from "../../api/api-manager";
import "./register-shape";
import { _i18n } from "../../i18n";
import { StepUp, stepUp } from "./steps";
import { taskDrawerEntity, TaskDrawerEntity } from "./task-drawer"
import { PipelineGraph } from "../+graphs/pipeline-graph"
import { Graph } from "../+graphs/graph"

enum sortBy {
  name = "name",
  namespace = "namespace",
  tasks = "tasks",
  tasknames = "tasknames",
  age = "age",
}

interface Props extends RouteComponentProps {

}

@observer
export class Pipelines extends React.Component<Props> {
  @observable taskName: string = "";
  // @observable graph: any;
  @observable currentNode: any;
  @observable static isHiddenPipelineGraph: boolean = false;
  @observable taskArray: Array<TaskDrawerEntity> = new Array<TaskDrawerEntity>(100);
  @observable step: StepUp[] = [stepUp];
  @observable task: any;
  @observable taskEntity: TaskDrawerEntity = taskDrawerEntity;
  @observable taskRecord: string[] = [];
  private graph: PipelineGraph = null;

  // addTask() {
  //   this.taskRecord.push("");
  // }

  // removeTask(index: number) {
  //   this.taskRecord.splice(index, 1);
  // }



  // renderTaskDrawer() {
  //   this.taskEntity.graph = this.graph;
  //   this.taskEntity.currentNode = this.currentNode;
  //   return (
  //     <div>

  //       {this.taskRecord.map((item, index) => {
  //         return (
  //           < TaskDrawer value={this.taskEntity} onChange={(taskId: number) => (this.SaveTask(taskId))} />
  //         );

  //       })}
  //     </div>
  //   )
  // }

  // SaveTask(taskId: number) {
  //   this.taskArray.splice(taskId, 0, this.taskEntity);
  // }

  componentDidMount() {
    this.graph = new PipelineGraph(0, 0);
    this.graph.bindClickOnNode(() => { });
    this.graph.bindMouseenter();
    this.graph.bindMouseleave();
  }

  render() {
    return (
      <>

        <Graph open={Pipelines.isHiddenPipelineGraph}></Graph>

        <KubeObjectListLayout
          className="Pipelines"
          store={pipelineStore}
          dependentStores={[podsStore, nodesStore, eventStore]} // other
          sortingCallbacks={{
            [sortBy.name]: (pipeline: Pipeline) => pipeline.getName(),
            [sortBy.namespace]: (pipeline: Pipeline) => pipeline.getNs(),
            [sortBy.age]: (pipeline: Pipeline) => pipeline.getAge(false),
            [sortBy.tasks]: (pipeline: Pipeline) => pipeline.getTasks().length,
          }}
          searchFilters={[(pipeline: Pipeline) => pipeline.getSearchFields()]}
          renderHeaderTitle={<Trans>Tekton Pipeline</Trans>}
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
              title: <Trans>Tasks</Trans>,
              className: "tasks",
              sortBy: sortBy.tasks,
            },
            {
              title: <Trans>TaskNames</Trans>,
              className: "tasknames",
              sortBy: sortBy.tasknames,
            },
            { title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age },
          ]}
          renderTableContents={(pipeline: Pipeline) => [
            pipeline.getName(),
            pipeline.getNs(),
            pipeline.getTasks().length,
            pipeline.getTaskSet().map((task) => <p key={task}>{task}</p>),
            pipeline.getAge(),
          ]}
          renderItemMenu={(item: Pipeline) => {
            return <PipelineMenu object={item} />;
          }}
          tableProps={{
            customRowHeights: (item: Pipeline, lineHeight, paddings) => {
              const lines = item.getTaskSet().length || 1;
              return lines * lineHeight + paddings;
            },
          }}
          addRemoveButtons={{
            addTooltip: <Trans>Pipeline</Trans>,
            onAdd: () => {
              if (Pipelines.isHiddenPipelineGraph === undefined) {
                Pipelines.isHiddenPipelineGraph = true;
              }
              Pipelines.isHiddenPipelineGraph ? Pipelines.isHiddenPipelineGraph = false : Pipelines.isHiddenPipelineGraph = true
              console.log(Pipelines.isHiddenPipelineGraph);
            }
          }}
        />
        {/* {this.renderTaskDrawer()} */}
      </>
    );
  }
}

export function PipelineMenu(props: KubeObjectMenuProps<Pipeline>) {
  return (
    <KubeObjectMenu {...props}>
      {/* <MenuItem onClick={() => {
        if (Pipelines.isHiddenPipelineGraph === undefined) {
          Pipelines.isHiddenPipelineGraph = true;
        }
        Pipelines.isHiddenPipelineGraph ? Pipelines.isHiddenPipelineGraph = false : Pipelines.isHiddenPipelineGraph = true
        console.log(Pipelines.isHiddenPipelineGraph);
      }}>
        <Icon
          material="format_align_left"
          title={"Pipeline"}
          interactive={toolbar}
        />
        <span className="title">
          <Trans>Pipeline</Trans>
        </span>
      </MenuItem> */}
    </KubeObjectMenu >
  );
}

apiManager.registerViews(pipelineApi, { Menu: PipelineMenu });
