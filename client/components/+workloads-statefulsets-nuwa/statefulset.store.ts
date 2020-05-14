import { observable } from "mobx";
import { autobind } from "../../utils";
import { KubeObjectStore } from "../../kube-object.store";
import { IPodMetrics, podsApi, PodStatus, StatefulSetNuwa, statefulSetNuwaApi } from "../../api/endpoints";
import { podsStore } from "../+workloads-pods/pods.store";
import { apiManager } from "../../api/api-manager";

@autobind()
export class StatefulSetNuwaStore extends KubeObjectStore<StatefulSetNuwa> {
  api = statefulSetNuwaApi
  @observable metrics: IPodMetrics = null;

  loadMetrics(statefulSet: StatefulSetNuwa) {
    const pods = this.getChildPods(statefulSet);
    return podsApi.getMetrics(pods, statefulSet.getNs(), "").then(metrics =>
      this.metrics = metrics
    );
  }

  getChildPods(statefulSet: StatefulSetNuwa) {
    return podsStore.getPodsByOwner(statefulSet)
  }

  getStatuses(statefulSets: StatefulSetNuwa[]) {
    const status = { failed: 0, pending: 0, running: 0 }
    statefulSets.forEach(statefulSet => {
      const pods = this.getChildPods(statefulSet)
      if (pods.some(pod => pod.getStatus() === PodStatus.FAILED)) {
        status.failed++
      }
      else if (pods.some(pod => pod.getStatus() === PodStatus.PENDING)) {
        status.pending++
      }
      else {
        status.running++
      }
    })
    return status
  }

  reset() {
    this.metrics = null;
  }
}

export const statefulSetNuwaStore = new StatefulSetNuwaStore();
apiManager.registerStore(statefulSetNuwaApi, statefulSetNuwaStore);
