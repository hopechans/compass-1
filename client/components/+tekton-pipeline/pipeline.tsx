import "./pipeline.scss";

import React from "react";
import { observer } from "mobx-react";
import { observable } from "mobx";
import { RouteComponentProps } from "react-router";
import { Trans } from "@lingui/macro";
import { Pipeline, pipelineApi, TaskRef, Task, PipelineTask } from "../../api/endpoints";
import { podsStore } from "../+workloads-pods/pods.store";
import { pipelineStore } from "./pipeline.store";
import { nodesStore } from "../+nodes/nodes.store";
import { eventStore } from "../+events/event.store";
import { KubeObjectMenu, KubeObjectMenuProps } from "../kube-object";
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
import { configStore } from "../../../client/config.store";
import { Notifications } from "../notifications";

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
  @observable currentNode: any;
  @observable static isHiddenPipelineGraph: boolean = false;
  @observable step: StepUp[] = [stepUp];
  @observable task: any;
  @observable taskRecord: string[] = [];
  @observable pipeline: Pipeline;

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

  showPipeline = (pipeline: Pipeline) => {
    if (Pipelines.isHiddenPipelineGraph === undefined) {
      Pipelines.isHiddenPipelineGraph = true;
    }
    Pipelines.isHiddenPipelineGraph ? Pipelines.isHiddenPipelineGraph = false : Pipelines.isHiddenPipelineGraph = true

    let nodeData: any;
    pipeline.getAnnotations()
      .filter((item) => {
        const tmp = item.split("=");
        if (tmp[0] == "node_data") {
          nodeData = tmp[1];
        }
      })

    this.graph.getGraph().clear();
    this.graph.getGraph().changeData(JSON.parse(nodeData));
    this.pipeline = pipeline;
  }

  savePipeline = async () => {
    this.data = this.graph.getGraph().save();

    let items: Map<string, any> = new Map<string, any>();

    this.data.nodes.map((item: any, index: number) => {
      const ids = item.id.split("-");
      if (items.get(ids[0]) === undefined) {
        items.set(ids[0], new Array<any>());
      }
      items.get(ids[0]).push(item);
    });

    let keys = Array.from(items.keys());
    let b = 1;
    let tasks: PipelineTask[] = [];
    keys.map((item: any, index: number) => {
      let task = new PipelineTask();
      task.runAfter = [];
      if (b === 1) {
        let array = items.get(item);
        for (let i = 0; i < array.length; i++) {
          task.name = array[i].taskName;
          task.taskRef = { name: array[i].taskName };
        }
      } else {
        let array1 = items.get(item);
        let tmp = b - 1;
        let array2 = items.get(tmp.toString());
        for (let i = 0; i < array1.length; i++) {
          task.name = array1[i].taskName;
          task.taskRef = { name: array1[i].taskName };
          //set task runAfter
          for (let j = 0; j < array2.length; j++) {
            task.runAfter[j] = array2[j].taskName;
            console.log(task.runAfter);
          }

        }
      }
      b++;
      tasks.push(task);
    });



    try {
      this.pipeline.metadata.labels = { namespace: configStore.getDefaultNamespace() }
      this.pipeline.metadata.annotations = { "node_data": JSON.stringify(this.data) }
      this.pipeline.spec.tasks.push(...tasks);
      await pipelineStore.update(this.pipeline, { ...this.pipeline });
      // this.reset();
      // this.close();
    } catch (err) {
      Notifications.error(err);
    }
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
          onDetails={(pipeline: Pipeline) => { this.showPipeline(pipeline) }}
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
