const { DataFrame, readExcel, readCSV, toJSON } = require('danfojs-node')
const Database = require('better-sqlite3')

class DataProducer {
    /**
     * @param {string} type 确认是哪种数据类型,目前支持:sqlite,excel,csv
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
    static async readFromSource(type, fileName, options) {
        switch (type) {
            case 'sqlite':
                {
                    let db = new Database(fileName)
                    let result = undefined
                    if (options.onlyTable) {
                        let stmt = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`)
                        result = stmt.all()
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
                        result = stmt.all()
                    }
                    return result
                }
                break
            case 'excel':
                {
                    let data = await readExcel(fileName, {})
                    let result = data.iloc({
                        columns: [options.columnRange.from + ':' + options.columnRange.to],
                        rows: [options.rowRange.from + ':' + options.rowRange.to],
                    })
                    let format = options.format ? options.format : 'column'
                    return toJSON(result, { format: format })
                }
                break
            case 'csv':
                {
                    let data = await readCSV(fileName)
                    let result = data.iloc({
                        columns: [columnRange.from + ':' + columnRange.to],
                        rows: [rowRange.from + ':' + rowRange.to],
                    })
                    let format = options.format ? options.format : 'column'
                    return toJSON(result, { format: format })
                }
                break
            default:
                return undefined
        }
    }

    /**
     * @param {DataFrame|object[]} data 通常情况下应当是object[]
     * @param {{filterOptions?:{column:string|number,filter:(x:any)=>boolean},sortOptions?:{column:string|number,ascending?:boolean},striperOptions?:{column:string|number,striper:(x:any)=>number}}} options
     * 必选参数用于指定filter/sort/striper
     * 
     * -`filterOptions?:{column:string|number,filter:(x:any)=>boolean}` 指定列名和filter
     * 
     * -`sortOptions?:{column:string|number,ascending?:boolean}` 指定列名和是否升序排列
     * 
     * -`striperOptions?:{column:string|number,striper:(x:any)=>number}` 指定列名和striper
     * @example
     * DataProducer.produceData(
        [
            { columnName: 1, otherColumn: 'ok' },
            { columnName: 12, otherColumn: 'nice' },
        ],
        {
            filterOptions: {
                column: 'columnName',
                filter: (x) => {
                    return x == 12
                },
            },
        }
    )
     * @returns
     */
    static produceData(data, options) {
        let df = new DataFrame(data)
        df.print()
        if (
            options.filterOptions &&
            options.filterOptions.filter &&
            df.columns.includes(options.filterOptions.column)
        ) {
            df.index.forEach((index) => {
                if (!options.filterOptions.filter(df.at(index, options.filterOptions.column))) {
                    df.drop({ index: [index], inplace: true })
                }
            })
        }
        if (options.sortOptions && options.sortOptions.column && df.columns.includes(options.sortOptions.column)) {
            df.sortValues(options.filterOptions.column, {
                ascending: options.filterOptions.ascending ? options.filterOptions.ascending : null,
                inplace: true,
            })
        }
        if (
            options.striperOptions &&
            options.striperOptions.striper &&
            df.columns.includes(options.striperOptions.column)
        ) {
            let map = new Map()
            df.index.forEach((index) => {
                let number = options.striperOptions.striper(df.at(index, options.striperOptions.column))
                if ((number == undefined) | null | false) {
                    df.drop({ index: [index], inplace: true })
                } else {
                    let group = map.get(number)
                    group ? group.push(df[index].toJSON()) : map.set(number, [df[index].toJSON()])
                }
            })
            return [...map.values()]
        }
        return df.toJSON()
    }
}

// let f = async () => {
//     let data = await DataProducer.readFromSource('excel', './nice.xlsx', {
//         columnRange: { from: '0', to: '3' },
//         rowRange: { from: '0', to: '3' },
//         format: 'column',
//     })
//     let a = await DataProducer.readFromSource('sqlite', '../../../databases/data.db', {
//         onlyTable: false,
//         tableName: 'week_2023_3_3s',
//         fields: ['id', 'value', 'dataType'],
//         limit: '10',
//     })
//     let b = DataProducer.filterData(a, 'value', '^1$')
//     console.log(a)
//     // exportToFile('csv', './nice2.csv', df)
// }
// let pa = require('./patterns.json')
// let a = '^${params[0]}[/.-]${params[1]}[/.-]${params[2]}'
// let p = DataProducer.producePattern(a, ['2023', '5', '27'])
// console.log(p)
// let c = new RegExp(p)
// console.log(c.test('2023.5.27'))
