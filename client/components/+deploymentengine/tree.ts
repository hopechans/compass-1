export const loop = (data: string | any[], key: any, callback: (item: any, index: any, arr: string | any[]) => void) => {
    for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
            return callback(data[i], i, data);
        }
        if (data[i].children) {
            loop(data[i].children, key, callback);
        }
    }
};

export const onChange = (gData: any, info: any, title: any) => {
    const data = [...gData];
    loop(data, info.key, (item: any, index: any, arr: any[]) => {
        item.title = title;
        item.key = title;
    })
    return data;
};

export const onAdd = (gData: any, info: any, children: any) => {
    const data = [...gData];
    loop(data, info.key, (item: any, index: any, arr: any[]) => {
        item.children = item.children || [];
        item.children.push(children);
    })
    return data;
};

export const onDelete = (gData: any, info: any) => {
    const data = [...gData];
    loop(data, info.key, (item: any, index: any, arr: any[]) => {
        arr.splice(index, 1);
    });
    return  data;
};