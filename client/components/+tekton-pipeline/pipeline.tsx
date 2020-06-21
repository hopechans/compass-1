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
import { CopyTaskDialog, task, TaskResult } from "./copy-task-dialog";
import { MenuItem } from "../menu";
import { Icon } from "../icon";
import { AddPipelineDialog } from "./add-pipeline-dialog";
import { configStore } from "../../../client/config.store";
import { Notifications } from "../notifications";
import { taskStore } from "./task.store"

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

  @observable currentNode: any;
  @observable static isHiddenPipelineGraph: boolean = false;
  @observable pipeline: Pipeline;
  @observable task: TaskResult = task;

  private graph: PipelineGraph = null;
  data: any;


  componentDidMount() {
    this.graph = new PipelineGraph(0, 0);
    this.graph.bindClickOnNode((currentNode: any) => {
      this.currentNode = currentNode;
      CopyTaskDialog.open(this.graph, this.currentNode);
    });
    this.graph.bindMouseenter();
    this.graph.bindMouseleave();

  }

  showPipeline = (pipeline: Pipeline) => {
    if (Pipelines.isHiddenPipelineGraph === undefined) {
      Pipelines.isHiddenPipelineGraph = true;
    }
    Pipelines.isHiddenPipelineGraph ? Pipelines.isHiddenPipelineGraph = false : Pipelines.isHiddenPipelineGraph = true;


    let nodeData: any;
    pipeline.getAnnotations()
      .filter((item) => {
        const tmp = item.split("=");
        if (tmp[0] == "node_data") {
          nodeData = tmp[1];
        }
      })
    //
    if (nodeData === undefined || nodeData === "") {
      const data: any = {
        nodes: [
          {
            id: "1-1",
            x: 0,
            y: 0,
            taskName: "task1",
            anchorPoints: [
              [0, 0.5],
              [1, 0.5],
            ],
          },
        ],
      };
      this.graph.getGraph().changeData(data);
    } else {
      this.graph.getGraph().clear();
      setTimeout(() => {
        this.graph.getGraph().changeData(JSON.parse(nodeData));
      }, 20);
    }

    this.pipeline = pipeline;
  }

  savePipeline = async () => {
    this.data = this.graph.getGraph().save();
    let items: Map<string, any> = new Map<string, any>();

    //存取node{id,...} => <id,node>
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

    //通过map的关系，形成要提交的任务，组装数据。
    keys.map((item: any, index: number) => {

      if (b === 1) {
        let array = items.get(item);
        let task = new PipelineTask();
        task.runAfter = [];
        for (let i = 0; i < array.length; i++) {
          task.name = array[i].taskName;
          task.taskRef = { name: array[i].taskName };
        }
        tasks.push(task);
      } else {
        let array1 = items.get(item);
        let tmp = b - 1;
        let array2 = items.get(tmp.toString());
        for (let i = 0; i < array1.length; i++) {
          let task = new PipelineTask();
          task.runAfter = [];
          task.name = array1[i].taskName;
          task.taskRef = { name: array1[i].taskName };
          //set task runAfter
          for (let j = 0; j < array2.length; j++) {
            task.runAfter[j] = array2[j].taskName;
            console.log(task.runAfter);
          }
          tasks.push(task);

        }
      }
      b++;
    });



    console.log("====================================> tasks:", tasks);
    const data = JSON.stringify(this.graph.getGraph().save());
    //更新对应的pipeline
    try {
      this.pipeline.metadata.labels = { namespace: configStore.getDefaultNamespace() }
      this.pipeline.metadata.annotations = { "node_data": data }
      this.pipeline.spec.tasks = [];
      this.pipeline.spec.tasks.push(...tasks);
      await pipelineStore.update(this.pipeline, { ...this.pipeline });
    } catch (err) {
      console.log(err);
      // Notifications.error(err);
    }

    this.graph.getGraph().clear();
    this.graph.getGraph().changeData(JSON.parse(data));


  }

  render() {
    return (
      <>
        <Graph open={Pipelines.isHiddenPipelineGraph} showSave={false} saveCallback={() => { this.savePipeline() }} />

        <KubeObjectListLayout
          className="Pipelines"
          store={pipelineStore}
          dependentStores={[podsStore, nodesStore, eventStore, taskStore]} // other
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
