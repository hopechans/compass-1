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
import {PipelineSaveDialog} from "./pipeline-save-dialog";
import {tektonGraphStore} from "../+tekton-graph/tekton-graph.store";
import {pipelineStore} from "./pipeline.store";

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

      const anchor = document.getElementsByClassName("step-content")[0]
      // const anchor = document.getElementById("container")
      const width = anchor.scrollWidth - 50;
      const height = anchor.scrollHeight - 50;

      this.graph = new Graphs(width, height);
      this.graph.init();

      this.graph.instance.data(this.pipeline.getNodeData())
      this.graph.bindClickOnNode((currentNode: any) => {
        this.currentNode = currentNode;
        CopyTaskDialog.open(this.graph, this.currentNode);
      });

      this.graph.bindMouseenter();
      this.graph.bindMouseleave();
      // this.graph.instance.bindMouseleave();
      // this.graph.instance.bindClickOnNode();

      this.graph.render();

    }, 100)
  }

  //存取node{id,...} => <id,node>
  nodeToMap(): Map<string, any> {
    let items: Map<string, any> = new Map<string, any>();
    this.data.nodes.map((item: any) => {
      const ids = item.id.split("-");
      if (items.get(ids[0]) === undefined) { items.set(ids[0], new Array<any>()) }
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

  updateTektonGraph = async (data: string) => {
    const graphName = this.pipeline.getName() + (new Date().getTime().toString())
    await tektonGraphStore.create({name: graphName, namespace: "ops"}, {
      spec: {
        data: data
      }
    })
    this.pipeline.metadata.annotations = { "fuxi.nip.io/tektongraphs": graphName };
    await pipelineStore.update(this.pipeline, {...this.pipeline});
  }

  save = async () => {
    this.data = this.graph.instance.save()
    const data = JSON.stringify(this.data);
    let annotations = this.pipeline.metadata? this.pipeline.metadata.annotations: undefined;
    const graphName = annotations? annotations["fuxi.nip.io/tektongraphs"] : "";

    if (graphName != "") {
      try{
        let tektonGraph = tektonGraphStore.getByName(graphName, "ops");
        if (tektonGraph.spec.data !== data) { await this.updateTektonGraph(data) }
      }catch (e) { await this.updateTektonGraph(data) }
    }else {
      await this.updateTektonGraph(data)
    }

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
            <div className={graphId} id={graphId}/>
          </WizardStep>
        </Wizard>
      </Dialog>
    )
  }

}