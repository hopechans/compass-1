import "./pipeline.scss";

import React from "react";
import { observer } from "mobx-react";
import { observable } from "mobx";
import { RouteComponentProps } from "react-router";
import { Trans } from "@lingui/macro";
import { Pipeline, pipelineApi, PipelineTask } from "../../api/endpoints";
import { pipelineStore } from "./pipeline.store";
import { KubeObjectMenu, KubeObjectMenuProps } from "../kube-object";
import { KubeObjectListLayout } from "../kube-object";
import { apiManager } from "../../api/api-manager";
import { Graph, PipelineResult, pipelineResult } from "../+tekton-graph/graph";
import {
  CopyTaskDialog,
  task,
  TaskResult,
} from "../+tekton-task/copy-task-dialog";
import {MenuItem} from "../menu";
import {Icon} from "../icon";
import {AddPipelineDialog} from "./add-pipeline-dialog";
import {taskStore} from "../+tekton-task/task.store";
import {PipelineSaveDialog} from "./pipeline-save-dialog";
import {pipelineResourceStore} from "../+tekton-pipelineresource/pipelineresource.store";
import {PipelineRunDialog} from "../+tekton-pipelinerun/pipeline-run-dialog";
import {PipelineVisualDialog} from "./pipeline-visual-dialog";
import {tektonGraphStore} from "../+tekton-graph/tekton-graph.store";

enum sortBy {
  name = "name",
  ownernamespace = "ownernamespace",
  tasks = "tasks",
  tasknames = "tasknames",
  age = "age",
}

interface Props extends RouteComponentProps {
}

@observer
export class Pipelines extends React.Component<Props> {

  @observable pipeline: Pipeline;
  @observable task: TaskResult = task;
  @observable pipelineResources: [];
  @observable pipeResult: PipelineResult = pipelineResult;


  render() {

    console.log("tG", tektonGraphStore.getByName("admin-aaa"))

    return (
      <>
        <KubeObjectListLayout
          isClusterScoped
          className="Pipelines"
          store={pipelineStore}
          dependentStores={[taskStore, pipelineResourceStore, tektonGraphStore]} // other
          sortingCallbacks={{
            [sortBy.name]: (pipeline: Pipeline) => pipeline.getName(),
            [sortBy.ownernamespace]: (pipeline: Pipeline) =>
              pipeline.getOwnerNamespace(),
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
              title: <Trans>OwnerNamespace</Trans>,
              className: "ownernamespace",
              sortBy: sortBy.ownernamespace,
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
          onDetails={
            (pipeline: Pipeline) => PipelineVisualDialog.open(pipeline)
          }
        />
        <PipelineVisualDialog />
        <CopyTaskDialog />
        <AddPipelineDialog />
        <PipelineSaveDialog />
        <PipelineRunDialog />
      </>
    );
  }
}

export function PipelineMenu(props: KubeObjectMenuProps<Pipeline>) {
  const { object, toolbar } = props;

  return (
    <KubeObjectMenu {...props}>
      <MenuItem onClick={() => { PipelineRunDialog.open(object.getName()) }}>
        <Icon
          material="play_circle_outline" title={"Pipeline"} interactive={toolbar} />
        <span className="title">
          <Trans>Run</Trans>
        </span>
      </MenuItem>
    </KubeObjectMenu>
  );
}

apiManager.registerViews(pipelineApi, { Menu: PipelineMenu });
