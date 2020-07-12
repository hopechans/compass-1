import "./pipelinerun.scss";

import React, { Fragment } from "react";
import { observer } from "mobx-react";
import { RouteComponentProps } from "react-router";
import { Trans } from "@lingui/macro";
import { PipelineRun, pipelineRunApi, TaskRun } from "../../api/endpoints";
import { pipelineRunStore } from "./pipelinerun.store";
import { pipelineStore } from "../+tekton-pipeline/pipeline.store";
import { KubeObjectMenu, KubeObjectMenuProps } from "../kube-object";
import { KubeObjectListLayout } from "../kube-object";
import { apiManager } from "../../api/api-manager";
import { observable } from "mobx";
import { taskRunStore } from "../+tekton-taskrun";
import { TooltipContent } from "../tooltip";
import { StatusBrick } from "../status-brick";
import { cssNames } from "../../utils";
import { MenuItem } from "../menu";
import { Icon } from "../icon";
import { Notifications } from "../notifications";
import { PipelineRunIcon } from "./pipeline-run-icon";
import { podsStore } from "../+workloads-pods/pods.store";
import { configStore } from "../../config.store";
import Tooltip from "@material-ui/core/Tooltip";
import { PipelineRunVisualDialog } from "./pipelinerun-visual-dialog";
import { tektonGraphStore } from "../+tekton-graph/tekton-graph.store";

enum sortBy {
  name = "name",
  ownernamespace = "ownernamespace",
  reason = "reason",
  age = "age",
}

interface Props extends RouteComponentProps {
}

@observer
export class PipelineRuns extends React.Component<Props> {
  @observable isHiddenPipelineGraph: boolean = true;
  @observable graph: any = null;
  @observable timeIntervalID: any;
  @observable pipelineRun: any;

  renderTasks(pipelineRun: PipelineRun) {
    // const names: string[] = pipelineRun.getPipelineRefNodeData(
    //   pipelineRun.spec.pipelineRef.name
    // );

    console.log(pipelineRunStore.getNodeData(pipelineRun))

    const names: string[] = [];

    if (names.length > 0) {
      // TODO:
      return names.map((item: string) => {
        const taskRun = taskRunStore.getByName(item);
        if (taskRun === undefined) {
          return;
        }
        if (
          taskRun.status?.podName === "" ||
          taskRun.status?.podName === undefined
        ) {
          return;
        }
        //TODO：TypeError: Cannot read property '0' of undefined case page panic
        let status = taskRun?.status?.conditions[0]?.reason;

        if (status === undefined) {
          status = "pending";
        }
        status = status.toLowerCase().toString();
        const stat = status;
        const name = taskRun.getName();
        const tooltip = (
          <TooltipContent tableView>
            <Fragment>
              <div className="title">
                Name - <span className="text-secondary">{name}</span>
              </div>
              <div className="title">
                LastTransitionTime -{" "}
                <span className="text-secondary">
                  {taskRun?.status?.conditions[0]?.lastTransitionTime}
                </span>
              </div>
              <div className="title">
                Massage -{" "}
                <span className="text-secondary">
                  {taskRun?.status?.conditions[0]?.message}
                </span>
              </div>
              <div className="title">
                Reason -{" "}
                <span className="text-secondary">
                  {taskRun?.status?.conditions[0]?.reason}
                </span>
              </div>
            </Fragment>
          </TooltipContent>
        );
        return (
          <Fragment key={name}>
            <StatusBrick className={cssNames(stat)} tooltip={tooltip} />
          </Fragment>
        );
      });
    }
  }

  renderTime(time: string) {
    return (
      <TooltipContent className="PipelineRunTooltip">{time}</TooltipContent>
    );
  }

  renderPipelineName(name: string) {
    return (
      <div>
        <Tooltip title={name} placement="top-start">
          <span>{name}</span>
        </Tooltip>
      </div>
    );
  }

