import "./taskrun.scss";

import React from "react";
import {observer} from "mobx-react";
import {RouteComponentProps} from "react-router";
import {Trans} from "@lingui/macro";
import {TaskRun, taskRunApi} from "../../api/endpoints";
import {taskRunStore} from "./taskrun.store";
import {KubeObjectMenu, KubeObjectMenuProps} from "../kube-object";
import {KubeObjectListLayout} from "../kube-object";
import {apiManager} from "../../api/api-manager";

enum sortBy {
  name = "name",
  ownernamespace = "ownernamespace",
  pods = "pods",
  age = "age",
}

interface Props extends RouteComponentProps {
}

@observer
export class TaskRuns extends React.Component<Props> {
  render() {
    return (
      <KubeObjectListLayout
        className="TaskRun" store={taskRunStore}
        sortingCallbacks={{
          [sortBy.name]: (taskRun: TaskRun) => taskRun.getName(),
          [sortBy.ownernamespace]: (taskRun: TaskRun) => taskRun.getOwnerNamespace(),
          [sortBy.age]: (taskRun: TaskRun) => taskRun.getAge(false),
        }}
        searchFilters={[
          (taskRun: TaskRun) => taskRun.getSearchFields(),
        ]}
        renderHeaderTitle={<Trans>TaskRun</Trans>}
        renderTableHeader={[
          {title: <Trans>Name</Trans>, className: "name", sortBy: sortBy.name},
          {title: <Trans>OwnerNamespace</Trans>, className: "ownernamespace", sortBy: sortBy.ownernamespace},
          {title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age},
        ]}
        renderTableContents={(taskRun: TaskRun) => [
          taskRun.getName(),
          taskRun.getOwnerNamespace(),
          taskRun.getAge(),
        ]}
        renderItemMenu={(item: TaskRun) => {
          return <TaskRunMenu object={item}/>
        }}
      />
    )
  }
}

export function TaskRunMenu(props: KubeObjectMenuProps<TaskRun>) {
  return (
    <KubeObjectMenu {...props} />
  )
}

apiManager.registerViews(taskRunApi, {Menu: TaskRunMenu,})
