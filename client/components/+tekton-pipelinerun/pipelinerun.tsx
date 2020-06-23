import "./pipelinerun.scss";

import React from "react";
import { observer } from "mobx-react";
import { RouteComponentProps } from "react-router";
import { Trans } from "@lingui/macro";
import { PipelineRun, pipelineRunApi } from "../../api/endpoints";
import { podsStore } from "../+workloads-pods/pods.store";
import { pipelineRunStore } from "../+tekton/pipelinerun.store";
import { pipelineStore } from "../+tekton/pipeline.store";
import { nodesStore } from "../+nodes/nodes.store";
import { eventStore } from "../+events/event.store";
import { KubeObjectMenu, KubeObjectMenuProps } from "../kube-object/kube-object-menu";
import { KubeObjectListLayout } from "../kube-object";
import { apiManager } from "../../api/api-manager";
import { observable } from "mobx";
import { PipelineGraph } from "../+graphs/pipeline-graph"
import { Graph } from "../+graphs/graph"
import { string } from "yargs";

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
    this.graph.bindClickOnNode(() => {
    });
    this.graph.bindMouseenter();
    this.graph.bindMouseleave();
  }


  //show  pipeline 
  showCurrentPipelineStatus(pipelinerun: PipelineRun) {
    if (PipelineRuns.isHiddenPipelineGraph === undefined) {
      PipelineRuns.isHiddenPipelineGraph = true;
    }
    PipelineRuns.isHiddenPipelineGraph ? PipelineRuns.isHiddenPipelineGraph = false : PipelineRuns.isHiddenPipelineGraph = true

    const pipeline = pipelineStore.getByName(pipelinerun.spec.pipelineRef.name);



    // const taskruns: Map<string, any> = JSON.parse(JSON.stringify(p));
    // Object.keys(taskruns).map(function (key: string, index: number) {

    //   console.log(key);
    // });



    // let taskArray: string[] = [];
    // const taskruns = new Map<string, any>();
    // for (let key in pipelinerun.status.taskRuns) {
    //   taskruns.set(key, pipelinerun.status.taskRuns[key])
    // }
    // taskruns.set("a", "a");
    // console.log(taskruns)

    // for (const key in taskruns) {
    //   console.log('The value for ' + key + ' is = ' + taskruns[key] as string);
    // }
    // Object.keys(taskruns).map(function (key: string, index: number) {
    //   taskArray[index] = key;
    //   console.log(taskruns.get(key));
    // });



    // console.log("taskrun.----------------------------------------", taskruns);
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
      this.graph.getGraph().clear();
    } else {

      this.graph.getGraph().clear();
      let node = JSON.parse(nodeData);

      const nodeMap = new Map<string, any>();
      node.nodes.map((item: any, index: number) => {
        nodeMap.set(item.taskName, item)
      })

      setTimeout(() => {

        Object.keys(taskruns).map(function (key: string, index: number) {
          let currentTask = pipelinerun.status.taskRuns[key];
          console.log(pipelinerun.status.taskRuns[key]);
          let taskNode = nodeMap.get(pipelinerun.status.taskRuns[key].pipelineTaskName);
          taskNode.status = currentTask.status.conditions[0].reason;
          node.nodes[index] = taskNode
          console.log(node);
        });

        this.graph.getGraph().changeData(node);

      }, 20);

    }

  }

  render() {

    return (
      <>
        <div style={{width:'99%'}}>
          <Graph open={PipelineRuns.isHiddenPipelineGraph} showSave={true}></Graph>
        </div>
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
      </>
    )
  }
}

export function PipelineRunMenu(props: KubeObjectMenuProps<PipelineRun>) {
  return (
    <KubeObjectMenu {...props} />
  )
}

apiManager.registerViews(pipelineRunApi, { Menu: PipelineRunMenu, })
