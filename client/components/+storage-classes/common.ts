export interface CephParams {
    monitors: string,
    adminId: string,
    adminSecretName: string,
    adminSecretNamespace: string,
    pool: string,
    userId: string,
    userSecretName: string,
    imageFormat: string,
    imageFeatures: string
}

export const cephParams: CephParams = {
    monitors: "",
    adminId: "",
    adminSecretName: "",
    adminSecretNamespace: "",
    pool: "",
    userId: "",
    userSecretName: "",
    imageFormat: "",
    imageFeatures: ""
}