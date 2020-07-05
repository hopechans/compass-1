import "./pipeline.scss";

import React from "react";
import { observer } from "mobx-react";
import { observable } from "mobx";
import { RouteComponentProps } from "react-router";
import { Trans } from "@lingui/macro";
import { Pipeline, pipelineApi, PipelineTask } from "../../api/endpoints";
import { podsStore } from "../+workloads-pods/pods.store";
import { pipelineStore } from "./pipeline.store";
import { eventStore } from "../+events/event.store";
import { KubeObjectMenu, KubeObjectMenuProps } from "../kube-object";
import { KubeObjectListLayout } from "../kube-object";
import { apiManager } from "../../api/api-manager";
import { PipelineGraph } from "../+graphs/pipeline-graph";
import { Graph, PipelineResult, pipelineResult } from "../+graphs/graph";
import { CopyTaskDialog, task, TaskResult } from "./copy-task-dialog";
import { MenuItem } from "../menu";
import { Icon } from "../icon";
import { AddPipelineDialog } from "./add-pipeline-dialog";
import { taskStore } from "../+tekton-task/task.store";
import { PipelineDialog } from "./pipeline-dialog";
import { pipelineResourceStore } from "../+tekton-pipelineresource/pipelineresource.store";
import { PipelineRunDialog } from "./pipeline-run-dialog";

enum sortBy {
  name = "name",
  ownernamespace = "ownernamespace",
  tasks = "tasks",
  tasknames = "tasknames",
  age = "age",
}

interface Props extends RouteComponentProps { }

@observer
export class Pipelines extends React.Component<Props> {
  @observable currentNode: any;
  // @observable static isHiddenPipelineGraph: boolean = false;
  @observable isHiddenPipelineGraph: boolean = true;
  @observable pipeline: Pipeline;
  @observable task: TaskResult = task;
  @observable pipelineResources: [];
  @observable pipeResult: PipelineResult = pipelineResult;

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
    this.isHiddenPipelineGraph = false;

    let nodeData: any;
    pipeline.getAnnotations().filter((item) => {
      const tmp = item.split("=");
      if (tmp[0] == "node_data") {
        nodeData = tmp[1];
      }
    });
    this.graph.getGraph().clear();
    if (nodeData === undefined || nodeData === "") {
      const data: any = {
        nodes: [
          {
            id: "1-1",
            x: 0,
            y: 0,
            taskName: ``,
            anchorPoints: [
              [0, 0.5],
              [1, 0.5],
            ],
          },
        ],
      };

      this.graph.getGraph().changeData(data);
    } else {
      setTimeout(() => {
        this.graph.getGraph().changeData(JSON.parse(nodeData));
      }, 20);
    }

    this.pipeline = pipeline;
  };

  //存取node{id,...} => <id,node>
  nodeToMap(): Map<string, any> {
    let items: Map<string, any> = new Map<string, any>();
    this.data.nodes.map((item: any, index: number) => {
      const ids = item.id.split("-");
      if (items.get(ids[0]) === undefined) {
        items.set(ids[0], new Array<any>());
      }
      items.get(ids[0]).push(item);
    });

    return items;
  }

  //通过map的关系，形成要提交的任务，组装数据。
  getPipelineTasks(): PipelineTask[] {
    const dataMap = this.nodeToMap();
    let keys = Array.from(dataMap.keys());

    let tasks: PipelineTask[] = [];

    let tmp = 1;

    keys.map((item: any, index: number) => {
      let array = dataMap.get(item);

      if (tmp === 1) {
        let task: any = {};
        task.runAfter = [];
        array.map((item: any) => {
          task.name = item.taskName;
          task.taskRef = { name: item.taskName };
        });
        task.params = [];
        task.resources = [];
        tasks.push(task);
      } else {
        let result = tmp - 1;
        array.map((item: any) => {
          let task: any = {};
          task.runAfter = [];
          task.name = item.taskName;
          task.taskRef = { name: item.taskName };
          //set task runAfter
          dataMap.get(result.toString()).map((item: any) => {
            task.runAfter.push(item.taskName);
          });
          task.params = [];
          task.resources = [];
          tasks.push(task);
        });
      }

      tmp++;
    });

    return tasks;
  }

  savePipeline = async (pipeResult: PipelineResult) => {
    this.data = this.graph.getGraph().save();

    const data = JSON.stringify(this.graph.getGraph().save());

    this.pipeline.metadata.annotations = { node_data: data };

    const pipelineTasks = this.pipeline.spec.tasks;
    if (pipelineTasks !== undefined) {

      this.getPipelineTasks().map((task) => {
        const t = pipelineTasks.find(x => x.name == task.name);
        if (t === undefined) {
          this.pipeline.spec.tasks.push(task);
        }
      });
    } else {
      this.pipeline.spec.tasks = [];
      this.pipeline.spec.tasks.push(... this.getPipelineTasks());

    }


    //will show pipeline dialog
    PipelineDialog.open(this.pipeline);
  };

  hiddenPipelineGraph = () => {
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
            showSave={false}
            saveCallback={(pipelineResult: PipelineResult) => {
              this.savePipeline(pipelineResult);
            }}
            closeGraph={this.hiddenPipelineGraph}
          />
        </div>

        <KubeObjectListLayout
          className="Pipelines"
          store={pipelineStore}
          dependentStores={[taskStore, pipelineResourceStore]} // other
          sortingCallbacks={{
            [sortBy.name]: (pipeline: Pipeline) => pipeline.getName(),
            [sortBy.ownernamespace]: (pipeline: Pipeline) => pipeline.getOwnerNamespace(),
            [sortBy.age]: (pipeline: Pipeline) => pipeline.getAge(false),
            [sortBy.tasks]: (pipeline: Pipeline) => pipeline.getTasks().length,
          }}
          searchFilters={[(pipeline: Pipeline) => pipeline.getSearchFields()]}
          renderHeaderTitle={<Trans>Tekton Pipeline</Trans>}
          renderTableHeader={[
            { title: <Trans>Name</Trans>, className: "name", sortBy: sortBy.name },
            { title: <Trans>OwnerNamespace</Trans>, className: "ownernamespace", sortBy: sortBy.ownernamespace },
            { title: <Trans>Tasks</Trans>, className: "tasks", sortBy: sortBy.tasks },
            { title: <Trans>TaskNames</Trans>, className: "tasknames", sortBy: sortBy.tasknames },
            { title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age },
          ]}
          renderTableContents={(pipeline: Pipeline) => [
            pipeline.getName(),
            pipeline.getOwnerNamespace(),
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
              AddPipelineDialog.open();
            },
          }}
          onDetails={(pipeline: Pipeline) => {

            this.showPipeline(pipeline);
          }}
        />
        <CopyTaskDialog />
        <AddPipelineDialog />
        <PipelineDialog />
        <PipelineRunDialog />
      </>
    );
  }
}

export function PipelineMenu(props: KubeObjectMenuProps<Pipeline>) {
  const { object, toolbar } = props;

  return (
    <KubeObjectMenu {...props}>
      <MenuItem
        onClick={() => {
          PipelineRunDialog.open(object.getName());
        }}
      >
        <Icon
          material="play_circle_outline"
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
