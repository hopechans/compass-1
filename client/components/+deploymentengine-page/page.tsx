import "./page.scss";

import * as React from "react";
import {useState} from "react";
import {observer} from "mobx-react";
import {RouteComponentProps} from "react-router";
import {t, Trans} from "@lingui/macro";
import {KubeObjectMenu, KubeObjectMenuProps} from "../kube-object";
import {KubeObjectListLayout} from "../kube-object";
import {IPageRouteParams} from "./page.route";
import {pageStore} from "./page.store";
import {Page, pageApi} from "../../api/endpoints";
import {apiManager} from "../../api/api-manager";
import {MenuItem} from "../menu";
import {Icon} from "../icon";
import {_i18n} from "../../i18n";
import {loop} from "../+deploymentengine";


// antd
import {
    Drawer,
    Form as F,
    Tree,
    Input,
    Select,
    Modal,
    notification,
} from 'antd';
// 加载 CSS

const {Option} = Select;

import 'antd/es/drawer/style/css';
import 'antd/es/form/style/css';
import 'antd/es/tree/style/css';
import 'antd/es/input/style/css';
import 'antd/es/select/style/css';
import 'antd/es/modal/style/css';
import {AddPageDialog} from "./add-page-dialog";

enum sortBy {
    name = "name",
    namespace = "namespace",
    age = "age",
}

interface Props extends RouteComponentProps<IPageRouteParams> {
}

@observer
export class Pages extends React.Component<Props> {
    spec: { scaleTargetRef: any; };

    render() {
        return (
            <>
                <KubeObjectListLayout
                    className="Pages" store={pageStore}
                    sortingCallbacks={{
                        [sortBy.name]: (item: Page) => item.getName(),
                        [sortBy.namespace]: (item: Page) => item.getNs(),
                    }}
                    searchFilters={[
                        (item: Page) => item.getSearchFields()
                    ]}
                    renderHeaderTitle={<Trans>Pages</Trans>}
                    renderTableHeader={[
                        {title: <Trans>Name</Trans>, className: "name", sortBy: sortBy.name},
                        {title: <Trans>Namespace</Trans>, className: "namespace", sortBy: sortBy.namespace},
                        {title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age},
                    ]}
                    renderTableContents={(page: Page) => [
                        page.getName(),
                        page.getNs(),
                        page.getAge(),
                    ]}
                    renderItemMenu={(item: Page) => {
                        return <PageMenu object={item}/>
                    }}
                    addRemoveButtons={{
                        onAdd: () => AddPageDialog.open(),
                        addTooltip: <Trans>Create new Page</Trans>
                    }}
                />
                <AddPageDialog />
            </>
        );
    }
}

export function PageMenu(props: KubeObjectMenuProps<Page>) {

    const {object, toolbar} = props;

    const treeData = [
        {
            title: 'default',
            key: 'default',
            type: 'array',
            formData: {},
            children: [
                {
                    title: 'parent 1-0',
                    key: '0-0-0',
                    type: 'array',
                    formData: {},
                    disabled: true,
                    children: [
                        {
                            title: 'leaf',
                            key: '0-0-0-0',
                            type: 'string',
                            formData: {},
                        },
                        {
                            title: 'leaf',
                            key: '0-0-0-1',
                            type: 'string',
                            formData: {},
                        },
                    ],
                },
                {
                    title: 'parent 1-1',
                    key: '0-0-1',
                    type: 'array',
                    formData: {},
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

    const selectNode: any = {}
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [gData, setGData] = useState(treeData);


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


    const onAdd = (info: any, children: any) => {
        const data = [...this.state.gData];
        loop(data, info.key, (item: any, index: any, arr: any[]) => {
            item.children = item.children || [];
            item.children.push(children);
        })
        setGData(data);
    };

    const showModal = () => {
        if (selectNode) {
            setModalVisible(true);
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

    const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({visible, onCreate, onCancel}) => {
        const [form] = F.useForm();

        function handleChange(value: any) {
            console.log(`selected ${value}`);
        }

        return (
            <Modal
                visible={visible}
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
                <F
                    form={form}
                    layout="vertical"
                    name="form_in_modal"
                    initialValues={{modifier: 'public'}}
                >
                    <F.Item
                        name="title"
                        label="Title"
                        rules={[{required: true, message: 'Please input the title!'}]}
                    >
                        <Input/>
                    </F.Item>
                    <F.Item
                        name="type"
                        label="Type"
                    >
                        <Select defaultValue="string" onChange={handleChange}>
                            <Option value="string">string</Option>
                            <Option value="number">number</Option>
                            <Option value="boolean">boolean</Option>
                        </Select>
                    </F.Item>
                </F>
            </Modal>
        );
    };

    const showDrawer = () => {
        setDrawerVisible(true);
    };

    const onDrawerClose = () => {
        setDrawerVisible(false);
    };

    const onClose = () => {
        setModalVisible(false);
    }

    const onSelect = () => {

    };

    const onCreate = (values: any) => {
        if (selectNode) {
            onAdd(selectNode.node, {
                title: values.title,
                key: values.title,
                type: values.type,
                formData: {},
                children: [] as any,
            })
            setModalVisible(false);
        }
    };


    return (
        <>
            <KubeObjectMenu {...props}>
                <MenuItem onClick={showDrawer}>
                    <Icon material="control_camera" title={_i18n._(t`Modal`)} interactive={toolbar}/>
                    <span className="title"><Trans>Modal</Trans></span>
                </MenuItem>
            </KubeObjectMenu>


            <CollectionCreateForm
                visible={modalVisible}
                onCreate={onCreate}
                onCancel={onClose}
            />
            <Drawer
                width={640}
                placement="right"
                closable={false}
                onClose={onDrawerClose}
                visible={drawerVisible}
            >
                <Tree
                    className="draggable-tree"
                    autoExpandParent={true}
                    multiple={false}
                    draggable
                    blockNode
                    treeData={gData}
                    onSelect={onSelect}
                    onRightClick={showModal}
                />
            </Drawer>
        </>
    )
}

apiManager.registerViews(pageApi, {
    Menu: PageMenu,
})
