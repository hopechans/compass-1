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
// import { Input } from "../input";
// import { Select } from "../select";
import { MultiContainerDetails } from "../+deploy-container";
import { _i18n } from "../../i18n";
import {
  TextField,
  MenuItem,
  InputLabel,
  Select,
  Button,
  Typography,
  Grid,
  Divider,
} from "@material-ui/core";
import Step from "./steps";
import { Input } from "../input";

enum sortBy {
  name = "name",
  namespace = "namespace",
  tasks = "tasks",
  tasknames = "tasknames",
  age = "age",
}

interface Props extends RouteComponentProps {}

@observer
export class Pipelines extends React.Component<Props> {
  @observable taskDrawer = false;
  @observable taskName: string = "";
  @observable graph: any;
  @observable currentNode: any;
  @observable addParams: string[] = [];
  @observable addResources: string[] = [];

  @action
  openTaskDrawer() {
    setTimeout(() => {
      this.taskDrawer = true;
    }, 200);
  }

  @action
  closeTaskDrawer() {
    this.taskDrawer = false;
  }

  handleSelectRepo = (e: any) => {
    e.stopPropagation();
  };

  handleTaskName = (e: any) => {
    this.taskName = e.target.value;
    this.graph.setItemState(this.currentNode, "click", this.taskName);
  };

  addParam = () => {
    this.addParams.push("");
  };

  removeParam = (index: number) => {
    this.addParams.splice(index, 1);
  };

  addResource = () => {
    this.addResources.push("");
  };

  removeResource = (index: number) => {
    this.addResources.splice(index, 1);
  };

