import {Environment} from "../+deploy-container";

export interface PipelineParams {
  name: string;
  type: string;
  description: string;
  default: string;
}

export interface PipelineResources {
  name: string;
  type: string;
}

export interface TaskStep {
  name: string;
  image: string;
  args: string[];
  commands: string[];
  environment: Environment[]
}

export const pipelineParams: PipelineParams = {
  name: "",
  type: "",
  description: "",
  default: ""
}

export const pipelineResources: PipelineResources = {
  name: "",
  type: "",
}

export const taskStep: TaskStep = {
  name: "",
  image: "",
  args: [],
  commands: [],
  environment: [],
}