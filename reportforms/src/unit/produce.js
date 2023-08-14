import { DataFrame, toJSON, Series } from 'danfojs'
// const { DataFrame, toJSON, Series } = require('danfojs')
/**
* @param {'sqlite'|'excel'|'csv'} type 确认是哪种数据类型,目前支持:sqlite,excel,csv
* @param {string} fileName 文件相对/绝对路径并且携带文件名称和后缀
* @param {{onlyTable?: boolean,tableName?:string,fields?:string[],
* limit?:string,columnRange?:{from:string,to:string}, rowRange?:{from:string,to:string},format?:string}} [options]
* 用于指定可选参数,不同数据类型,可选选项不同
* - `onlyTable?: boolean` 如果使用sqlite数据库,那么传递此项来让函数仅仅读出数据库所有表名
* - `tableName?:string` 如果使用sqlite数据库,那么指定表名
* - `fields?:string[]` 如果使用sqlite数据库,那么指定字段
* - `limit?:string` 如果使用sqlite数据库,那么指定选出最多limit条数据,也可以使用例如'2,10'来指定范围
* - `columnRange?:{from:string,to:string}` 如果使用excel,那么指定列范围
* - `rowRange?:{from:string,to:string}` 如果使用excel,那么指定行
* - `format?:'row'|'column'` 数据格式化,默认按column格式化
* @example
* let data = await readFromSource('excel', './nice.xlsx', {
       columnRange: { from: '0', to: '3' },
       rowRange: { from: '0', to: '3' },
       format: 'column',
   })
   @example
   let a = await readFromSource('sqlite', '../../../databases/data.db', {
       tableName: 'week_2023_3_3s',
       fields: ['id', 'value'],
       limit: '10',
   })
* @returns object[] | undefined
*/
function readFromSource(type, file, options, callback) {
    switch (type) {
        case 'sqlite':
            {
                initSqlJs(config).then(function (SQL) {
                    const result = []
                    const db = new SQL.Database(file)
                    if (options.onlyTable) {
                        let stmt = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`)
                        while (stmt.step()) {
                            const row = stmt.getAsObject()
                            result.push(row)
                        }
                    } else {
                        let limit = options.limit ? options.limit : '15'
                        let field = '*'
                        if (options.fields) {
                            field = options.fields[0]
                            options.fields.forEach((f, index) => {
                                if (index > 0) field = field + ',' + f
                            })
                        }
                        let stmt = db.prepare(`select ${field} from ${options.tableName} limit ${limit}`)
                        while (stmt.step()) {
                            const row = stmt.getAsObject()
                            result.push(row)
                        }
                    }
                    callback(result)
                })
            }
            break
        case 'excel':
            {
                console.log('excel')
            }
            break
        default:
            return undefined
    }
}

/**
* @param {DataFrame|object[]} data 通常情况下应当是object[]
* @param {{
    filterOptions?:{column:string|number,filter:(x:any)=>boolean,grouper?:(x:any)=>number,replace?:'sum'|'avg'|'max'|'min'|'gap'},
    sortOptions?:{column:string|number,ascending?:boolean},
    spliterOptions?:{column:string|number,spliter:(x:any)=>number},
    appendOptions?:{sum?:boolean,avg?:boolean,min?:boolean,max?:boolean,gap?:boolean},
    otherOptions?:{step?:number}
}} options
* 必选参数用于指定filter/sort/spliter
* - `filterOptions?:{column:string|number,filter:(x:any)=>boolean}` 指定列名和filter
* - `sortOptions?:{column:string|number,ascending?:boolean}` 指定列名和是否升序排列
* - `spliterOptions?:{column:string|number,spliter:(x:any)=>number}` 指定列名和spliter
* @example
* DataProducer.produceData(
        [
            { columnName: 1, otherColumn: 'ok' },
            { columnName: 12, otherColumn: 'nice' },
            { columnName: 1, otherColumn: 'o' },
        ],
        {
            spliterOptions: {
                column: 'columnName',
                spliter: (x) => {
                    if (x == 1) return 0
                    return 1
                },
            },
            filterOptions: {
                column: 'columnName',
                filter: (x) => {
                    return x == 1
                },
            },
            sortOptions: {
                column: 'otherColumn',
                ascending: false,
            },
        }
        )
* @returns
*/
function produceData(data, options) {
    let df = new DataFrame(data)
    if (options.filterOptions && options.filterOptions.filter && df.columns.includes(options.filterOptions.column)) {
        let map = new Map()
        let temp = new DataFrame()
        df.index.forEach((index) => {
            if (options.otherOptions && options.otherOptions.step) {
                if (index % options.otherOptions.step != 0) {
                    df.drop({ index: [index], inplace: true })
                }
            } else if (!options.filterOptions.filter(df.at(index, options.filterOptions.column))) {
                df.drop({ index: [index], inplace: true })
            } else {
                let result = options.filterOptions.grouper(df.at(index, options.filterOptions.column))
                let value = map.get(result)
                if (!value) {
                    map.set(result, [index])
                } else {
                    value.push(index)
                }
            }
        })
        if (options.filterOptions.grouper && options.filterOptions.replace) {
            let array = Array.from(map.keys())
            array = array.sort()
            let result = undefined
            array.forEach((value) => {
                let keys = map.get(value)
                let temp = []
                let tempDF = df.loc({ rows: keys })
                tempDF.columns.forEach((column) => {
                    if (column == options.filterOptions.column) {
                        temp.push(tempDF[column].values[0])
                    } else {
                        if (tempDF[column].dtypes[0] == 'int32' || tempDF[column].dtypes[0] == 'float32') {
                            if (options.filterOptions.replace == 'gap') {
                                temp.push(Number((tempDF[column].values.at(-1) - tempDF[column].values[0]).toFixed(3)))
                            } else {
                                eval(`temp.push(
                                        tempDF
                                            .loc({ columns: [column]})
                                            .${options.filterOptions.replace == 'avg'
                                        ? 'mean'
                                        : options.filterOptions.replace
                                    }({axis:0})
                                            .round(3).values[0]
                                    )`)
                            }
                        } else {
                            temp.push(tempDF[column].values[0])
                        }
                    }
                })
                result = result
                    ? result.append(new Series(temp), [result.index.at(-1) + 1])
                    : new DataFrame([new Series(temp).values], {
                        columns: tempDF.columns,
                    })
            })
            df = result
        }
    }
    if (options.sortOptions && options.sortOptions.column && df.columns.includes(options.sortOptions.column)) {
        df.sortValues(options.sortOptions.column, {
            ascending: options.sortOptions.ascending ? options.sortOptions.ascending : null,
            inplace: true,
        })
    }
    if (options.appendOptions) {
        let data = []
        if (options.appendOptions.sum) {
            data.push(df.cumSum({ axis: 0 }))
        }
        if (options.appendOptions.min) {
            if (df.dtypes.every((x) => x == 'int32' || x == 'float32')) {
                data.push(df.min({ axis: 0 }))
            } else {
                let temp = []
                df.columns.forEach((column) => {
                    if (df[column].dtypes[0] == 'int32' || df[column].dtypes[0] == 'float32') {
                        temp.push(df[column].min())
                    } else {
                        temp.push('NaN')
                    }
                })
                data.push(new Series(temp))
            }
        }
        if (options.appendOptions.max) {
            if (df.dtypes.every((x) => x == 'int32' || x == 'float32')) {
                data.push(df.min({ axis: 0 }))
            } else {
                let temp = []
                df.columns.forEach((column) => {
                    if (df[column].dtypes[0] == 'int32' || df[column].dtypes[0] == 'float32') {
                        temp.push(df[column].max())
                    } else {
                        temp.push('NaN')
                    }
                })
                data.push(new Series(temp))
            }
        }
        if (options.appendOptions.avg) {
            data.push(df.cumSum({ axis: 0 }).div(df.index.at(-1) + 1))
        }
        if (options.appendOptions.gap) {
            let temp = []
            df.columns.forEach((column) => {
                if (df[column].dtypes[0] == 'int32' || df[column].dtypes[0] == 'float32') {
                    temp.push(df[column].values.at(-1) - df[column].values.at(0))
                } else {
                    temp.push('NaN')
                }
            })
            data.push(new Series(temp))
        }
        let length = df.index.at(-1) + 1
        for (let index = length; index < length + data.length; index++) {
            df = df.append(data[index - length], [index])
        }
    }
    if (
        options.spliterOptions &&
        options.spliterOptions.spliter &&
        df.columns.includes(options.spliterOptions.column)
    ) {
        let map = new Map()
        df.round(3, { inplace: true })
        df.index.forEach((index) => {
            let number = options.spliterOptions.spliter(df.at(index, options.spliterOptions.column))
            if ((number == undefined) | null | false) {
                df.drop({ index: [index], inplace: true })
            } else {
                let group = map.has(number)
                group
                    ? map.get(number).push(...toJSON(df.loc({ rows: [index] })))
                    : map.set(number, [...toJSON(df.loc({ rows: [index] }))])
            }
        })
        return Array.from(map.values())
    }
    return toJSON(df)
}
/**
 *
 * @param {file} dataBase
 * @param {string} tableName
 * @param {string} attributeString
 * @param {function (params) {}} callback
 */

function readDbData(dataBase, tableName, attributeString, callback) {
    initSqlJs(config).then(function (SQL) {
        const result = []
        const db = new SQL.Database(dataBase)
        let stmt = db.prepare(`select ${attributeString} from ${tableName}`)
        while (stmt.step()) {
            const row = stmt.getAsObject()
            result.push(row)
        }
        callback(result)
    })
}

// let data = [
//     { A: '2023', B: 4.28283, C: 1.509, D: 'ok' },
//     { A: '2022', B: 0.22863, C: 3.39059, D: 'no' },
//     { A: '2023', B: 0.82863, C: 1.5059, D: 'yes' },
//     { A: '2022', B: 1.28863, C: 4.5059, D: 'nice' },
// ]
// let a = ''
// console.log(
//     produceData(data, {
//         filterOptions: {
//             column: 'A',
//             filter: (x) => {
//                 return true
//             },
//             grouper: (x) => {
//                 return x.startsWith('2023') ? 0 : 1
//             },
//             replace: 'gap',
//         },
//     }),
//     'nice'
// )

export { readFromSource, produceData, readDbData }
