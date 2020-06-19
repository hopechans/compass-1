export interface Backend {
  serviceName: string
  servicePort: string
}

export interface Path {
  path: string,
  backend: Backend
}

export interface Http {
  paths: Path[]
}

export interface Rule {
  host?: string;
  http: Http;
}

export const backend: Backend = {
  serviceName: "",
  servicePort: "80"
}

export const path: Path = {
  path: '',
  backend: backend
}

export const paths: Path[] = []

export const http: Http = {
  paths: []
}

export const rule: Rule = {
  host: "",
  http: http
}