  render() {
    return (
      <>
        <KubeObjectListLayout
          isClusterScoped
          className="PipelineRuns"
          store={pipelineRunStore}
          dependentStores={[pipelineStore, taskRunStore, tektonGraphStore, podsStore]}
          sortingCallbacks={{
            [sortBy.name]: (pipelineRun: PipelineRun) => pipelineRun.getName(),
            [sortBy.ownernamespace]: (pipelineRun: PipelineRun) =>
              pipelineRun.getOwnerNamespace(),
            [sortBy.reason]: (pipelineRun: PipelineRun) =>
              pipelineRun.getErrorReason(),
            [sortBy.age]: (pipelineRun: PipelineRun) =>
              pipelineRun.getAge(false),
          }}
          onDetails={(pipelineRun: PipelineRun) => {
            clearInterval(this.timeIntervalID);
            // this.showCurrentPipelineRunStatus(pipeline);
            PipelineRunVisualDialog.open(pipelineRun);
          }}
          searchFilters={[
            (pipelineRun: PipelineRun) => pipelineRun.getSearchFields(),
          ]}
          renderHeaderTitle={<Trans>PipelineRuns</Trans>}
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
              title: <Trans>ErrorReason</Trans>,
              className: "reason",
              sortBy: sortBy.reason,
            },
            { title: <Trans>Tasks</Trans>, className: "tasks" },
            { title: <Trans>StartTime</Trans>, className: "startTime" },
            {
              title: <Trans>CompletionTime</Trans>,
              className: "completionTime",
            },
            { title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age },
          ]}
          renderTableContents={(pipelineRun: PipelineRun) => [
            this.renderPipelineName(pipelineRun.getName()),
            pipelineRun.getOwnerNamespace(),
            pipelineRun.hasIssues() && (
              <PipelineRunIcon object={pipelineRun.status.conditions[0]} />
            ),
            // pipelineRun.getErrorReason(),

            this.renderTasks(pipelineRun),
            this.renderTime(
              pipelineRun.getStartTime() != ""
                ? new Date(pipelineRun.status.startTime).toLocaleString()
                : ""
            ),
            this.renderTime(
              pipelineRun.getCompletionTime() != ""
                ? new Date(pipelineRun.status.startTime).toLocaleString()
                : ""
            ),
            pipelineRun.getAge(),
          ]}
          renderItemMenu={(item: PipelineRun) => {
            return <PipelineRunMenu object={item} />;
          }}
        />
        <PipelineRunVisualDialog />
      </>
    );
  }
}

export function PipelineRunMenu(props: KubeObjectMenuProps<PipelineRun>) {
  const { object, toolbar } = props;
  return (
    <KubeObjectMenu {...props}>
      <MenuItem
        onClick={() => {
          //Cancel
          let pipelineRun = object;
          pipelineRun.spec.status = "PipelineRunCancelled";
          try {
            // //will update pipelineRun
            pipelineRunStore.update(pipelineRun, { ...pipelineRun });
            Notifications.ok(
              <>pipeline-run {pipelineRun.getName()} cancel successed</>
            );
          } catch (err) {
            Notifications.error(err);
          }
        }}
      >
        <Icon material="cancel" title={"cancel"} interactive={toolbar} />
        <span className="title">
          <Trans>Cancel</Trans>
        </span>
      </MenuItem>
      <MenuItem
        onClick={async () => {
          //Cancel
          const pipelineRun = object;
          try {
            // will delete pipelineRun
            await pipelineRunStore.remove(pipelineRun);

            //create it. will re-run
            await pipelineRunStore.create(
              {
                name: pipelineRun.getName(),
                namespace: "",
                labels: new Map<string, string>().set(
                  "namespace",
                  configStore.getDefaultNamespace() == ""
                    ? "admin"
                    : configStore.getDefaultNamespace()
                ),
              },
              {
                spec: {
                  pipelineRef: pipelineRun.spec.pipelineRef,
                  pipelineSpec: pipelineRun.spec.pipelineSpec,
                  resources: pipelineRun.spec.resources,
                  params: pipelineRun.spec.params,
                  serviceAccountName: pipelineRun.spec.serviceAccountName,
                  serviceAccountNames: pipelineRun.spec.serviceAccountNames,
                  timeout: pipelineRun.spec.timeout,
                  podTemplate: pipelineRun.spec.podTemplate,
                },
              }
            );

            Notifications.ok(
              <>pipeline-run: {pipelineRun.getName()} rerun successed</>
            );
          } catch (err) {
            Notifications.error(err);
          }
        }}
      >
        <Icon material="autorenew" title={"rerun"} interactive={toolbar} />
        <span className="title">
          <Trans>Rerun</Trans>
        </span>
      </MenuItem>
    </KubeObjectMenu>
  );
}

apiManager.registerViews(pipelineRunApi, { Menu: PipelineRunMenu });
