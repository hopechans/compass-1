import { JsonApi, JsonApiErrorParsed } from "./json-api";
import { KubeJsonApi } from "./kube-json-api";
import { Notifications } from "../components/notifications";
import { clientVars } from "../../server/config";
import { configStore } from "../config.store"
//-- JSON HTTP APIS
// console.log("------configStore", configStore);

// let _token = "";
// if (configStore) {
//     _token = configStore.getConfigToken()
// }
export const apiBase = new JsonApi({
    debug: !clientVars.IS_PRODUCTION,
    apiPrefix: clientVars.API_PREFIX.BASE,

}, {
    headers: {
        Authorization: ''
    }
});

export const apiPermission = new JsonApi({
    debug: !clientVars.IS_PRODUCTION,
    apiPrefix: clientVars.API_PREFIX.TENANT,
})

export const apiTenant = new KubeJsonApi({
    debug: !clientVars.IS_PRODUCTION,
    apiPrefix: clientVars.TENANT_PREFIX.TENANT
});

export const apiKube = new KubeJsonApi({
    debug: !clientVars.IS_PRODUCTION,
    apiPrefix: clientVars.API_PREFIX.KUBE_BASE,
});
export const apiKubeUsers = new KubeJsonApi({
    debug: !clientVars.IS_PRODUCTION,
    apiPrefix: clientVars.API_PREFIX.KUBE_USERS,
});
export const apiKubeHelm = new KubeJsonApi({
    debug: !clientVars.IS_PRODUCTION,
    apiPrefix: clientVars.API_PREFIX.KUBE_HELM,
});
export const apiKubeResourceApplier = new KubeJsonApi({
    debug: !clientVars.IS_PRODUCTION,
    apiPrefix: clientVars.API_PREFIX.KUBE_RESOURCE_APPLIER,
});

// Common handler for HTTP api errors
function onApiError(error: JsonApiErrorParsed, res: Response) {
    switch (res.status) {
        case 403:
            error.isUsedForNotification = true;
            Notifications.error(error);
            break;
    }
}

apiBase.onError.addListener(onApiError);
apiKube.onError.addListener(onApiError);
apiKubeUsers.onError.addListener(onApiError);
apiKubeHelm.onError.addListener(onApiError);
apiKubeResourceApplier.onError.addListener(onApiError);
apiTenant.onError.addListener(onApiError);
apiPermission.onError.addListener(onApiError);