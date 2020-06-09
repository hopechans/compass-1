
export interface ServicePorts {
    name: string,
    protocol: string,
    port: string,
    targetPort: string
}

export interface Service {
    type: string,
    ports: ServicePorts[],
}

export const deployPort: ServicePorts = {
    name: "default-web-port",
    protocol: "TCP",
    port: "80",
    targetPort: "80"
}

export const deployService: Service = {
    type: "NodePort",
    ports: []
}