import React, { Fragment } from "react";
import { observer } from "mobx-react";
import { RouteComponentProps } from "react-router";
import { Trans } from "@lingui/macro";
import {
  tektonStoreApi,
  TektonStore,
  Task,
  Pipeline,
  taskApi,
  pipelineApi,
} from "../../api/endpoints";
import { KubeObjectMenu, KubeObjectMenuProps } from "../kube-object";
import { KubeObjectListLayout } from "../kube-object";
import { apiManager } from "../../api/api-manager";
import { tektonStore } from "./taskstore.store";
import { MenuItem } from "../menu";
import { Icon } from "../icon";
import { configStore } from "../../config.store";
import { taskStore } from "../+tekton-task/task.store";
import { pipelineStore } from "../+tekton-pipeline/pipeline.store";
import { PipelineEntity, ResourceType } from "./add-tekton-store-dailog";
import { Notifications } from "../notifications";

enum sortBy {
  name = "name",
  namespace = "namespace",
  age = "age",
}

interface Props extends RouteComponentProps {}

@observer
export class TektonStoreLayout extends React.Component<Props> {
  render() {
    return (
      <KubeObjectListLayout
        isClusterScoped
        className="TektonStores"
        store={tektonStore}
        dependentStores={[taskStore, pipelineStore]} // other
        sortingCallbacks={{
          [sortBy.name]: (tektonStore: TektonStore) => tektonStore.getName(),
          [sortBy.namespace]: (tektonStore: TektonStore) => tektonStore.getNs(),
          [sortBy.age]: (tektonStore: TektonStore) => tektonStore.getAge(false),
        }}
        searchFilters={[
          (tektonStore: TektonStore) => tektonStore.getSearchFields(),
        ]}
        renderHeaderTitle={<Trans>TektonStore</Trans>}
        renderTableHeader={[
          {
            title: <Trans>Name</Trans>,
            className: "name",
            sortBy: sortBy.name,
          },
          {
            title: <Trans>Namespace</Trans>,
            className: "namespace",
            sortBy: sortBy.namespace,
          },
          {
            title: <Trans>Type</Trans>,
            className: "type",
          },
          {
            title: <Trans>Author</Trans>,
            className: "author",
          },
          {
            title: <Trans>Forks</Trans>,
            className: "forks",
          },
          { title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age },
        ]}
        renderTableContents={(tektonStore: TektonStore) => [
          tektonStore.getName(),
          tektonStore.getNs(),
          tektonStore.getType(),
          tektonStore.getAuthor(),
          tektonStore.getForks(),
          tektonStore.getAge(),
        ]}
        renderItemMenu={(item: TektonStore) => {
          return <TektonStoreMenu object={item} />;
        }}
      />
    );
  }
}

const createTaskResource = (taskData: Task) => {
  const taskName = `${taskData.metadata.name}-fork`;
  try {
    taskApi.create(
      {
        name: taskName,
        namespace: configStore.getOpsNamespace(),
        labels: new Map<string, string>().set(
          "namespace",
          configStore.getDefaultNamespace()
        ),
      },
      {
        spec: taskData.spec,
      }
    );
  } catch (e) {
    Notifications.error(<>Fork task {taskName} failed</>);
  }
};

const createPipelineResource = (pipelineData: Pipeline) => {
  const pipelineName = `${pipelineData.metadata.name}-fork`;
  pipelineApi.create(
    {
      name: pipelineName,
      namespace: configStore.getOpsNamespace(),
      labels: new Map<string, string>().set(
        "namespace",
        configStore.getDefaultNamespace()
      ),
    },
    {
      spec: pipelineData.spec,
    }
  );
};

export function TektonStoreMenu(props: KubeObjectMenuProps<TektonStore>) {
  const { object, toolbar } = props;
  return (
    <KubeObjectMenu {...props}>
      <MenuItem
        onClick={() => {
          //should fork operator,and crete fork's resource
          try {
            const tektonStoreEntity: TektonStore = object;
            const data = tektonStoreEntity.getData();
            const resourceType = tektonStoreEntity.getType();
            if (data === "") {
              return;
            }
            if (resourceType === ResourceType.Pipeline) {
              const pipelineEntity: PipelineEntity = JSON.parse(data);
              const taskData: Task[] = JSON.parse(pipelineEntity.taskData);
              const pipelineData: Pipeline = JSON.parse(
                pipelineEntity.pipelineData
              );
              taskData.map((t) => {
                createTaskResource(t);
              });

              createPipelineResource(pipelineData);
            }

            if (resourceType === ResourceType.Task) {
              const taskData: Task = JSON.parse(data);
              createTaskResource(taskData);
            }

            //and then inrc forks
            tektonStoreEntity.spec.forks = tektonStoreEntity.spec.forks + 1;
            tektonStore.update(tektonStoreEntity, { ...tektonStoreEntity });
            Notifications.ok(<>Fork succeeded</>);
          } catch (err) {
            Notifications.error(<>Fork error:{err}</>);
          }
        }}
      >
        <Icon material="cloud_download" title={"Fork"} interactive={toolbar} />
        <span className="title">
          <Trans>Fork</Trans>
        </span>
      </MenuItem>
    </KubeObjectMenu>
  );
}

apiManager.registerViews(tektonStoreApi, { Menu: TektonStoreMenu });
