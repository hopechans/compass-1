import "./pipeline-visual-dialog.scss"

import React from "react";
import {observable} from "mobx";
import {Trans} from "@lingui/macro";
import {Dialog} from "../dialog";
import {Wizard, WizardStep} from "../wizard";
import {observer} from "mobx-react";
import {Pipeline, PipelineTask} from "../../api/endpoints";
import {graphId, Graphs, initData} from "../+tekton-graph/graphs";
import {CopyTaskDialog} from "../+tekton-task/copy-task-dialog";
import {PipelineResult} from "../+tekton-graph/graph";
import {PipelineSaveDialog} from "./pipeline-save-dialog";

interface Props extends Partial<Props> {
}

@observer
export class PipelineVisualDialog extends React.Component<Props> {

  @observable static isOpen = false;
  @observable static Data: Pipeline = null;
  @observable graph: any = null;
  @observable currentNode: any = null;
  @observable data: any = null;

  get pipeline() {
    return PipelineVisualDialog.Data
  }

  static open(obj: Pipeline) {
    PipelineVisualDialog.isOpen = true;
    PipelineVisualDialog.Data = obj;
  }

  onOpen = async () => {
    setTimeout(() => {
      this.graph = new Graphs();
      this.graph.init();

      let nodeData: any = null;
      this.pipeline.getAnnotations().filter((item) => {
        const tmp = item.split("=");
        if (tmp[0] == "node_data") {
          nodeData = tmp[1];
        }
      });

      this.graph.instance.clear();
      if (nodeData === undefined || nodeData === "") {
        this.graph.instance.changeData(initData);
      } else {
        setTimeout(() => {
          this.graph.instance.changeData(JSON.parse(nodeData));
        }, 10);
      }

      this.graph.bindClickOnNode((currentNode: any) => {
        this.currentNode = currentNode;
        CopyTaskDialog.open(this.graph, this.currentNode);
      });
      this.graph.bindMouseenter();
      this.graph.bindMouseleave();
      this.graph.render();

    }, 100)
  }

  //存取node{id,...} => <id,node>
  nodeToMap(): Map<string, any> {

    console.log("data", this.data)

    let items: Map<string, any> = new Map<string, any>();
    this.data.nodes.map((item: any) => {
      const ids = item.id.split("-");
      if (items.get(ids[0]) === undefined) {
        items.set(ids[0], new Array<any>())
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

  save = async () => {
    this.data = this.graph.instance.save()
    const data = JSON.stringify(this.data);
    this.pipeline.metadata.annotations = { node_data: data };

    const pipelineTasks = this.pipeline.spec.tasks;
    if (pipelineTasks !== undefined) {
      this.getPipelineTasks().map((task) => {
        const t = pipelineTasks.find((x) => x.name == task.name);
        if (t === undefined) {
          this.pipeline.spec.tasks.push(task);
        }
      });
    } else {
      this.pipeline.spec.tasks = [];
      this.pipeline.spec.tasks.push(...this.getPipelineTasks());
    }

    PipelineSaveDialog.open(this.pipeline)
  };

  static close() {
    PipelineVisualDialog.isOpen = false;
  }

  close = () => {
    PipelineVisualDialog.close();
  };

  reset = () => {
    this.data = null;
  }

  render() {
    const header = (
      <h5>
        <Trans>Pipeline Visualization</Trans>
      </h5>
    );

    return (
      <Dialog
        isOpen={PipelineVisualDialog.isOpen}
        className="PipelineVisualDialog"
        onOpen={this.onOpen}
        close={this.close}>
        <Wizard header={header} done={this.close}>
          <WizardStep contentClass="flex gaps column" nextLabel={<Trans>Save</Trans>} next={this.save}>
            <div className="container" id={graphId}/>
          </WizardStep>
        </Wizard>
      </Dialog>
    )
  }

}