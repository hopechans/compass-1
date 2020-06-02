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
import { KubeObjectMenu, KubeObjectMenuProps } from "../kube-object/kube-object-menu";
import { KubeObjectListLayout } from "../kube-object";
import { KubeEventIcon } from "../+events/kube-event-icon";
import { apiManager } from "../../api/api-manager";
import { Drawer } from "../drawer";
import './registerShape';
import G6 from '@antv/g6';

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

    @observable taskDrawer = false;

    @action
    openTaskDrawer(){
      setTimeout(()=>{
        this.taskDrawer = true
      },200)
    }

    @action
    closeTaskDrawer(){
      this.taskDrawer = false
    }

    renderTaskDrawer(){
      const { taskDrawer } = this
      return (
        <Drawer
            className="flex column"
            open={taskDrawer}
            title="Task Detail"
            onClose = {()=>this.closeTaskDrawer()}
          >
            <h3>todo</h3>
        </Drawer>
      )
    }

    componentDidMount(){
     
        const data = {
            nodes: [
              {
                id: '1', x: 5, y: 5,
              },
            ],
        };
    
        const graph = new G6.Graph({
          container: 'container',
          width: 1100,
          height: 200,
          renderer: 'svg',
          modes: {
          //   default: ['drag-node'],
          //   edit: ['click-select'],
            // addEdge: ['click-add-edge', 'click-select'],
          },
          defaultEdge: {
            type: 'hvh',
            // 其他配置
          },
          defaultNode: {
            type: 'pipeline-node',
            size: [120, 40],
            linkPoints: {
              top: true,
              bottom: true,
              left: true,
              right: true,
              fill: '#fff',
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
          graph.on('edge:mouseenter', (evt: { item: any; target: any; }) => {
            const { item, target } = evt
            // debugger
            const type = target.get('type')
            if (type !== 'text') {
              return
            }
            const model = item.getModel()
            const { endPoint } = model
            // y=endPoint.y - height / 2，在同一水平线上，x值=endPoint.x - width - 10
            const y = endPoint.y - 35
            const x = endPoint.x - 150 - 10
            const point = graph.getCanvasByPoint(x, y)
          //   setEdgeTooltipX(point.x)
          //   setEdgeTooltipY(point.y)
          //   setShowEdgeTooltip(true)
          })
    
        }
        
        graph.data(data);
        graph.setMode('addEdge');
        graph.render();
    
        // 监听鼠标进入节点事件
        graph.on('node:mouseenter', (evt: { item: any; }) => {
          console.log('------------------------------>mouseenter');
          const node = evt.item;
          // 激活该节点的 hover 状态
          graph.setItemState(node, 'hover', true);
        });
    
        // 监听鼠标离开节点事件
        graph.on('node:mouseleave', (evt: { item: any; }) => {
          const node = evt.item;
          // 关闭该节点的 hover 状态
          graph.setItemState(node, 'hover', false);
        });
    
        graph.on('node:click', (evt: any) => {
          const { item } = evt;
          this.openTaskDrawer()
          const shape = evt.target.cfg.name;
          if (shape === 'right-plus') {
            const source = item._cfg.id;
            const target = Number(source) + 1;
    
            const model = item.getModel()
            const { x, y } = model
            const point = graph.getCanvasByPoint(x, y)
            graph.addItem('node',
              {
                id: target.toString(),
                // title: 'Task' + target,
                x: Number(point.x) + 200,
                y: Number(point.y),
    
              },
            );
    
            graph.addItem('edge', {
              source: target.toString(),
              target: model.id,
              // sourceAnchor: 0,
              // targetAnchor: 10,
            });
          }
    
          if (shape === 'bottom-plus') {
            const source = item._cfg.id;
            const target = Number(source) + 10;
    
            const model = item.getModel()
            const { x, y } = model
            const point = graph.getCanvasByPoint(x, y)
            graph.addItem('node',
              {
                id: target.toString(),
                x: Number(point.x),
                y: Number(point.y) + 80,
    
              },
            );
    
            graph.addItem('edge', {
              type: 'hvh',
              source: target.toString(),
              target: '2',
              sourceAnchor: 0,
              targetAnchor: 10,
            });
          }
    
          if (shape === 'dom1'){
            console.log("点击了当前的dom。。。。。。。。。")
          }
        });
    }

    render() {
        return (
            <>
              <div className="graph" id="container">
                <h5 className="title"><Trans>Pipeline Visualization </Trans></h5>
              </div>
              <KubeObjectListLayout
                className="Pipelines" store={pipelineStore}
                dependentStores={[podsStore, nodesStore, eventStore]}  // other
                sortingCallbacks={{
                    [sortBy.name]: (pipeline: Pipeline) => pipeline.getName(),
                    [sortBy.namespace]: (pipeline: Pipeline) => pipeline.getNs(),
                    [sortBy.age]: (pipeline: Pipeline) => pipeline.getAge(false),
                    [sortBy.tasks]: (pipeline: Pipeline) => pipeline.getTasks().length,
                }}
                searchFilters={[
                    (pipeline: Pipeline) => pipeline.getSearchFields(),
                ]}
                renderHeaderTitle={<Trans>Tekton Pipeline</Trans>}
                renderTableHeader={[
                    { title: <Trans>Name</Trans>, className: "name", sortBy: sortBy.name },
                    { title: <Trans>Namespace</Trans>, className: "namespace", sortBy: sortBy.namespace },
                    { title: <Trans>Tasks</Trans>, className: "tasks", sortBy: sortBy.tasks },
                    { title: <Trans>TaskNames</Trans>, className: "tasknames", sortBy: sortBy.tasknames },
                    { title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age },
                ]}
                renderTableContents={(pipeline: Pipeline) => [
                    pipeline.getName(),
                    pipeline.getNs(),
                    pipeline.getTasks().length,
                    pipeline.getTaskSet().map(
                        task => <p key={task}>{task}</p>
                    ),
                    pipeline.getAge(),
                ]}
                renderItemMenu={(item: Pipeline) => {
                    return <PipelineMenu object={item} />
                }}
                tableProps={{
                    customRowHeights: (item: Pipeline, lineHeight, paddings) => {
                        const lines = item.getTaskSet().length || 1;
                        return lines * lineHeight + paddings;
                    }
                }}
              />
              {this.renderTaskDrawer()}
            </>
        )
    }
}

export function PipelineMenu(props: KubeObjectMenuProps<Pipeline>) {
    return (
        <KubeObjectMenu {...props} />
    )
}

apiManager.registerViews(pipelineApi, { Menu: PipelineMenu, })
