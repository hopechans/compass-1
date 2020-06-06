
export interface Limitation {
    cpu: string;
    memory: string;
}

export interface Resource {
    limits: Limitation;
    requests: Limitation;
}

export interface Base {
    name: string,
    image: string,
    imagePullPolicy: string,
    resource: Resource
}

export interface Environment {
    type: string
    oneEnvConfig: any
}

export interface Pattern {
    type: string;
    httpPort: string;
    url: string;
    tcpPort: string;
    command: string;
}

export interface LifeCycle {
    status: boolean
    postStart: Pattern
    preStop: Pattern
}

export interface Probe {
    status: boolean;
    timeout: string;
    cycle: string
    retryCount: string;
    delay: string;
    pattern?: Pattern;
}

export class VolumeClaimTemplateMetadata {
    isUseDefaultStorageClass: boolean;
    name: string;
    annotations: Map<string, string>;

    constructor() {
        this.name = '';
        const annotations = new Map<string, string>();
        if (this.isUseDefaultStorageClass) {
            annotations.set('volume.alpha.kubernetes.io/storage-class', 'default')
        }
    }
}

export class VolumeClaimTemplateSpecResourcesRequests {
    storage: number | string;
    accessModes: string[];
    storageClassName: string;
    resources: any;

    constructor() {
        this.storage = '200Mi';
        this.accessModes = ["ReadWriteOnce"];
        this.resources = {requests: {storage: this.storage}};
    }

    setStorageClassName(name: string) {
        this.storageClassName = name
    }

    setStorageSize(size: number | string) {
        if (typeof size === 'string') {
            this.storage = size
        } else {
            this.storage = size.toString() + 'Gi'
        }
    }
}

export class VolumeClaimTemplateSpecResources {
    requests: VolumeClaimTemplateSpecResourcesRequests
}

export class VolumeClaimTemplateSpec {
    accessModes: string[];
    resources: VolumeClaimTemplateSpecResources;
}

export class VolumeClaimTemplate {
    metadata: VolumeClaimTemplateMetadata;
    spec: VolumeClaimTemplateSpec;
}

export class VolumeClaimTemplates {
    status: boolean;
    volumeClaimTemplates: Array<VolumeClaimTemplate>;
}
