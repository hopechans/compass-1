import "./form.scss"

import * as React from "react";
import {useState} from "react";
import {observer} from "mobx-react";
import {RouteComponentProps} from "react-router";
import {t, Trans} from "@lingui/macro";
import {KubeObjectMenu, KubeObjectMenuProps} from "../kube-object";
import {KubeObjectListLayout} from "../kube-object";
import {IFormRouteParams} from "./form.route";
import {formStore} from "./form.store";
import {Form, formApi} from "../../api/endpoints";
import {apiManager} from "../../api/api-manager";
import {MenuItem} from "../menu";
import {Icon} from "../icon";
import {_i18n} from "../../i18n";
import {loop} from "../+deploymentengine"

// antd
import {
    Button,
    Form as F,
    Tree,
    Input,
    Select,
    Modal,
    notification,
} from 'antd';
// 加载 CSS

const {Option} = Select;

import 'antd/es/button/style/css';
import 'antd/es/form/style/css';
import 'antd/es/tree/style/css';
import 'antd/es/input/style/css';
import 'antd/es/select/style/css';
import 'antd/es/modal/style/css';
import {AddFormDialog} from "./add-form-dialog";


enum sortBy {
    name = "name",
    namespace = "namespace",
    age = "age",
}

interface Props extends RouteComponentProps<IFormRouteParams> {
}


@observer
export class Forms extends React.Component<Props> {

    render() {
        return (
            <>
                <KubeObjectListLayout
                    className="Forms" store={formStore}
                    sortingCallbacks={{
                        [sortBy.name]: (item: Form) => item.getName(),
                        [sortBy.namespace]: (item: Form) => item.getNs(),
                    }}
                    searchFilters={[
                        (item: Form) => item.getSearchFields()
                    ]}
                    renderHeaderTitle={<Trans>Forms</Trans>}
                    renderTableHeader={[
                        {title: <Trans>Name</Trans>, className: "name", sortBy: sortBy.name},
                        {title: <Trans>Namespace</Trans>, className: "namespace", sortBy: sortBy.namespace},
                        {title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age},
                    ]}
                    renderTableContents={(form: Form) => [
                        form.getName(),
                        form.getNs(),
                        form.getAge(),
                    ]}
                    renderItemMenu={(item: Form) => {
                        return <FormMenu object={item}/>
                    }}
                    addRemoveButtons={{
                        onAdd: () => AddFormDialog.open(),
                        addTooltip: <Trans>Create new Form</Trans>
                    }}
                />
                <AddFormDialog/>
            </>
        );
    }
}


