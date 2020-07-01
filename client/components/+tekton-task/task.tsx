import "./task.scss";

import React from "react";
import {observer} from "mobx-react";
import {RouteComponentProps} from "react-router";
import {Trans} from "@lingui/macro";
import {taskApi, Task} from "../../api/endpoints";
import {taskStore} from "./task.store";
import {KubeObjectMenu, KubeObjectMenuProps} from "../kube-object";
import {KubeObjectListLayout} from "../kube-object";
import {apiManager} from "../../api/api-manager";
import {PodContainerStatuses} from "../+workloads-pods";
import {podsStore} from "../+workloads-pods/pods.store";

enum sortBy {
  name = "name",
  namespace = "namespace",
  pods = "pods",
  age = "age",
}

interface Props extends RouteComponentProps {
}

@observer
export class Tasks extends React.Component<Props> {
  render() {
    return (
      <>
        <KubeObjectListLayout
          className="Tasks" store={taskStore}
          dependentStores={[podsStore,]}
          sortingCallbacks={{
            [sortBy.name]: (task: Task) => task.getName(),
            [sortBy.namespace]: (task: Task) => task.getNs(),
            [sortBy.age]: (task: Task) => task.getAge(false),
          }}
          searchFilters={[
            (task: Task) => task.getSearchFields(),
          ]}
          renderHeaderTitle={<Trans>Tasks</Trans>}
          renderTableHeader={[
            {title: <Trans>Name</Trans>, className: "name", sortBy: sortBy.name},
            {title: <Trans>Namespace</Trans>, className: "namespace", sortBy: sortBy.namespace},
            {title: <Trans>Pods</Trans>, className: "pods", sortBy: sortBy.pods},
            {className: "warning"},
            {title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age},
          ]}
          renderTableContents={(task: Task) => [
            task.getName(),
            task.getNs(),
            task.getAge(),
          ]}
          renderItemMenu={(item: Task) => {
            return <TaskMenu object={item}/>
          }}
        />
      </>
    )
  }
}

export function TaskMenu(props: KubeObjectMenuProps<Task>) {
  return (
    <KubeObjectMenu {...props} />
  )
}

apiManager.registerViews(taskApi, {Menu: TaskMenu,})
