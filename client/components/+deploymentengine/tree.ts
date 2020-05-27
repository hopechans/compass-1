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