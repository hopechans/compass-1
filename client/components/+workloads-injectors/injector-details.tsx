import "./injector-details.scss";

import React from "react";
import { disposeOnUnmount, observer } from "mobx-react";
import { reaction } from "mobx";
import { Trans } from "@lingui/macro";
import { Badge } from "../badge";
import { DrawerItem } from "../drawer";
import { PodDetailsStatuses } from "../+workloads-pods/pod-details-statuses";
import { KubeEventDetails } from "../+events/kube-event-details";
import { injectorStore } from "./injectors.store";
import { KubeObjectDetailsProps } from "../kube-object";
import { Stone, stoneApi, injectorApi } from "../../api/endpoints";
import { ResourceMetrics, ResourceMetricsText } from "../resource-metrics";
import { PodCharts, podMetricTabs } from "../+workloads-pods/pod-charts";
import { PodDetailsList } from "../+workloads-pods/pod-details-list";
import { apiManager } from "../../api/api-manager";
import { KubeObjectMeta } from "../kube-object/kube-object-meta";

interface Props extends KubeObjectDetailsProps<Stone> {
}

@observer
export class InjectorDetails extends React.Component<Props> {
  @disposeOnUnmount
  clean = reaction(() => this.props.object, () => {
    injectorStore.reset();
  });

  componentDidMount() {
  }

  componentWillUnmount() {
    injectorStore.reset();
  }

  render() {
    const { object: injector } = this.props;
    if (!injector) return null
  
    return (
      <div className="InjectorDetails">
        <p>hello</p>
        {podsStore.isLoaded && (
          <ResourceMetrics
            loader={() => stoneStore.loadMetrics(stone)}
            tabs={podMetricTabs} object={stone} params={{ metrics }}
          >
            <PodCharts />
          </ResourceMetrics>
        )}
        <KubeObjectMeta object={stone} />
        {selectors.length &&
          <DrawerItem name={<Trans>Selector</Trans>} labelsOnly>
            {
              selectors.map(label => <Badge key={label} label={label} />)
            }
          </DrawerItem>
        }
        {nodeSelector.length > 0 &&
          <DrawerItem name={<Trans>Node Selector</Trans>} labelsOnly>
            {
              nodeSelector.map(label => (
                <Badge key={label} label={label} />
              ))
            }
          </DrawerItem>
        }
        {images.length > 0 &&
          <DrawerItem name={<Trans>Images</Trans>}>
            {
              images.map(image => <p key={image}>{image}</p>)
            }
          </DrawerItem>
        }
        <DrawerItem name={<Trans>Pod Status</Trans>} className="pod-status">
          <PodDetailsStatuses pods={childPods} />
        </DrawerItem>
        <ResourceMetricsText metrics={metrics} />
        <PodDetailsList pods={childPods} owner={stone} />
        <KubeEventDetails object={stone} />
      </div>
    )
  }
}

apiManager.registerViews(injectorApi, {
  Details: InjectorDetails
})