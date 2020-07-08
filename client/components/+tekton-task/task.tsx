import "./task.scss";

import React from "react";
import { observer } from "mobx-react";
import { RouteComponentProps } from "react-router";
import { Trans } from "@lingui/macro";
import { taskApi, Task } from "../../api/endpoints";
import { taskStore } from "./task.store";
import { KubeObjectMenu, KubeObjectMenuProps } from "../kube-object";
import { KubeObjectListLayout } from "../kube-object";
import { apiManager } from "../../api/api-manager";

enum sortBy {
  name = "name",
  ownernamespace = "ownernamespace",
  pods = "pods",
  age = "age",
}

interface Props extends RouteComponentProps { }

@observer
export class Tasks extends React.Component<Props> {
  render() {
    return (
      <>
        <KubeObjectListLayout
          isClusterScoped
          className="Tasks"
          store={taskStore}
          sortingCallbacks={{
            [sortBy.name]: (task: Task) => task.getName(),
            [sortBy.ownernamespace]: (task: Task) => task.getOwnerNamespace(),
            [sortBy.age]: (task: Task) => task.getAge(false),
          }}
          searchFilters={[(task: Task) => task.getSearchFields()]}
          renderHeaderTitle={<Trans>Tasks</Trans>}
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
              title: <Trans>Pods</Trans>,
              className: "pods",
              sortBy: sortBy.pods,
            },
            { className: "warning" },
            { title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age },
          ]}
          renderTableContents={(task: Task) => [
            task.getName(),
            task.getOwnerNamespace(),
            task.getAge(),
          ]}
          renderItemMenu={(item: Task) => {
            return <TaskMenu object={item} />;
          }}
        />
      </>
    );
  }
}

export function TaskMenu(props: KubeObjectMenuProps<Task>) {
  return <KubeObjectMenu {...props} />;
}

apiManager.registerViews(taskApi, { Menu: TaskMenu });
