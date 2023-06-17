const dbTospread = (dataList) => {
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

const dbTolucky = (data, range) => {
    let index = 0
    console.log(range)
    let rangeSpace = {}
    if (range.tableHead) {
        rangeSpace = {
            r: range.row[0],
            c: range.column[0],
            data: [...range.tableHead]
        }
    } else {
        rangeSpace = {
            r: range.row[0],
            c: range.column[0]
        }
    }
    let luckyData = []
    if (Array.isArray(data[0])) {
        data.forEach((item) => {
            luckyData.push(dbDataConverL(rangeSpace, index++, item))
        })
    } else {
        luckyData.push(dbDataConverL(rangeSpace, index++, data))
    }
    return luckyData;
}
const dbDataConverL = (rangeSpace, index, data) => {
    let sheet = {
        name: "Sheet",
        color: "",
        index: 0,
        status: 0,
        order: 0,
        celldata: [],
        config: {}
    }
    if (index == 0) {
        sheet.name = sheet.name + index
        sheet.status = 1
    } else {
        sheet.name = sheet.name + index
        sheet.index = index
        sheet.order = index
    }
    let cellData = []
    if (rangeSpace.data) {
        rangeSpace.data.forEach((item) => {
            cellData.push(item)
        })
    }
    for (let i = 0; i < data.length; i++) {
        let j = 0
        for (const item in data[i]) {
            cellData.push({
                r: i + rangeSpace.r,
                c: j + rangeSpace.c,
                v: data[i][item]
            })
            j++
        }
    }
    sheet.celldata = cellData
    return sheet
}
const produceOption = (fillOptions) => {
    let options = {
        striperOptions: {},
        filterOptions: {},
        sortOptions: {}
    };
    for (const [key, value] of fillOptions) {
        if (value.striper != null) {
            options.striperOptions.column = value.column
            options.striperOptions.striper = value.striper
        }
        if (value.filter != null) {
            options.filterOptions.column = value.column
            options.filterOptions.filter = value.filter
        }
        if (value.sort != null) {
            options.sortOptions.column = value.column
            options.sortOptions.ascending = value.sort
        }
    }
    return options;
}
function rangeTohead(range) {
    let tableHeadrange = {
        row: null,
        column: null
    }
    if (range.row[0] > 0) {
        tableHeadrange.row = [0, range.row[0] - 1]
        tableHeadrange.column = [range.column[0], range.column[1]]
    }
    return tableHeadrange;
}

export {
    dbTospread,
    dbTolucky,
    produceOption,
    rangeTohead
}
