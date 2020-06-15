import "./pipeline.scss";

import React from "react";
import { observer } from "mobx-react";
import { computed, observable, reaction, action } from "mobx";
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
import { KubeEventIcon } from "../+events/kube-event-icon";
import { apiManager } from "../../api/api-manager";
import { DrawerItem, DrawerTitle } from "../drawer";
import { Drawer } from "../drawer";
import "./registerShape";
import G6 from "@antv/g6";
import { Icon } from "../icon";
import { Select } from "../select";
import { _i18n } from "../../i18n";
import { Grid, Divider } from "@material-ui/core";
import { Step, StepUp, stepUp } from "./steps";
import { Input } from "../input";
import { MenuItem } from "../menu";
import { Button } from "../button";
import { TaskDrawer, taskDrawerEntity, TaskDrawerEntity } from "./task-drawer"

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
  @observable graph: any;
  @observable currentNode: any;
  @observable static isHiddenPipelineGraph: boolean = false;
  @observable taskArray: TaskDrawerEntity[] = [];
  @observable step: StepUp[] = [stepUp];
  @observable task: any;
  @observable taskEntity: TaskDrawerEntity = taskDrawerEntity;
  @observable taskRecord: string[] = [];

  addTask() {
    this.taskRecord.push("");
  }

  removeTask(index: number) {
    this.taskRecord.splice(index, 1);
  }



  renderTaskDrawer() {
    this.taskEntity.graph = this.graph;
    this.taskEntity.currentNode = this.currentNode;
    return (
      <div>
        {this.taskRecord.map((item, index) => {
          return (
            < TaskDrawer value={this.taskEntity} />
          );

        })}
      </div>
    )
  }

  SaveTask(taskId: number) {
    console.log("---------------------------------------------------------->current taskId:", taskId);
    this.taskArray[taskId] = this.taskEntity;
  }

  componentDidMount() {
    const data: any = {
      nodes: [
        {
          id: "1",
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

    this.graph = new G6.Graph({
      container: "container",
      width: 1150,
      height: 305,
      renderer: "svg",
      // layout: {
      //   type: "dagre",
      //   rankdir: 'LR',
      //   align: 'DL',
      //   controlPoints: true
      // },
      modes: {
        default: [
          "drag-node",
          {
            type: "tooltip",
            formatText: function formatText(model) {
              const text = "container: test,duration: 5min";
              return text;
            },
            // offset: 30
          },
        ],

        //   edit: ['click-select'],
        // addEdge: ['click-add-edge', 'click-select'],
      },
      defaultEdge: {
        type: "Line",
        style: {
          stroke: "#959DA5",
          lineWidth: 4,
        },
        // 其他配置
      },
      defaultNode: {
        type: "card-node",
        size: [120, 40],
        linkPoints: {
          left: true,
          right: true,
          size: 5,
        },
      },
      nodeStateStyles: {
        hover: {
          fillOpacity: 0.1,
          lineWidth: 2,
        },
      },
    });

    const bindEvents = () => {
      // 监听edge上面mouse事件
      this.graph.on("edge:mouseenter", (evt: { item: any; target: any }) => {
        const { item, target } = evt;
        // debugger
        const type = target.get("type");
        if (type !== "text") {
          return;
        }
        const model = item.getModel();
        const { endPoint } = model;
        const y = endPoint.y - 35;
        const x = endPoint.x - 150 - 10;
        const point = this.graph.getCanvasByPoint(x, y);
      });
    };

    this.graph.data(data);
    this.graph.setMode("addEdge");
    this.graph.render();

    // 监听鼠标进入节点事件
    this.graph.on("node:mouseenter", (evt: { item: any }) => {
      console.log("------------------------------>mouseenter");
      const node = evt.item;
      // 激活该节点的 hover 状态
      this.graph.setItemState(node, "hover", true);
    });

    // 监听鼠标离开节点事件
    this.graph.on("node:mouseleave", (evt: { item: any }) => {
      const node = evt.item;
      // 关闭该节点的 hover 状态
      this.graph.setItemState(node, "hover", false);
    });
    var index = 0;
    this.graph.on("node:click", (evt: any) => {
      const { item } = evt;
      const shape = evt.target.cfg.name;

      if (shape === "right-plus") {
        const source = item._cfg.id;
        const target = Number(source) + 1;

        const model = item.getModel();
        const { x, y } = model;
        const point = this.graph.getCanvasByPoint(x, y);
        this.graph.addItem("node", {
          id: target.toString(),
          buildName: "task" + target,
          x: Number(point.x) + 300,
          y: Number(point.y),
          anchorPoints: [
            [0, 0.5],
            [1, 0.5],
          ],
        });

        this.graph.addItem("edge", {
          source: target.toString(),
          target: model.id,
        });

        return;
      }

      if (shape === "bottom-plus") {
        const source = item._cfg.id;
        const target = Number(source) + 10;

        const model = item.getModel();
        const { x, y } = model;
        const point = this.graph.getCanvasByPoint(x, y);
        this.graph.addItem("node", {
          buildName: "task" + target,
          id: target.toString(),
          x: Number(point.x),
          y: Number(point.y) + 80,
          anchorPoints: [
            [0, 0.5],
            [1, 0.5],
          ],
        });

        this.graph.addItem("edge", {
          type: "hvh",
          source: target.toString(),
          target: model.id,
        });
        return;
      }
      this.currentNode = item;
      let group = item.getContainer();
      let title = group.get("children")[2];
      this.taskName = title.cfg.el.innerHTML;
      // let status = group.get("children")[5];
      // if (index === 0) {
      //   this.graph.setItemState(item, "succeed", '');


      // }
      // if (index === 1) {
      //   this.graph.setItemState(item, "failed", '');

      // }
      // if (index === 2) {
      //   this.graph.setItemState(item, "pending", '');
      // }
      // index++;
      // if (index === 3) {
      //   index = 0;
      // }
      // let currentTask = this.taskMap.get(title.cfg.el.innerHTML)
      // if (currentTask != null) {
      //   this.taskEntity = currentTask;
      // }
      // this.taskEntity.addParams = [];
      let currentTask = this.taskArray[this.currentNode._cfg.id];
      if (currentTask != null) {
        this.taskEntity = currentTask;
      } else {
        this.taskEntity.graph = this.graph;
        this.taskEntity.currentNode = this.currentNode;
        this.taskEntity.addParams = [];
        this.taskEntity.addResources = [];
        this.taskEntity.step = []
      }
      this.removeTask(0);
      this.addTask();
      TaskDrawer.open();
    });
  }

  render() {
    return (
      <>
        <div hidden={
          Pipelines.isHiddenPipelineGraph ?? true
        }>
          <Grid container spacing={1}>

            <Grid item xs={3}>
              <h5 className="title">
                <Trans>Pipeline Visualization</Trans>
              </h5>
            </Grid>
            <Grid item xs={3}></Grid>
            <Grid item xs={3}></Grid>
            <Grid item xs="auto">
              <Button primary onClick={() => console.log("test")}>
                <span>Run</span>
              </Button>
            </Grid>
            <Grid item xs="auto">
              <Button primary onClick={() => console.log("test")}>
                <span>ReRun</span>
              </Button>
            </Grid>
            <Grid item xs="auto">
              <Button primary onClick={() => console.log("test")}>
                <span>Cancel</span>
              </Button>
            </Grid>
          </Grid>
        </div>

        <div
          className="graph"
          id="container"
          hidden={
            Pipelines.isHiddenPipelineGraph ?? true
          }
        >


        </div>
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
        {this.renderTaskDrawer()}
      </>
    );
  }
}

export function PipelineMenu(props: KubeObjectMenuProps<Pipeline>) {
  const { object, toolbar } = props;
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
