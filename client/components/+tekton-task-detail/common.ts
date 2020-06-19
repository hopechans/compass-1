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
  environment: Environment[];
  workspaces: Workspace[];
  workingDir: string;
  results: Result[];
  scripts: string;
}

export interface Workspace {
  name: string;
  description: string;
  mountPath: string;
}

export interface VolumeMount {
  name: string;
  mountPath: string;
}

export interface Result {
  name: string;
  description: string;
}

export interface Params {
  name: string,
  value: string
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
  workspaces: [],
  workingDir: "",
  results: [],
  scripts: "",
}

export const workspace: Workspace = {
  name: "",
  description: "",
  mountPath: ""
}

export const volumeMount: VolumeMount = {
  name: "",
  mountPath: ""
}

export const result: Result = {
  name: "",
  description: "",
}

export const params: Params = {
  name: "",
  value: ""
}