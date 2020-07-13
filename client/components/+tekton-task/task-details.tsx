import React from "react";
import {KubeObjectDetailsProps} from "../kube-object";
import {Task, taskApi} from "../../api/endpoints";
import {observer} from "mobx-react";
import {KubeObjectMeta} from "../kube-object/kube-object-meta";
import {apiManager} from "../../api/api-manager";
import {Trans} from "@lingui/macro";
import {DrawerItem, DrawerTitle} from "../drawer";
import {Col, Row} from "../grid";
import {Input} from "../input";
import {KubeEventDetails} from "../+events/kube-event-details";

interface Props extends KubeObjectDetailsProps<Task> {
}

@observer
export class TaskDetails extends React.Component<Props> {

  renderPipelineParams(data: any) {
    return (
      <>
        <Row>
          <Col span={7}>
            <Trans>Name</Trans>
          </Col>
          <Col span={7} offset={1}>
            <Trans>Type</Trans>
          </Col>
          <Col span={7} offset={1}>
            <Trans>Default</Trans>
          </Col>
        </Row>
        <br/>
        {data.map((item: any, index: string | number) => {
          return (
            <Row>
              <Col span={7}>
                <Input
                  disabled={true}
                  value={data[index].name}
                />
              </Col>
              <Col span={7} offset={1}>
                <Input
                  disabled={true}
                  value={data[index].type}
                />
              </Col>
              <Col span={6} offset={1}>
                <Input
                  disabled={true}
                  value={data[index].default}
                />
              </Col>
            </Row>
          );
        })}
      </>
    )
  }

  renderTaskResource(data: any) {
    return (
      <>
        <Row>
          <Col span={6}>
            <Trans>Name</Trans>
          </Col>
          <Col span={6} offset={2}>
            <Trans>ResourceType</Trans>
          </Col>
          <Col span={6} offset={2}>
            <Trans>TargetPath</Trans>
          </Col>
        </Row>
        <br/>
        {data.map((item: any, index: string | number) => {
          return (
            <>
              <Row>
                <Col span={6}>
                  <Input
                    placeholder={"Name"}
                    value={data[index].name}
                  />
                </Col>

                <Col span={6} offset={2}>
                  <Input
                    placeholder={"Name"}
                    value={data[index].type}
                  />
                </Col>
                <Col span={6} offset={2}>
                  <Input
                    placeholder={"TargetPath"}
                    value={data[index].targetPath}
                  />
                </Col>
              </Row>
              <br/>
            </>
          );
        })}
      </>
    )
  }

  render() {
    const {object: task} = this.props;
    if (!task) {
      return null;
    }

    return (
      <div className="PipelineResourceDetails">
        <KubeObjectMeta object={task}/>
        <KubeEventDetails object={task}/>

        <DrawerTitle title={<Trans>Pipeline Params</Trans>}/>
        {this.renderPipelineParams(task.spec.params || [])}

        <DrawerTitle title={<Trans>Resource Inputs</Trans>}/>
        {this.renderTaskResource(task.spec.inputs || [])}

        <DrawerTitle title={<Trans>Resource Outputs</Trans>}/>
        {this.renderTaskResource(task.spec.outputs || [])}

        <DrawerTitle title={<Trans>Steps</Trans>}/>
        {task.spec.steps?.map((item: any) => {
          return (
            <div>
              {Object.entries(item).map(([name, value]) => (
                <DrawerItem key={name} name={name}>
                  {JSON.stringify(value)}
                </DrawerItem>
              ))}
              <br/>
              <br/>
            </div>
          );
        })}

        <DrawerTitle title={<Trans>Volumes</Trans>}/>
        {task.spec.volumes?.map((item: any) => {
          return (
            <div>
              {Object.entries(item).map(([name, value]) => (
                <DrawerItem key={name} name={name}>
                  {JSON.stringify(value)}
                </DrawerItem>
              ))}
              <br/>
              <br/>
            </div>
          );
        })}

      </div>
    );
  }
}

apiManager.registerViews(taskApi, {
  Details: TaskDetails,
});
