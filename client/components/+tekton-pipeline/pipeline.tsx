import "./pipeline.scss";

import React from "react";
import { observer } from "mobx-react";
import { observable } from "mobx";
import { RouteComponentProps } from "react-router";
import { Trans } from "@lingui/macro";
import { Pipeline, pipelineApi, Task, PipelineTask } from "../../api/endpoints";
import { podsStore } from "../+workloads-pods/pods.store";
import { pipelineStore } from "./pipeline.store";
import { nodesStore } from "../+nodes/nodes.store";
import { eventStore } from "../+events/event.store";
import {
  KubeObjectMenu,
  KubeObjectMenuProps,
} from "../kube-object";
import { KubeObjectListLayout } from "../kube-object";
import { apiManager } from "../../api/api-manager";
import { _i18n } from "../../i18n";
import { StepUp, stepUp } from "./steps";
import { PipelineGraph } from "../+graphs/pipeline-graph"
import { Graph } from "../+graphs/graph"
import { CopyTaskDialog } from "./copy-task-dialog";
import { MenuItem } from "../menu";
import { Icon } from "../icon";
import { AddPipelineDialog } from "./add-pipeline-dialog";

enum sortBy {
  name = "name",
  namespace = "namespace",
  tasks = "tasks",
  tasknames = "tasknames",
  age = "age",
}

interface Props extends RouteComponentProps {

}

const showPipeline = () => {
  if (Pipelines.isHiddenPipelineGraph === undefined) {
    Pipelines.isHiddenPipelineGraph = true;
  }
  Pipelines.isHiddenPipelineGraph ? Pipelines.isHiddenPipelineGraph = false : Pipelines.isHiddenPipelineGraph = true
  console.log(Pipelines.isHiddenPipelineGraph);
}

@observer
export class Pipelines extends React.Component<Props> {
  @observable taskName: string = "";
  @observable currentNode: any;
  @observable static isHiddenPipelineGraph: boolean = false;
  @observable step: StepUp[] = [stepUp];
  @observable task: any;
  @observable taskRecord: string[] = [];
  private graph: PipelineGraph = null;
  data: any;

  componentDidMount() {
    this.graph = new PipelineGraph(0, 0);
    this.graph.bindClickOnNode(() => {
      CopyTaskDialog.open()
    });
    this.graph.bindMouseenter();
    this.graph.bindMouseleave();
  }

  savePipeline = () => {
    this.data = this.graph.getGraph().save();
    let tmpData = this.graph.getGraph().save();
    let tasks: PipelineTask[] = [];
    let item: any[] = [];
    console.log("========================================>data:", this.data);
    this.data.nodes.map((item: any, index: number) => {
      //runAfter:run在谁的后面。
      let id = item.id.split('-')
      let itema: any[] = [];
      this.data.nodes.map((itemA: any, indexA: number) => {
        let ida = item.id.split('-');
        if (id[0] = ida[0]) {
          itema.push(itemA.id);
        }
      })
      item.push(itema);
    })
    console.log("========================================>savePipeline:", item);
  }

  render() {
    return (
      <>
        <Graph open={Pipelines.isHiddenPipelineGraph} showSave={false} saveCallback={() => { this.savePipeline() }} />

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
              AddPipelineDialog.open()
            }
          }}
          onDetails={showPipeline}
        />
        <CopyTaskDialog />
        <AddPipelineDialog />
      </>
    );
  }
}

export function PipelineMenu(props: KubeObjectMenuProps<Pipeline>) {

  const { object, toolbar } = props;

  return (
    <KubeObjectMenu {...props}>
      <MenuItem onClick={() => {
      }}>
        <Icon
          material="format_align_left"
          title={"Pipeline"}
          interactive={toolbar}
        />
        <span className="title">
          <Trans>Run</Trans>
        </span>
      </MenuItem>
    </KubeObjectMenu>
  );
}

apiManager.registerViews(pipelineApi, { Menu: PipelineMenu });