  renderResourceHeader = () => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}></Grid>
        <Grid item xs={12}>
          <Divider />
          <Icon
            small
            tooltip={"resource"}
            material="add_circle_outline"
            onClick={(e) => {
              this.addResource();
              e.stopPropagation();
            }}
          />
          <b> Add Pipeline Resources:</b>
        </Grid>
        <Grid item xs={5}>
          <Trans>Name</Trans>
        </Grid>
        <Grid item xs={5}>
          <Trans>ResourceType</Trans>
        </Grid>
      </Grid>
    );
  };

  renderInputs() {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}></Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={3}>
          <Icon
            small
            tooltip={"inputs"}
            material="add_circle_outline"
            onClick={(e) => {
              this.addResource();
              e.stopPropagation();
            }}
          />
          <b> Add Pipeline Inputs:</b>
        </Grid>
      </Grid>
    );
  }

  renderResource() {
    return (
      <div className="Resource">
        {this.renderResourceHeader()}
        {this.addResources.map((item, index) => {
          return (
            <Grid container spacing={2}>
              <Grid item xs={5}>
                <Select
                  labelId="demo-controlled-open-select-label"
                  id="demo-controlled-open-select"
                  style={{ width: "50ch" }}
                  // open={open}
                  // onClose={handleClose}
                  // onOpen={handleOpen}
                  // value={age}
                  onChange={(e: any) => {
                    {
                      e.stopPropagation();
                    }
                  }}
                >
                  <MenuItem value={10}>test1</MenuItem>
                  <MenuItem value={20}>test2</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={5}>
                <Select
                  labelId="demo-controlled-open-select-label"
                  id="demo-controlled-open-select"
                  style={{ width: "50ch" }}
                  // open={open}
                  // onClose={handleClose}
                  // onOpen={handleOpen}
                  // value={age}
                  onChange={(e: any) => {
                    {
                      e.stopPropagation();
                    }
                  }}
                >
                  <MenuItem value={10}>git</MenuItem>
                  <MenuItem value={20}>image</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={1}>
                <Icon
                  small
                  material="remove_circle_outline"
                  onClick={(e) => {
                    this.removeResource(index);
                    e.stopPropagation();
                  }}
                />
              </Grid>
            </Grid>
          );
        })}
      </div>
    );
  }

  renderParamsHeader() {
    return (
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}></Grid>
          <Grid item xs={12}>
            <Icon
              small
              tooltip={"Params"}
              material="add_circle_outline"
              onClick={(e) => {
                this.addParam();
                e.stopPropagation();
              }}
            />

            <b>Add Pipeline Params:</b>
          </Grid>
          <Grid item xs={3}>
            <Trans>Name</Trans>
          </Grid>
          <Grid item xs={3}>
            <Trans>Type</Trans>
          </Grid>
          <Grid item xs={3}>
            <Trans>Description</Trans>
          </Grid>
          <Grid item xs={3}>
            <Trans>Default</Trans>
          </Grid>
        </Grid>
      </div>
    );
  }

  renderParams() {
    return (
      <div className="params">
        {this.renderParamsHeader()}

        {this.addParams.map((item, index) => {
          return (
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Input />
              </Grid>
              <Grid item xs={3}>
                <Input />
              </Grid>
              <Grid item xs={3}>
                <Input />
              </Grid>
              <Grid item xs={2}>
                <Input />
              </Grid>
              <Grid item xs={1}>
                <Icon
                  small
                  material="remove_circle_outline"
                  onClick={(e) => {
                    this.removeParam(index);
                    e.stopPropagation();
                  }}
                />
              </Grid>
            </Grid>
          );
        })}
      </div>
    );
  }

  renderTaskDrawer() {
    const { taskDrawer } = this;
    return (
      <Drawer
        className="flex column"
        open={taskDrawer}
        title="Task Detail"
        onClose={() => this.closeTaskDrawer()}
      >
        <div className="taskName">
          <DrawerItem name={<b>Task Name:</b>}>
            <Input
              placeholder={"Task Name"}
              value={this.taskName}
              onChange={this.handleTaskName}
            />
          </DrawerItem>

          {this.renderParams()}
          {this.renderResource()}
          <Divider />
          <Step />
          {/* <DrawerItem name={<Trans>Repository:</Trans>}>
              <InputLabel id="demo-controlled-open-select-label">
                Repository
              </InputLabel>
              <Select
                labelId="demo-controlled-open-select-label"
                id="demo-controlled-open-select"
                style={{ width: "80ch" }}
                // open={open}
                // onClose={handleClose}
                // onOpen={handleOpen}
                // value={age}
                onChange={(e: any) => {
                  {
                    e.stopPropagation();
                  }
                }}
              >
                <MenuItem value={10}>github.com/yametech/compass</MenuItem>
                <MenuItem value={20}>github.com/yametech/fuxi</MenuItem>
              </Select>
            </DrawerItem>

            <DrawerItem name={<Trans>image:</Trans>}>
              <InputLabel id="demo-controlled-open-select-label">
                Repository
              </InputLabel>
              <Select
                labelId="demo-controlled-open-select-label"
                id="demo-controlled-open-select"
                style={{ width: "80ch" }}
                // open={open}
                // onClose={handleClose}
                // onOpen={handleOpen}
                // value={age}
                onChange={(e: any) => {
                  {
                    e.stopPropagation();
                  }
                }}
              >
                <MenuItem value={10}>yametech/compass</MenuItem>
                <MenuItem value={20}>yametech/fuxi</MenuItem>
              </Select>
            </DrawerItem>
            <DrawerItem name={<Trans>Step:</Trans>}></DrawerItem>
            <MultiContainerDetails /> */}
        </div>
      </Drawer>
    );
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
        // {
        //   id: '2',
        //   // x: 50,
        //   // y: 50,
        //   buildName: "打包镜像并推送到harbor",
        //   anchorPoints: [
        //     [0, 0.5],
        //     [1, 0.5],
        //   ],
        // },
        // {
        //   id: '3',
        //   // x: 100,
        //   // y: 100,
        //   buildName: "发布到k8s开发环境",
        //   anchorPoints: [
        //     [0, 0.5],
        //     [1, 0.5],
        //   ],
        // }
      ],
      // edges: [
      //   {
      //     id: 'edge1',
      //     target: '1',
      //     source: '2',
      //     // type: 'hvh',
      //   },
      //   {
      //     id: 'edge2',
      //     target: '2',
      //     source: '3',
      //     // type: 'hvh',
      //   },
      // ],
    };

    this.graph = new G6.Graph({
      container: "container",
      width: 1400,
      height: 200,
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
          // top: true,
          // bottom: true,
          left: true,
          right: true,
          // fill: 'red',
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
        // y=endPoint.y - height / 2，在同一水平线上，x值=endPoint.x - width - 10
        const y = endPoint.y - 35;
        const x = endPoint.x - 150 - 10;
        const point = this.graph.getCanvasByPoint(x, y);
        //   setEdgeTooltipX(point.x)
        //   setEdgeTooltipY(point.y)
        //   setShowEdgeTooltip(true)
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
      this.openTaskDrawer();
    });
  }

  render() {
    return (
      <>
        <div className="graph" id="container">
          {/* <h5 className="title"><Trans>Pipeline Visualization </Trans></h5> */}
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
        />
        {this.renderTaskDrawer()}
      </>
    );
  }
}

export function PipelineMenu(props: KubeObjectMenuProps<Pipeline>) {
  return <KubeObjectMenu {...props} />;
}

apiManager.registerViews(pipelineApi, { Menu: PipelineMenu });
