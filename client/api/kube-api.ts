// Base class for building all kubernetes apis

import merge from "lodash/merge"
import { stringify } from "querystring";
import { IKubeObjectConstructor, KubeObject } from "./kube-object";
import { IKubeObjectRef, KubeJsonApi, KubeJsonApiData, KubeJsonApiDataList } from "./kube-json-api";
import { apiKube } from "./index";
import { kubeWatchApi } from "./kube-watch-api";
import { apiManager } from "./api-manager";

export interface IKubeApiOptions<T extends KubeObject> {
  kind: string; // resource type within api-group, e.g. "Namespace"
  apiBase: string; // base api-path for listing all resources, e.g. "/api/v1/pods"
  isNamespaced: boolean;
  objectConstructor?: IKubeObjectConstructor<T>;
  request?: KubeJsonApi;
}

export interface IKubeApiQueryParams {
  watch?: boolean | number;
  resourceVersion?: string;
  timeoutSeconds?: number;
  limit?: number; // doesn't work with ?watch
  continue?: string; // might be used with ?limit from second request
}

export interface IKubeApiLinkRef {
  apiPrefix?: string;
  apiVersion: string;
  resource: string;
  name: string;
  namespace?: string;
}

export class KubeApi<T extends KubeObject = any> {
  static matcher = /(\/apis?.*?)\/(?:(.*?)\/)?(v.*?)(?:\/namespaces\/(.+?))?\/([^\/]+)(?:\/([^\/?]+))?.*$/

  static parseApi(apiPath = "") {
    apiPath = new URL(apiPath, location.origin).pathname;
    const [, apiPrefix, apiGroup = "", apiVersion, namespace, resource, name] = apiPath.match(KubeApi.matcher) || [];
    const apiVersionWithGroup = [apiGroup, apiVersion].filter(v => v).join("/");
    const apiBase = [apiPrefix, apiGroup, apiVersion, resource].filter(v => v).join("/");
    return {
      apiBase,
      apiPrefix, apiGroup,
      apiVersion, apiVersionWithGroup,
      namespace, resource, name,
    }
  }

  static createLink(ref: IKubeApiLinkRef): string {
    const { apiPrefix = "/apis", resource, apiVersion, name } = ref;
    let { namespace } = ref;
    if (namespace) {
      namespace = `namespaces/${namespace}`
    }
    return [apiPrefix, apiVersion, namespace, resource, name]
      .filter(v => !!v)
      .join("/")
  }

  static watchAll(...apis: KubeApi[]) {
    const disposers = apis.map(api => api.watch());
    return () => disposers.forEach(unwatch => unwatch());
  }

  readonly kind: string
  readonly apiBase: string
  readonly apiPrefix: string
  readonly apiGroup: string
  readonly apiVersion: string
  readonly apiVersionWithGroup: string
  readonly apiResource: string
  readonly isNamespaced: boolean

  public objectConstructor: IKubeObjectConstructor<T>;
  protected request: KubeJsonApi;
  protected resourceVersions = new Map<string, string>();

  constructor(protected options: IKubeApiOptions<T>) {
    const {
      kind,
      isNamespaced = false,
      objectConstructor = KubeObject as IKubeObjectConstructor,
      request = apiKube
    } = options || {};
    const { apiBase, apiPrefix, apiGroup, apiVersion, apiVersionWithGroup, resource } = KubeApi.parseApi(options.apiBase);

    this.kind = kind;
    this.isNamespaced = isNamespaced;
    this.apiBase = apiBase;
    this.apiPrefix = apiPrefix;
    this.apiGroup = apiGroup;
    this.apiVersion = apiVersion;
    this.apiVersionWithGroup = apiVersionWithGroup;
    this.apiResource = resource;
    this.request = request;
    this.objectConstructor = objectConstructor;

    this.parseResponse = this.parseResponse.bind(this);
    apiManager.registerApi(apiBase, this);
  }

  setResourceVersion(namespace = "", newVersion: string) {
    this.resourceVersions.set(namespace, newVersion);
  }

