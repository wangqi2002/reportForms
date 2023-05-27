const { DataFrame, readExcel, toCSV, toExcel, readCSV, toJSON } = require('danfojs-node')
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
     * @param {any} data
     * 通常情况下应当是object[]
     * @param {string | number} column
     * 列名,可以是数字或者名字
     * @param {string | RegExp} reg
     * 如果列中有某个数据patter.test()返回为false即不满足正则条件,那么去除该行
     * @param {string} rawPattern
     * @param {any[]} params
     * @example
     * filterData(jsonData[], 'columnName', '^1$')
     * @returns
     */
    static filterData(data, column, reg, rawPattern, params) {
        let pattern = reg ? reg : DataProducer.producePattern(rawPattern, params)
        let df = new DataFrame(data)
        if (df.columns.includes(column) && pattern) {
            let patt = new RegExp(pattern)
            df.index.forEach((index) => {
                let isRequired = patt.test(df.at(index, column))
                if (!isRequired) df.drop({ index: [index], inplace: true })
            })
        }
        return df.toJSON()
    }

    static exportToFile(type, filePath, df, options) {
        try {
            switch (type) {
                case 'excel':
                    {
                        toExcel(df, { filePath: filePath, ...options })
                    }
                    break
                case 'csv':
                    {
                        toCSV(df, { filePath: filePath, ...options })
                    }
                    break
            }
            return true
        } catch (e) {
            throw e
        }
    }
}

let f = async () => {
    let data = await DataProducer.readFromSource('excel', './nice.xlsx', {
        columnRange: { from: '0', to: '3' },
        rowRange: { from: '0', to: '3' },
        format: 'column',
    })
    let a = await DataProducer.readFromSource('sqlite', '../../../databases/data.db', {
        onlyTable: false,
        tableName: 'week_2023_3_3s',
        fields: ['id', 'value', 'dataType'],
        limit: '10',
    })
    let b = DataProducer.filterData(a, 'value', '^1$')
    console.log(a)
    // exportToFile('csv', './nice2.csv', df)
}
let pa = require('./patterns.json')
let a = '^${params[0]}[/.-]${params[1]}[/.-]${params[2]}'
let p = DataProducer.producePattern(a, ['2023', '5', '27'])
console.log(p)
let c = new RegExp(p)
console.log(c.test('2023.5.27'))
