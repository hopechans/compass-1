import * as React from "react";
import {StatusBrick} from "../status-brick";
import {StepState} from "../../api/endpoints";
import {TaskRunDetailsStepState} from "./taskrun-details-stepstate";

interface Props {
  stepState: StepState
}

export class TaskRunDetailsSteps extends React.Component<Props> {

  render() {

    const {stepState} = this.props;

    return (
      <>
        <div className={"TaskRunDetailsSteps"}>
          <div className="pod-container-title">
            <StatusBrick />  {stepState.container}
          </div>
          <div className={"TaskRunDetailsStepState"}>
            <TaskRunDetailsStepState stepState={stepState}/>
          </div>
        </div>
        <br/>
      </>
    )
  }
}