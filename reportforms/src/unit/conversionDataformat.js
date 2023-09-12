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
                Object.assign(tableItem.cells, obj)
                j++
            }
            let rowObj = {}
            let rowKey = index
            rowObj[rowKey] = tableItem
            Object.assign(rowData, rowObj)
        } else {
            for (let key in dataList[i]) {
                let obj = {}
                let keyStr = j
                let value = { text: dataList[i][key] }
                obj[keyStr] = value
                Object.assign(tableItem.cells, obj)
                j++
            }
            let rowObj = {}
            let rowKey = index
            rowObj[rowKey] = tableItem
            Object.assign(rowData, rowObj)
        }
        index++
    }
    Object.assign(rowData, { len: 100 })
    const data = [
        {
            name: 'sheet1',
            freeze: 'A1',
            styles: [],
            merges: [],
            rows: rowData,
            cols: {
                len: 40,
            },
            validations: [],
            autofilter: {},
        },
    ]
    return data
}

const dbTolucky = (data, range, isIn) => {
    let index = 0
    console.log(range)
    let rangeSpace = {}
    if (range.tableHead) {
        rangeSpace = {
            r: range.row[1],
            c: range.column[0],
            data: [...range.tableHead],
        }
    } else {
        rangeSpace = {
            r: range.row[0],
            c: range.column[0],
        }
    }
    console.log(rangeSpace)
    let luckyData = []
    if (Array.isArray(data[0])) {
        data.forEach((item) => {
            luckyData.push(dbDataConverL(rangeSpace, index++, item, isIn))
        })
    } else {
        luckyData.push(dbDataConverL(rangeSpace, index++, data, isIn))
    }
    return luckyData
}
const dbDataConverL = (rangeSpace, index, data, isIn) => {
    let sheet = {
        name: 'Sheet',
        color: '',
        index: 0,
        status: 0,
        order: 0,
        celldata: [],
        config: {},
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
    if (!isIn) {
        for (let i = 0; i < data.length + 1; i++) {
            let j = 0
            for (const item in data[i]) {
                if (item != 'sourceTimestamp') {
                    cellData.push({
                        r: i + rangeSpace.r + 1,
                        c: j + rangeSpace.c,
                        v: {
                            v: data[i][item],
                            ht: "0",
                            ct: {
                                fa: "General",
                                t: "n"
                            }
                        },
                    })
                    j++
                }
            }
            //todo: 合并单元格导出有问题，数据格式不正确
            // let arr = Object.values(data[i])
            // let rsV = arr.length
            // if (rsV > 1) {
            //     let flag = arr[0]
            //     let result = arr.every(item => item === flag)
            //     if (result) {
            //         for (const item in data[i]) {
            //             if (j == 0) {
            //                 cellData.push({
            //                     r: i + rangeSpace.r,
            //                     c: j + rangeSpace.c,
            //                     v: {
            //                         v: data[i][item],
            //                         ht: "0",
            //                         mc: {
            //                             c: rangeSpace.c,
            //                             r: i + rangeSpace.r,
            //                             cs: rsV,
            //                             rs: 1
            //                         },
            //                         ct: {
            //                             fa: "General",
            //                             t: "n"
            //                         }
            //                     },
            //                 })
            //             } else {
            //                 cellData.push({
            //                     r: i + rangeSpace.r,
            //                     c: j + rangeSpace.c,
            //                     v: {
            //                         ht: "0",
            //                         mc: {
            //                             c: rangeSpace.c,
            //                             r: i + rangeSpace.r
            //                         },
            //                         ct: {
            //                             fa: "General",
            //                             t: "n"
            //                         }
            //                     },
            //                 })
            //             }
            //             j++
            //         }
            //     } else {
            //         for (const item in data[i]) {
            //             cellData.push({
            //                 r: i + rangeSpace.r,
            //                 c: j + rangeSpace.c,
            //                 v: {
            //                     v: data[i][item],
            //                     ht: "0",
            //                     ct: {
            //                         fa: "General",
            //                         t: "n"
            //                     }
            //                 },
            //             })
            //             j++
            //         }
            //     }
            // } else {
            //     for (const item in data[i]) {
            //         cellData.push({
            //             r: i + rangeSpace.r,
            //             c: j + rangeSpace.c,
            //             v: {
            //                 v: data[i][item],
            //                 ht: "0",
            //                 ct: {
            //                     fa: "General",
            //                     t: "n"
            //                 }
            //             },
            //         })
            //         j++
            //     }
            // }
        }
    } else {
        for (let i = 0; i < data.length + 1; i++) {
            let j = 0
            for (const item in data[i]) {
                cellData.push({
                    r: i + rangeSpace.r + 1,
                    c: j + rangeSpace.c,
                    v: {
                        v: data[i][item],
                        ht: "0",
                        ct: {
                            fa: "General",
                            t: "n"
                        }
                    },
                })
                j++

            }
            //todo: 合并单元格导出有问题，数据格式不正确
            // let arr = Object.values(data[i])
            // let rsV = arr.length
            // if (rsV > 1) {
            //     let flag = arr[0]
            //     let result = arr.every(item => item === flag)
            //     if (result) {
            //         for (const item in data[i]) {
            //             if (j == 0) {
            //                 cellData.push({
            //                     r: i + rangeSpace.r,
            //                     c: j + rangeSpace.c,
            //                     v: {
            //                         v: data[i][item],
            //                         ht: "0",
            //                         mc: {
            //                             c: rangeSpace.c,
            //                             r: i + rangeSpace.r,
            //                             cs: rsV,
            //                             rs: 1
            //                         },
            //                         ct: {
            //                             fa: "General",
            //                             t: "n"
            //                         }
            //                     },
            //                 })
            //             } else {
            //                 cellData.push({
            //                     r: i + rangeSpace.r,
            //                     c: j + rangeSpace.c,
            //                     v: {
            //                         ht: "0",
            //                         mc: {
            //                             c: rangeSpace.c,
            //                             r: i + rangeSpace.r
            //                         },
            //                         ct: {
            //                             fa: "General",
            //                             t: "n"
            //                         }
            //                     },
            //                 })
            //             }
            //             j++
            //         }
            //     } else {
            //         for (const item in data[i]) {
            //             cellData.push({
            //                 r: i + rangeSpace.r,
            //                 c: j + rangeSpace.c,
            //                 v: {
            //                     v: data[i][item],
            //                     ht: "0",
            //                     ct: {
            //                         fa: "General",
            //                         t: "n"
            //                     }
            //                 },
            //             })
            //             j++
            //         }
            //     }
            // } else {
            //     for (const item in data[i]) {
            //         cellData.push({
            //             r: i + rangeSpace.r,
            //             c: j + rangeSpace.c,
            //             v: {
            //                 v: data[i][item],
            //                 ht: "0",
            //                 ct: {
            //                     fa: "General",
            //                     t: "n"
            //                 }
            //             },
            //         })
            //         j++
            //     }
            // }
        }
    }
    console.log(cellData)
    sheet.celldata = cellData
    console.log(sheet)
    return sheet
}
const produceOption = (fillOptions) => {
    if (fillOptions) {
        let options = {
            spliterOptions: {},
            filterOptions: {},
            appendOptions: {
                sum: false,
                avg: false,
                min: false,
                max: false,
                gap: false
            },
            sortOptions: {},
        }
        for (const [key, value] of fillOptions) {
            if (value.spliter != null) {
                options.spliterOptions.column = value.column
                options.spliterOptions.spliter = value.spliter
            }
            if (value.filter != null) {
                options.filterOptions.column = value.column
                options.filterOptions.filter = value.filter
                options.filterOptions.grouper = value.grouper
                options.filterOptions.replace = value.replace
                options.filterOptions.formatter = value.formatter
                options.filterOptions.split = value.split
            }
            if (value.append != null) {
                for (let i = 0; i < value.append.length; i++) {
                    if (value.append[i] in options.appendOptions)
                        options.appendOptions[value.append[i]] = true
                }
            }
            if (value.sort != null) {
                options.sortOptions.column = value.column
                options.sortOptions.ascending = value.sort
            }
        }
        return options
    }
    return undefined
}
function rangeTohead(range) {
    let tableHeadrange = {
        row: null,
        column: null,
    }
    if (range.row[0] > 0) {
        tableHeadrange.row = [0, range.row[0] - 1]
        tableHeadrange.column = [range.column[0], range.column[1]]
    }
    return tableHeadrange
}

export { dbTospread, dbTolucky, produceOption, rangeTohead }
