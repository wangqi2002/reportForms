const dbDataConver = (dataList) => {
    const rowData = {}
    let index = 0
    for (let i = 0; i < dataList.length; i++) {
        let j = 0
        let tableItem = { cells: {} }
        if (i == 0) {
            for (let key in dataList[i]) {
                let obj = {}
                let keyStr = j
                let value = { text: key }
                obj[keyStr] = value
                Object.assign(tableItem.cells, obj);
                j++
            }
            let rowObj = {}
            let rowKey = index
            rowObj[rowKey] = tableItem
            Object.assign(rowData, rowObj);
        } else {
            for (let key in dataList[i]) {
                let obj = {}
                let keyStr = j
                let value = { text: dataList[i][key] }
                obj[keyStr] = value
                Object.assign(tableItem.cells, obj);
                j++
            }
            let rowObj = {}
            let rowKey = index
            rowObj[rowKey] = tableItem
            Object.assign(rowData, rowObj);
        }
        index++
    }
    Object.assign(rowData, { len: 100 });
    return rowData;
}
const dbTospread = (rowData) => {
    const data = [
        {
            name: "sheet1",
            freeze: "A1",
            styles: [],
            merges: [],
            rows: rowData,
            cols: {
                len: 40
            },
            validations: [],
            autofilter: {}
        }
    ]
    return data;
}

export {
    dbDataConver,
    dbTospread
}