  getResourceVersion(namespace = "") {
    return this.resourceVersions.get(namespace);
  }

  async refreshResourceVersion(params?: { namespace: string }) {
    return this.list(params, { limit: 1 });
  }

  getUrl({ name = "", namespace = "" } = {}, query?: Partial<IKubeApiQueryParams>) {
    const { apiPrefix, apiVersionWithGroup, apiResource } = this;
    const resourcePath = KubeApi.createLink({
      apiPrefix: apiPrefix,
      apiVersion: apiVersionWithGroup,
      resource: apiResource,
      namespace: this.isNamespaced ? namespace : undefined,
      name: name,
    });
    return resourcePath + (query ? `?` + stringify(query) : "");
  }

  public parseResponse(data: KubeJsonApiData | KubeJsonApiData[] | KubeJsonApiDataList, namespace?: string): any {
    const KubeObjectConstructor = this.objectConstructor;
    if (KubeObject.isJsonApiData(data)) {
      return new KubeObjectConstructor(data);
    }
    // process items list response
    else if (KubeObject.isJsonApiDataList(data)) {

      console.log('--------------90991')
      const { apiVersion, items, metadata } = data;
      this.setResourceVersion(namespace, metadata.resourceVersion);
      this.setResourceVersion("", metadata.resourceVersion);
      return items.map(item => new KubeObjectConstructor({
        kind: this.kind,
        apiVersion: apiVersion,
        ...item,
      }))
    }
    // custom apis might return array for list response, e.g. users, groups, etc.
    else if (Array.isArray(data)) {
      console.log('--------------90992',data)
      return data.map(data => new KubeObjectConstructor(data));

    }
    return data;
  }

  async list({ namespace = "" } = {}, query?: IKubeApiQueryParams): Promise<T[]> {
    return this.request
      .get(this.getUrl({ namespace }), { query })
      .then(data => this.parseResponse(data, namespace));
  }


