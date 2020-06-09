export interface VolumeClaimTemplateMetadata {
    isUseDefaultStorageClass: boolean;
    name: string;
    annotations: Map<string, string>;

    // constructor() {
    //     this.name = '';
    //     const annotations = new Map<string, string>();
    //     if (this.isUseDefaultStorageClass) {
    //         annotations.set('volume.alpha.kubernetes.io/storage-class', 'default')
    //     }
    // }
}

export interface VolumeClaimTemplateSpecResourcesRequests {
    storage: string;

    // constructor() {
    //     this.storage = '200Mi';
    //     this.accessModes = ["ReadWriteOnce"];
    //     this.resources = {requests: {storage: this.storage}};
    // }
    //
    // setStorageClassName(name: string) {
    //     this.storageClassName = name
    // }
    //
    // setStorageSize(size: number | string) {
    //     if (typeof size === 'string') {
    //         this.storage = size
    //     } else {
    //         this.storage = size.toString() + 'Gi'
    //     }
    // }
}

export interface VolumeClaimTemplateSpecResources {
    requests: VolumeClaimTemplateSpecResourcesRequests
}

export interface VolumeClaimTemplateSpec {
    accessModes: string[];
    storageClassName: string;
    resources: VolumeClaimTemplateSpecResources;
}

export interface VolumeClaimTemplate {
    metadata: VolumeClaimTemplateMetadata;
    spec: VolumeClaimTemplateSpec;
}

export interface VolumeClaimTemplates {
    status: boolean;
    volumeClaimTemplates: Array<VolumeClaimTemplate>;
}


export function annotations() {
    let map = new Map()
    map.set("volume.alpha.kubernetes.io/storage-class", "default")
    return map
}

export const volumeClaim: VolumeClaimTemplate = {
    metadata: {
        isUseDefaultStorageClass: true,
        name: "",
        annotations: annotations()
    },
    spec: {
        accessModes: ["ReadWriteOnce"],
        storageClassName: "default-storage-class",
        resources: {
            requests: {
                storage: "200",
            }
        }
    }
}