import { DataFrame, toJSON, Series, readCSV } from 'danfojs'
import { column } from 'element-plus/es/components/table-v2/src/common'

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
* @param 
    {{
        filterOptions?:{column:string|number,filter:(x:any)=>boolean,grouper?:(x:any)=>number,
            formatter?:(x:any)=>any,split?:boolean,replace?:'sum'|'avg'|'max'|'min'|'gap'|'first'},
        sortOptions?:{column:string|number,ascending?:boolean},
        appendOptions?:{sum?:boolean,avg?:boolean,min?:boolean,max?:boolean,gap?:boolean,
            printer?:string,printTime?:boolean},
        otherOptions?:{step?:number},
    }} options
* -
* - `filterOptions?:{column:string|number,filter:(x:any)=>boolean,grouper?:(x:any)=>number,
        formatter?:(x:any)=>any,split?:boolean,replace?:'sum'|'avg'|'max'|'min'|'gap'|'first'}` 
            指定列名,并应用filter:用于筛选,grouper用于分类,formatter:用于格式化数据,split:用于决定是否分离数据,
            replace:用于决定如何替代grouper分类之后的内部数据
* - `sortOptions?:{column:string|number,ascending?:boolean}` 指定列名和是否升序排列
* - `appendOptions?:{sum?:boolean,avg?:boolean,min?:boolean,
        max?:boolean,gap?:boolean,printer?:string,printTime?:boolean}` 
            决定在表格末尾添加哪些额外数据,请注意,printer是string格式
* @example
* produceData(data, {
        filterOptions: {
            column: 'sourceTimestamp',
            filter: filter,
            grouper: grouper,
            // replace: 'first',
            formatter: formatter,
            split: true,
        },
        appendOptions: {
            sum: true,
            gap: true,
            avg: true,
            min: true,
            max: true,
            printer: 'me',
            printTime: true,
        },
    })
