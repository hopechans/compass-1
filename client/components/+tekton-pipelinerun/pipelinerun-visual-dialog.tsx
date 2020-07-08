import "./pipelinerun-visual-dialog.scss"

import React from "react";
import {observable} from "mobx";
import {Trans} from "@lingui/macro";
import {Dialog} from "../dialog";
import {Wizard, WizardStep} from "../wizard";
import {observer} from "mobx-react";
import {PipelineRun} from "../../api/endpoints";
import {graphId, Graphs, initData} from "../+tekton-graph/graphs";
import {CopyTaskDialog} from "../+tekton-task/copy-task-dialog";

interface Props extends Partial<Props> {
}

@observer
export class PipelineRunVisualDialog extends React.Component<Props> {

  @observable static isOpen = false;
  @observable static Data: PipelineRun = null;
  @observable currentNode: any = null;

  get pipeline() {
    return PipelineRunVisualDialog.Data
  }

  static open(obj: PipelineRun) {
    PipelineRunVisualDialog.isOpen = true;
    PipelineRunVisualDialog.Data = obj;
  }

  onOpen = async () => {
    setTimeout(() => {
      const graph = new Graphs();
      graph.init();

      let nodeData: any = null;
      this.pipeline.getAnnotations().filter((item) => {
        const tmp = item.split("=");
        if (tmp[0] == "node_data") {
          nodeData = tmp[1];
        }
      });

      graph.instance.clear();
      if (nodeData === undefined || nodeData === "") {
        graph.instance.changeData(initData);
      } else {
        setTimeout(() => {
          graph.instance.changeData(JSON.parse(nodeData));
        }, 10);
      }

      graph.bindClickOnNode((currentNode: any) => {
        this.currentNode = currentNode
      });
      graph.bindMouseenter();
      graph.bindMouseleave();
      graph.render();

    }, 100)
  }

  static close() {
    PipelineRunVisualDialog.isOpen = false;
  }

  close = () => {
    PipelineRunVisualDialog.close();
  };

  render() {
    const header = (
      <h5>
        <Trans>PipelineRun Visualization</Trans>
      </h5>
    );

    return (
      <Dialog
        isOpen={PipelineRunVisualDialog.isOpen}
        className="PipelineRunVisualDialog"
        onOpen={this.onOpen}
        close={this.close}>
        <Wizard header={header} done={this.close}>
          <WizardStep contentClass="flex gaps column" nextLabel={<Trans>Save</Trans>}>
            <div className="container" id={graphId}/>
          </WizardStep>
        </Wizard>
      </Dialog>
    )
  }

}