import { autobind } from "../../utils";
import { KubeObjectStore } from "../../kube-object.store";
import { Page, pageApi } from "../../api/endpoints/page.api";
import { apiManager } from "../../api/api-manager";

@autobind()
export class PageStore extends KubeObjectStore<Page> {
    api = pageApi
}

export const pageStore = new PageStore();
apiManager.registerStore(pageApi, pageStore);