   testGetList({ namespace = "" } = {}, query?: IKubeApiQueryParams):Promise<T[]> {
    const obj = [{
      "kind": "Deployment",
      "apiVersion": "apps/v1",
      "metadata": {
        "name": "coredns",
        "namespace": "kube-system",
        "selfLink": "/apis/apps/v1/namespaces/kube-system/deployments/coredns",
        "uid": "df1c4143-5115-449b-aa58-563d8c558d70",
        "resourceVersion": "2198681",
        "generation": 1,
        "creationTimestamp": "2020-03-28T07:08:47Z",
        "labels": {
          "k8s-app": "kube-dns"
        },
        "annotations": {
          "deployment.kubernetes.io/revision": "1"
        },
        "managedFields": [
          {
            "manager": "kubeadm",
            "operation": "Update",
            "apiVersion": "apps/v1",
            "time": "2020-03-28T07:08:47Z",
            "fieldsType": "FieldsV1",
            "fieldsV1": {
              "f:metadata": {
                "f:labels": {
                  ".": {
                  },
                  "f:k8s-app": {
                  }
                }
              },
              "f:spec": {
                "f:progressDeadlineSeconds": {
                },
                "f:replicas": {
                },
                "f:revisionHistoryLimit": {
                },
                "f:selector": {
                  "f:matchLabels": {
                    ".": {
                    },
                    "f:k8s-app": {
                    }
                  }
                },
                "f:strategy": {
                  "f:rollingUpdate": {
                    ".": {
                    },
                    "f:maxSurge": {
                    },
                    "f:maxUnavailable": {
                    }
                  },
                  "f:type": {
                  }
                },
                "f:template": {
                  "f:metadata": {
                    "f:labels": {
                      ".": {
                      },
                      "f:k8s-app": {
                      }
                    }
                  },
                  "f:spec": {
                    "f:containers": {
                      "k:{\"name\":\"coredns\"}": {
                        ".": {
                        },
                        "f:args": {
                        },
                        "f:image": {
                        },
                        "f:imagePullPolicy": {
                        },
                        "f:livenessProbe": {
                          ".": {
                          },
                          "f:failureThreshold": {
                          },
                          "f:httpGet": {
                            ".": {
                            },
                            "f:path": {
                            },
                            "f:port": {
                            },
                            "f:scheme": {
                            }
                          },
                          "f:initialDelaySeconds": {
                          },
                          "f:periodSeconds": {
                          },
                          "f:successThreshold": {
                          },
                          "f:timeoutSeconds": {
                          }
                        },
                        "f:name": {
                        },
                        "f:ports": {
                          ".": {
                          },
                          "k:{\"containerPort\":53,\"protocol\":\"TCP\"}": {
                            ".": {
                            },
                            "f:containerPort": {
                            },
                            "f:name": {
                            },
                            "f:protocol": {
                            }
                          },
                          "k:{\"containerPort\":53,\"protocol\":\"UDP\"}": {
                            ".": {
                            },
                            "f:containerPort": {
                            },
                            "f:name": {
                            },
                            "f:protocol": {
                            }
                          },
                          "k:{\"containerPort\":9153,\"protocol\":\"TCP\"}": {
                            ".": {
                            },
                            "f:containerPort": {
                            },
                            "f:name": {
                            },
                            "f:protocol": {
                            }
                          }
                        },
                        "f:readinessProbe": {
                          ".": {
                          },
                          "f:failureThreshold": {
                          },
                          "f:httpGet": {
                            ".": {
                            },
                            "f:path": {
                            },
                            "f:port": {
                            },
                            "f:scheme": {
                            }
                          },
                          "f:periodSeconds": {
                          },
                          "f:successThreshold": {
                          },
                          "f:timeoutSeconds": {
                          }
                        },
                        "f:resources": {
                          ".": {
                          },
                          "f:limits": {
                            ".": {
                            },
                            "f:memory": {
                            }
                          },
                          "f:requests": {
                            ".": {
                            },
                            "f:cpu": {
                            },
                            "f:memory": {
                            }
                          }
                        },
                        "f:securityContext": {
                          ".": {
                          },
                          "f:allowPrivilegeEscalation": {
                          },
                          "f:capabilities": {
                            ".": {
                            },
                            "f:add": {
                            },
                            "f:drop": {
                            }
                          },
                          "f:readOnlyRootFilesystem": {
                          }
                        },
                        "f:terminationMessagePath": {
                        },
                        "f:terminationMessagePolicy": {
                        },
                        "f:volumeMounts": {
                          ".": {
                          },
                          "k:{\"mountPath\":\"/etc/coredns\"}": {
                            ".": {
                            },
                            "f:mountPath": {
                            },
                            "f:name": {
                            },
                            "f:readOnly": {
                            }
                          }
                        }
                      }
                    },
                    "f:dnsPolicy": {
                    },
                    "f:nodeSelector": {
                      ".": {
                      },
                      "f:kubernetes.io/os": {
                      }
                    },
                    "f:priorityClassName": {
                    },
                    "f:restartPolicy": {
                    },
                    "f:schedulerName": {
                    },
                    "f:securityContext": {
                    },
                    "f:serviceAccount": {
                    },
                    "f:serviceAccountName": {
                    },
                    "f:terminationGracePeriodSeconds": {
                    },
                    "f:tolerations": {
                    },
                    "f:volumes": {
                      ".": {
                      },
                      "k:{\"name\":\"config-volume\"}": {
                        ".": {
                        },
                        "f:configMap": {
                          ".": {
                          },
                          "f:defaultMode": {
                          },
                          "f:items": {
                          },
                          "f:name": {
                          }
                        },
                        "f:name": {
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          {
            "manager": "kube-controller-manager",
            "operation": "Update",
            "apiVersion": "apps/v1",
            "time": "2020-04-05T08:52:41Z",
            "fieldsType": "FieldsV1",
            "fieldsV1": {
              "f:metadata": {
                "f:annotations": {
                  ".": {
                  },
                  "f:deployment.kubernetes.io/revision": {
                  }
                }
              },
              "f:status": {
                "f:availableReplicas": {
                },
                "f:conditions": {
                  ".": {
                  },
                  "k:{\"type\":\"Available\"}": {
                    ".": {
                    },
                    "f:lastTransitionTime": {
                    },
                    "f:lastUpdateTime": {
                    },
                    "f:message": {
                    },
                    "f:reason": {
                    },
                    "f:status": {
                    },
                    "f:type": {
                    }
                  },
                  "k:{\"type\":\"Progressing\"}": {
                    ".": {
                    },
                    "f:lastTransitionTime": {
                    },
                    "f:lastUpdateTime": {
                    },
                    "f:message": {
                    },
                    "f:reason": {
                    },
                    "f:status": {
                    },
                    "f:type": {
                    }
                  }
                },
                "f:observedGeneration": {
                },
                "f:readyReplicas": {
                },
                "f:replicas": {
                },
                "f:updatedReplicas": {
                }
              }
            }
          }
        ]
      },
      "spec": {
        "replicas": 2,
        "selector": {
          "matchLabels": {
            "k8s-app": "kube-dns"
          }
        },
        "template": {
          "metadata": {
            "creationTimestamp": '2020-03-28T07:08:47Z',
            "labels": {
              "k8s-app": "kube-dns"
            }
          },
          "spec": {
            "volumes": [
              {
                "name": "config-volume",
                "configMap": {
                  "name": "coredns",
                  "items": [
                    {
                      "key": "Corefile",
                      "path": "Corefile"
                    }
                  ],
                  "defaultMode": 420
                }
              }
            ],
            "containers": [
              {
                "name": "coredns",
                "image": "k8s.gcr.io/coredns:1.6.7",
                "args": [
                  "-conf",
                  "/etc/coredns/Corefile"
                ],
                "ports": [
                  {
                    "name": "dns",
                    "containerPort": 53,
                    "protocol": "UDP"
                  },
                  {
                    "name": "dns-tcp",
                    "containerPort": 53,
                    "protocol": "TCP"
                  },
                  {
                    "name": "metrics",
                    "containerPort": 9153,
                    "protocol": "TCP"
                  }
                ],
                "resources": {
                  "limits": {
                    "memory": "170Mi"
                  },
                  "requests": {
                    "cpu": "100m",
                    "memory": "70Mi"
                  }
                },
                "volumeMounts": [
                  {
                    "name": "config-volume",
                    "readOnly": true,
                    "mountPath": "/etc/coredns"
                  }
                ],
                "livenessProbe": {
                  "httpGet": {
                    "path": "/health",
                    "port": 8080,
                    "scheme": "HTTP"
                  },
                  "initialDelaySeconds": 60,
                  "timeoutSeconds": 5,
                  "periodSeconds": 10,
                  "successThreshold": 1,
                  "failureThreshold": 5
                },
                "readinessProbe": {
                  "httpGet": {
                    "path": "/ready",
                    "port": 8181,
                    "scheme": "HTTP"
                  },
                  "timeoutSeconds": 1,
                  "periodSeconds": 10,
                  "successThreshold": 1,
                  "failureThreshold": 3
                },
                "terminationMessagePath": "/dev/termination-log",
                "terminationMessagePolicy": "File",
                "imagePullPolicy": "IfNotPresent",
                "securityContext": {
                  "capabilities": {
                    "add": [
                      "NET_BIND_SERVICE"
                    ],
                    "drop": [
                      "all"
                    ]
                  },
                  "readOnlyRootFilesystem": true,
                  "allowPrivilegeEscalation": false
                }
              }
            ],
            "restartPolicy": "Always",
            "terminationGracePeriodSeconds": 30,
            "dnsPolicy": "Default",
            "nodeSelector": {
              "kubernetes.io/os": "linux"
            },
            "serviceAccountName": "coredns",
            "serviceAccount": "coredns",
            "securityContext": {
            },
            "schedulerName": "default-scheduler",
            "tolerations": [
              {
                "key": "CriticalAddonsOnly",
                "operator": "Exists"
              },
              {
                "key": "node-role.kubernetes.io/master",
                "effect": "NoSchedule"
              }
            ],
            "priorityClassName": "system-cluster-critical"
          }
        },
        "strategy": {
          "type": "RollingUpdate",
          "rollingUpdate": {
            "maxUnavailable": 1,
            "maxSurge": "25%"
          }
        },
        "revisionHistoryLimit": 10,
        "progressDeadlineSeconds": 600
      },
      "status": {
        "observedGeneration": 1,
        "replicas": 2,
        "updatedReplicas": 2,
        "readyReplicas": 2,
        "availableReplicas": 2,
        "conditions": [
          {
            "type": "Progressing",
            "status": "True",
            "lastUpdateTime": "2020-03-28T07:21:10Z",
            "lastTransitionTime": "2020-03-28T07:21:07Z",
            "reason": "NewReplicaSetAvailable",
            "message": "ReplicaSet \"coredns-66bff467f8\" has successfully progressed."
          },
          {
            "type": "Available",
            "status": "True",
            "lastUpdateTime": "2020-04-05T08:52:39Z",
            "lastTransitionTime": "2020-04-05T08:52:39Z",
            "reason": "MinimumReplicasAvailable",
            "message": "Deployment has minimum availability."
          }
        ]
      }
    }]
    //
    // return new Promise(resolve=>{
    //     setTimeout(()=>{
    //       resolve()
    //     })
    //   }).then(res=> this.parseResponse(obj, namespace))
  
    // }
    return this.parseResponse(obj, namespace)
  }
  async get({ name = "", namespace = "default" } = {}, query?: IKubeApiQueryParams): Promise<T> {
    return this.request
      .get(this.getUrl({ namespace, name }), { query })
      .then(this.parseResponse);
  }

  async create({ name = "", namespace = "default" } = {}, data?: Partial<T>): Promise<T> {
    const apiUrl = this.getUrl({ namespace });
    return this.request.post(apiUrl, {
      data: merge({
        kind: this.kind,
        apiVersion: this.apiVersionWithGroup,
        metadata: {
          name,
          namespace
        }
      }, data)
    }).then(this.parseResponse);
  }

  async update({ name = "", namespace = "default" } = {}, data?: Partial<T>): Promise<T> {
    const apiUrl = this.getUrl({ namespace, name });
    return this.request
      .put(apiUrl, { data })
      .then(this.parseResponse)
  }

  async delete({ name = "", namespace = "default" }) {
    const apiUrl = this.getUrl({ namespace, name });
    return this.request.del(apiUrl)
  }

  getWatchUrl(namespace = "", query: IKubeApiQueryParams = {}) {
    return this.getUrl({ namespace }, {
      watch: 1,
      resourceVersion: this.getResourceVersion(namespace),
      ...query,
    })
  }

  watch(): () => void {
    return kubeWatchApi.subscribe(this);
  }
}

export function lookupApiLink(ref: IKubeObjectRef, parentObject: KubeObject): string {
  const {
    kind, apiVersion, name,
    namespace = parentObject.getNs()
  } = ref;

  // search in registered apis by 'kind' & 'apiVersion'
  const api = apiManager.getApi(api => api.kind === kind && api.apiVersionWithGroup == apiVersion)
  if (api) {
    return api.getUrl({ namespace, name })
  }

  // lookup api by generated resource link
  const apiPrefixes = ["/apis", "/api"];
  const resource = kind.toLowerCase() + kind.endsWith("s") ? "es" : "s";
  for (const apiPrefix of apiPrefixes) {
    const apiLink = KubeApi.createLink({ apiPrefix, apiVersion, name, namespace, resource });
    if (apiManager.getApi(apiLink)) {
      return apiLink;
    }
  }

  // resolve by kind only (hpa's might use refs to older versions of resources for example)
  const apiByKind = apiManager.getApi(api => api.kind === kind);
  if (apiByKind) {
    return apiByKind.getUrl({ name, namespace })
  }

  // otherwise generate link with default prefix
  // resource still might exists in k8s, but api is not registered in the app
  return KubeApi.createLink({ apiVersion, name, namespace, resource })
}