* @returns [[any]]
*/
function produceData(data, options) {
    console.log(options)
    try {
        let df = new DataFrame(data)
        let dfList = []
        let map = new Map()
        let finalResult = []
        if (
            options.filterOptions &&
            options.filterOptions.filter &&
            df.columns.includes(options.filterOptions.column)
        ) {
            df.sortValues(options.filterOptions.column, { inplace: true })
            df.index.forEach((index) => {
                if (options.otherOptions && options.otherOptions.step) {
                    if (index % options.otherOptions.step != 0) {
                        df.drop({ index: [index], inplace: true })
                    }
                } else if (!options.filterOptions.filter(df.at(index, options.filterOptions.column))) {
                    df.drop({ index: [index], inplace: true })
                } else if (options.filterOptions.grouper) {
                    let result = options.filterOptions.grouper(df.at(index, options.filterOptions.column))
                    let value = map.get(result)
                    if (!value) {
                        map.set(result, [index])
                    } else {
                        value.push(index)
                    }
                }
            })
        }
        if (options.filterOptions.split) {
            let dfKeys = Array.from(map.keys())
            dfKeys.forEach((value) => {
                let keys = map.get(value)
                dfList.push(df.loc({ rows: keys }).resetIndex())
            })
        } else {
            dfList = [df]
        }
        dfList.forEach((df) => {
            if (
                options.filterOptions.grouper &&
                ['gap', 'sum', 'first', 'avg', 'min', 'max'].includes(options.filterOptions.replace)
            ) {
                let array = options.filterOptions.split ? ['ok'] : Array.from(map.keys())
                array = array.sort()
                let result = undefined
                array.forEach((value) => {
                    let keys = map.get(value)
                    let temp = []
                    let tempDF = options.filterOptions.split ? df : df.loc({ rows: keys })
                    tempDF.sortValues(options.filterOptions.column, { inplace: true })
                    if (options.filterOptions.replace == 'first') {
                        temp.push(...tempDF.iloc({ rows: [0] }).values[0])
                    } else {
                        tempDF.columns.forEach((column) => {
                            if (column == options.filterOptions.column) {
                                temp.push(tempDF[column].values[0])
                            } else {
                                if (tempDF[column].dtypes[0] == 'int32' || tempDF[column].dtypes[0] == 'float32') {
                                    if (options.filterOptions.replace == 'gap') {
                                        temp.push(
                                            Number((tempDF[column].values.at(-1) - tempDF[column].values[0]).toFixed(3))
                                        )
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
                    }
                    result = result
                        ? result.append(new Series(temp), [result.index.at(-1) + 1])
                        : new DataFrame([new Series(temp).values], {
                            columns: tempDF.columns,
                        })
                })
                df.print()
                df = result
            }
            if (options.filterOptions.formatter) {
                df.applyMap(
                    (x) => {
                        let result = x
                        if (!isNaN(Date.parse(x)) && isNaN(x)) {
                            result = options.filterOptions.formatter(x)
                        }
                        return String(result)
                    },
                    { inplace: true }
                )
            }
            if (options.sortOptions && options.sortOptions.column && df.columns.includes(options.sortOptions.column)) {
                df.sortValues(options.sortOptions.column, {
                    ascending: options.sortOptions.ascending ? options.sortOptions.ascending : null,
                    inplace: true,
                })
            }
            if (options.appendOptions) {
                let data = []
                let count = 0
                if (options.appendOptions.sum) {
                    data.push(new Series(new Array(df.columns.length).fill('sum'), { index: df.columns }))
                    data.push(df.sum({ axis: 0 }))
                    count++
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
                                temp.push('')
                            }
                        })
                        data.push(new Series(new Array(df.columns.length).fill('min'), { index: df.columns }))
                        data.push(new Series(temp))
                    }
                    count++
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
                                temp.push('')
                            }
                        })
                        data.push(new Series(new Array(df.columns.length).fill('max'), { index: df.columns }))
                        data.push(new Series(temp))
                    }
                    count++
                }
                if (options.appendOptions.avg) {
                    data.push(new Series(new Array(df.columns.length).fill('avg'), { index: df.columns }))
                    data.push(df.sum({ axis: 0 }).div(df.index.at(-1) + 1))
                    count++
                }
                if (options.appendOptions.gap) {
                    let temp = []
                    df.columns.forEach((column) => {
                        if (df[column].dtypes[0] == 'int32' || df[column].dtypes[0] == 'float32') {
                            temp.push(df[column].values.at(-1) - df[column].values.at(0))
                        } else {
                            temp.push('')
                        }
                    })
                    data.push(new Series(new Array(df.columns.length).fill('gap'), { index: df.columns }))
                    data.push(new Series(temp))
                    count++
                }
                if (options.appendOptions.printer) {
                    let temp = []
                    for (let i = 0; i < df.columns.length; i++) {
                        if (i == df.columns.length - 2) temp.push(options.appendOptions.printer)
                        else if (i == df.columns.length - 1 && options.appendOptions.printTime)
                            temp.push(new Date().toLocaleString())
                        else temp.push('')
                    }
                    data.push(new Series(temp))
                }
                if (count > 0) {
                    let length = df.index.at(-1) + 1
                    for (let index = length; index < length + data.length; index++) {
                        df = df.append(data[index - length], [index])
                    }
                }
            }
            // if (
            //     options.spliterOptions &&
            //     options.spliterOptions.spliter &&
            //     df.columns.includes(options.spliterOptions.column)
            // ) {
            //     let map = new Map()
            //     df.index.forEach((index) => {
            //         let number = options.spliterOptions.spliter(df.at(index, options.spliterOptions.column))
            //         if ((number == undefined) | null | false) {
            //             df.drop({ index: [index], inplace: true })
            //         } else {
            //             let group = map.has(number)
            //             group
            //                 ? map.get(number).push(...toJSON(df.loc({ rows: [index] })))
            //                 : map.set(number, [...toJSON(df.loc({ rows: [index] }))])
            //         }
            //     })
            //     return Array.from(map.values())
            // }
            df.fillNa('', { inplace: true })
            df.applyMap(
                (x) => {
                    if (typeof x === 'number') {
                        x = parseFloat(x.toFixed(4))
                    }
                    return String(x)
                },
                { inplace: true }
            )
            finalResult.push(toJSON(df))
        })
        // console.log(finalResult)
        return finalResult
    } catch (e) {
        console.log(e)
    }
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
        try {
            const db = new SQL.Database(dataBase)
            let stmt = db.prepare(`select ${attributeString} from ${tableName}`)
            while (stmt.step()) {
                const row = stmt.getAsObject()
                result.push(row)
            }
        } catch (err) {
            console.log(err)
        }
        callback(result)
    })
}

export { readFromSource, produceData, readDbData }
