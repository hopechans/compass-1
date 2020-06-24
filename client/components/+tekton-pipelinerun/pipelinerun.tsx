import "./pipelinerun.scss";

import React from "react";
import { observer } from "mobx-react";
import { RouteComponentProps } from "react-router";
import { Trans } from "@lingui/macro";
import { PipelineRun, pipelineRunApi } from "../../api/endpoints";
import { podsStore } from "../+workloads-pods/pods.store";
import { pipelineRunStore } from "./pipelinerun.store";
import { pipelineStore } from "../+tekton-pipeline/pipeline.store";
import { nodesStore } from "../+nodes/nodes.store";
import { eventStore } from "../+events/event.store";
import { KubeObjectMenu, KubeObjectMenuProps } from "../kube-object/kube-object-menu";
import { KubeObjectListLayout } from "../kube-object";
import { apiManager } from "../../api/api-manager";
import { observable } from "mobx";
import { PipelineGraph } from "../+graphs/pipeline-graph"
import { Graph } from "../+graphs/graph"

enum sortBy {
  name = "name",
  ownernamespace = "ownernamespace",
  pods = "pods",
  age = "age",
}

interface Props extends RouteComponentProps {
}

@observer
export class PipelineRuns extends React.Component<Props> {

  @observable static isHiddenPipelineGraph: boolean = false;
  @observable graph: any = null;

  componentDidMount() {
    this.graph = new PipelineGraph(0, 0);
  }


  //show  pipeline 
  showCurrentPipelineStatus(pipelinerun: PipelineRun) {
    if (PipelineRuns.isHiddenPipelineGraph === undefined) {
      PipelineRuns.isHiddenPipelineGraph = true;
    }
    PipelineRuns.isHiddenPipelineGraph ? PipelineRuns.isHiddenPipelineGraph = false : PipelineRuns.isHiddenPipelineGraph = true

    const pipeline = pipelineStore.getByName(pipelinerun.spec.pipelineRef.name);

    let taskruns = pipelinerun.status.taskRuns;
    let nodeData: any;
    pipeline.getAnnotations()
      .filter((item) => {
        const tmp = item.split("=");
        if (tmp[0] == "node_data") {
          nodeData = tmp[1];
        }
      });
    if (nodeData === undefined || nodeData === "") {
      //show nothing
      this.graph.getGraph().clear();
    } else {

      let node = JSON.parse(nodeData);
      const nodeMap = new Map<string, any>();
      node.nodes.map((item: any, index: number) => {
        nodeMap.set(item.taskName, item)
      });


      let status = ["Failed", "Succeeded", "Progress"]
      let a = 0;
      node.nodes.map((item: any, index: number) => {
        node.nodes[index].showtime = true;
        node.nodes[index].status = 'Progress';
      });
      this.graph.getGraph().clear();
      setTimeout(() => {
        this.graph.getGraph().changeData(node);
      }, 200);

      // setInterval(() => {

      //   node.nodes.map((item: any, index: number) => {
      //     node.nodes[index].showtime = true;
      //     node.nodes[index].time = a;
      //     // node.nodes[index].showtimeimg = 3;
      //     // if (node.nodes[index].status === 'Failed') {
      //     //   node.nodes[index].status = 'Succeeded';
      //     // } else {
      //     //   node.nodes[index].status = 'Failed'
      //     // }

      //   })

      //   this.graph.getGraph().changeData(node);
      //   a++;
      //   console.log(a);
      // }, 1500);


      setInterval(() => {
        node.nodes.map((item: any, index: number) => {
          let currentitem = this.graph.getGraph().findById(node.nodes[index].id);
          var today = new Date();
          let hour = today.getHours() + 'h';
          let seconds = today.getSeconds() + 's'
          this.graph.getGraph().setItemState(currentitem, "time", '1h3m' + '' + seconds);
          console.log("----------------------------->", '1h 3m' + ' ' + seconds);
        });
      }, 1)

    }

  }

  render() {

    return (
      <div>
        <Graph open={PipelineRuns.isHiddenPipelineGraph} showSave={true}></Graph>

        <KubeObjectListLayout

          className="PipelineRuns" store={pipelineRunStore} dependentStores={[pipelineStore]}
          sortingCallbacks={{
            [sortBy.name]: (pipelineRun: PipelineRun) => pipelineRun.getName(),
            [sortBy.ownernamespace]: (pipelineRun: PipelineRun) => pipelineRun.getOwnerNamespace(),
            [sortBy.age]: (pipelineRun: PipelineRun) => pipelineRun.getAge(false),
          }}
          onDetails={(pipeline: PipelineRun) => { this.showCurrentPipelineStatus(pipeline) }}
          searchFilters={[
            (pipelineRun: PipelineRun) => pipelineRun.getSearchFields(),
          ]}
          renderHeaderTitle={<Trans>PipelineRuns</Trans>}
          renderTableHeader={[
            { title: <Trans>Name</Trans>, className: "name", sortBy: sortBy.name },
            { title: <Trans>OwnerNamespace</Trans>, className: "ownernamespace", sortBy: sortBy.ownernamespace },
            { title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age },
          ]}
          renderTableContents={(pipelineRun: PipelineRun) => [
            pipelineRun.getName(),
            pipelineRun.getOwnerNamespace(),
            pipelineRun.getAge(),
          ]}
          renderItemMenu={(item: PipelineRun) => {
            return <PipelineRunMenu object={item} />
          }}
        />
      </div>
    )
  }
}

export function PipelineRunMenu(props: KubeObjectMenuProps<PipelineRun>) {
  return (
    <KubeObjectMenu {...props} />
  )
}

apiManager.registerViews(pipelineRunApi, { Menu: PipelineRunMenu, })