export function FormMenu(props: KubeObjectMenuProps<Form>) {

    const {object, toolbar} = props;

    const treeData = [
        {
            title: 'default',
            key: 'default',
            type: 'array',
            children: [
                {
                    title: 'parent 1-0',
                    key: '0-0-0',
                    type: 'array',
                    disabled: true,
                    children: [
                        {
                            title: 'leaf',
                            key: '0-0-0-0',
                            type: 'string',
                        },
                        {
                            title: 'leaf',
                            key: '0-0-0-1',
                            type: 'string',
                        },
                    ],
                },
                {
                    title: 'parent 1-1',
                    key: '0-0-1',
                    type: 'array',
                    children: [
                        {
                            title: 'sss',
                            key: '0-0-1-0',
                            type: 'string'
                        }
                    ],
                },
            ],
        },
    ];

    const [treeModalVisible, setTreeModalVisible] = useState(false);
    const [modalFormVisible, setModalFormVisible] = useState(false);
    const [modalFieldVisible, setModalFieldVisible] = useState(false);
    const [selectNode, setSelectNode] = useState(undefined);
    const [gData, setGData] = useState(treeData);


    const showTreeModal = () => {
        setTreeModalVisible(true);
    };

    const onTreeModalClose = () => {
        setTreeModalVisible(false);
    };

    const onSelect = (selectedKeys: any, info: any) => {
        setSelectNode(info);
    };

    const onChange = (info: any, title: any) => {
        const data = [...gData];
        loop(data, info.key, (item: any, index: any, arr: any[]) => {
            item.title = title;
            item.key = title;
        })
        setGData(data);
    };

    const onAdd = (info: any, children: any) => {
        const data = [...gData];
        loop(data, info.key, (item: any, index: any, arr: any[]) => {
            item.children = item.children || [];
            item.children.push(children);
        })
        setGData(data);
    };

    const onDelete = (info: any) => {
        const data = [...gData];
        loop(data, info.key, (item: any, index: any, arr: any[]) => {
            arr.splice(index, 1);
        });
        setGData(data);
    };

    const onTreeDelete = () => {
        if (selectNode) {
            onDelete(selectNode.node);
            setSelectNode(undefined);
            setModalFormVisible(false);
        }
    }

    const showModalForm = () => {
        if (selectNode) {
            setModalFormVisible(true);
        } else {
            notification.open({
                message: 'Notification',
                description:
                    'select node',
                onClick: () => {
                    console.log('Notification Clicked!');
                },
            });
        }
    };

    const onModalFormCreate = (values: any) => {
        if (selectNode) {
            if (values.newFieldTitle) {
                onAdd(selectNode.node, {
                    title: values.newFieldTitle,
                    key: values.newFieldTitle,
                    type: "array",
                    children: [] as any,
                })
            }
            if (values.selectNodeTitle) {
                onChange(selectNode.node, values.selectNodeTitle)
            }
            setModalFormVisible(false);
        }
    };

    const onModalFormClose = () => {
        setModalFormVisible(false);
    }

    const onModalFieldCreate = (values: any) => {
        if (selectNode) {
            onAdd(selectNode.node, {
                title: values.field,
                key: values.field,
                type: "field",
                children: [] as any,
            });
            setModalFieldVisible(false);
        }
    };

    const showModalField = () => {
        if (selectNode) {
            setModalFormVisible(false);
            setModalFieldVisible(true);
        } else {
            notification.open({
                message: 'Notification',
                description:
                    'select node',
                onClick: () => {
                    console.log('Notification Clicked!');
                },
            });
        }
    };

    const onModalFieldClose = () => {
        setModalFieldVisible(false);
    }

    const showTree = () => {
        console.log(gData);
    }

    interface Values {
        title: string;
        description: string;
        modifier: string;
    }

    interface CollectionCreateFormProps {
        visible: boolean;
        onCreate: (values: Values) => void;
        onCancel: () => void;
    }

    const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({visible, onCreate, onCancel}) => {
        const [form] = F.useForm();

        return (
            <Modal
                visible={modalFormVisible}
                title="Create a new field"
                okText="Create"
                cancelText="Cancel"
                onCancel={onCancel}
                onOk={() => {
                    form
                        .validateFields()
                        .then((values: any) => {
                            form.resetFields();
                            onCreate(values);
                        })
                        .catch(info => {
                            console.log('Validate Failed:', info);
                        });
                }}
            >
                {
                    selectNode ?
                        <>
                            <F
                                form={form}
                                layout="vertical"
                                name="form_in_modal"
                                initialValues={{modifier: 'public'}}
                            >
                                <F.Item
                                    name="selectNodeTitle"
                                    label="SelectNode Title"
                                >
                                    <Input defaultValue={selectNode.node.title}/>
                                </F.Item>
                            </F>
                            <F
                                form={form}
                                layout="vertical"
                                name="form_in_modal"
                                initialValues={{modifier: 'public'}}
                            >
                                <F.Item
                                    name="newFieldTitle"
                                    label="New Field Title"
                                >
                                    <Input/>
                                </F.Item>
                            </F>
                            <Button type="primary" danger onClick={onTreeDelete}>
                                Delete
                            </Button>&nbsp;
                        </> : ""
                }
                {
                    selectNode && selectNode.node.type == "array" ?
                        <Button type="primary" danger onClick={showModalField}>
                            Add Field
                        </Button> : ""
                }
            </Modal>
        );
    };

    const CollectionCreateField: React.FC<CollectionCreateFormProps> = ({visible, onCreate, onCancel}) => {
        const [form] = F.useForm();

        return (
            <Modal
                visible={modalFieldVisible}
                title="Field"
                onCancel={onCancel}
                onOk={() => {
                    form
                        .validateFields()
                        .then((values: any) => {
                            form.resetFields();
                            onCreate(values);
                        })
                        .catch(info => {
                            console.log('Validate Failed:', info);
                        });
                }}
            >
                <F
                    form={form}
                    layout="vertical"
                    name="form_in_modal"
                    initialValues={{modifier: 'public'}}
                >
                    <F.Item
                        name="field"
                        label="Field"
                        rules={[{required: true, message: 'Please select the field!'}]}
                    >
                        <Select>
                            <Select.Option value="field-boolean">field-boolean</Select.Option>
                            <Select.Option value="field-string">field-string</Select.Option>
                            <Select.Option value="field-number">field-number</Select.Option>
                        </Select>
                    </F.Item>
                </F>
            </Modal>
        );
    };


    return (
        <>
            <KubeObjectMenu {...props}>
                <MenuItem onClick={showTreeModal}>
                    <Icon material="control_camera" title={_i18n._(t`Modal`)} interactive={toolbar}/>
                    <span className="title"><Trans>Modal</Trans></span>
                </MenuItem>
            </KubeObjectMenu>


            <CollectionCreateForm
                visible={modalFormVisible}
                onCreate={onModalFormCreate}
                onCancel={() => {
                    onModalFormClose()
                }}
            />
            <CollectionCreateField
                visible={modalFormVisible}
                onCreate={onModalFieldCreate}
                onCancel={() => {
                    onModalFieldClose()
                }}
            />
            <Modal
                title="Form Config"
                visible={treeModalVisible}
                onOk={showTree}
                onCancel={onTreeModalClose}
                centered={true}
            >
                <Tree
                    className="draggable-tree"
                    multiple={false}
                    treeData={gData}
                    onSelect={onSelect}
                    onDoubleClick={showModalForm}
                />
            </Modal>
        </>
    )
}

apiManager.registerViews(formApi, {
    Menu: FormMenu,
})
