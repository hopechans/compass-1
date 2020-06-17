import "./pipelinerun.scss";

import React from "react";
import {observer} from "mobx-react";
import {RouteComponentProps} from "react-router";
import {Trans} from "@lingui/macro";
import {PipelineRun, pipelineRunApi} from "../../api/endpoints";
import {podsStore} from "../+workloads-pods/pods.store";
import {pipelineRunStore} from "./pipelinerun.store";
import {nodesStore} from "../+nodes/nodes.store";
import {eventStore} from "../+events/event.store";
import {KubeObjectMenu, KubeObjectMenuProps} from "../kube-object/kube-object-menu";
import {KubeObjectListLayout} from "../kube-object";
import {apiManager} from "../../api/api-manager";
import {observable} from "mobx";
import {PipelineGraph} from "../+graphs/pipeline-graph"
import {Graph} from "../+graphs/graph"

enum sortBy {
  name = "name",
  namespace = "namespace",
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

  render() {

    return (
      <div>
        <Graph open={PipelineRuns.isHiddenPipelineGraph} showSave={true}></Graph>

        <KubeObjectListLayout
          className="PipelineRuns" store={pipelineRunStore}
          dependentStores={[podsStore, nodesStore, eventStore]}  // other
          sortingCallbacks={{
            [sortBy.name]: (pipelineRun: PipelineRun) => pipelineRun.getName(),
            [sortBy.namespace]: (pipelineRun: PipelineRun) => pipelineRun.getNs(),
            [sortBy.age]: (pipelineRun: PipelineRun) => pipelineRun.getAge(false),
            // [sortBy.pods]: (pipelineRun:PipelineRun) => this.getPodsLength(statefulSet),
          }}
          onDetails={() => {
            if (PipelineRuns.isHiddenPipelineGraph === undefined) {
              PipelineRuns.isHiddenPipelineGraph = true;
            }
            PipelineRuns.isHiddenPipelineGraph ? PipelineRuns.isHiddenPipelineGraph = false : PipelineRuns.isHiddenPipelineGraph = true
            console.log(PipelineRuns.isHiddenPipelineGraph);
          }}
          searchFilters={[
            (pipelineRun: PipelineRun) => pipelineRun.getSearchFields(),
          ]}
          renderHeaderTitle={<Trans>PipelineRuns</Trans>}
          renderTableHeader={[
            {title: <Trans>Name</Trans>, className: "name", sortBy: sortBy.name},
            {title: <Trans>Namespace</Trans>, className: "namespace", sortBy: sortBy.namespace},
            // { title: <Trans>Pods</Trans>, className: "pods", sortBy: sortBy.pods },
            // { className: "warning" },
            {title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age},
          ]}
          renderTableContents={(pipelineRun: PipelineRun) => [
            pipelineRun.getName(),
            pipelineRun.getNs(),
            // this.getPodsLength(statefulSet),
            // <KubeEventIcon object={statefulSet} />,
            pipelineRun.getAge(),
          ]}
          renderItemMenu={(item: PipelineRun) => {
            return <PipelineRunMenu object={item}/>
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

apiManager.registerViews(pipelineRunApi, {Menu: PipelineRunMenu,})
