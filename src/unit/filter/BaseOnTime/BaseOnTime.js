let patternTemplate = {
    today: '^${params[0]}[/.: -]0?${params[1]}[/.: -T]0?${params[2]}',
    thisMonth: '^${params[0]}[/.: -]0?${params[1]}',
    thisYear: '^${params[0]}',
} //注意正则表达式中-需要放到边界,否则会被误会为范围

/**
 * @param {string} raw
 * @param {any[]} params
 * @returns
 */
function generatePattern(raw, params) {
    return eval('`' + raw + '`')
}

function getFormatDate(mode, targetDate) {
    let date = new Date(targetDate),
        year = date.getFullYear(), //获取完整的年份(4位)
        month = date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
        strDate = date.getDate(), // 获取当前日(1-31)
        hour = date.getHours(), // 获取当前日(1-31)
        minutes = date.getMinutes() // 获取当前日(1-31)
    if (month < 10) month = `0${month}` // 如果月份是个位数，在前面补0
    if (strDate < 10) strDate = `0${strDate}` // 如果日是个位数，在前面补0
    switch (mode) {
        case 0:
            return `${year}`
        case 1:
            return `${year}-${month}`
        case 2:
            return `${year}-${month}-${strDate}`
        case 3:
            return date.toLocaleString()
        default:
            break
    }
    return `${year}-${month}-${strDate}`
}

/**
 * @param {'byDay'|'byWeek'|'byMonth'|'byYear'|'byRange'|'byClass'} purpose 用于确定转换到哪个类型
 * - `byDay` 天
 * - `byWeek` 周
 * - `byMonth` 月
 * - `byYear` 年
 * - `byRange` 日期范围
 * - `byClass` 班次
 * @param {{
 * date?:Date|string,
 * range?:{start:Date|string,end:Date|string},
 * interval?:string,
 * theTopOfTime?:boolean,
 * classOption?:{start:Date|string,gap:number}
 * }} [options]
 * - `date?:Date|string` 用于指定日期
 * - `range?:{start:Date|string,end:Date|string}`用于指定日期范围,仅用于'range'情况
 * @example
 * let filter = configureFilter('today')
 * filter('2023/5/28')
 * @returns
 */
function configureFilter(purpose, options) {
    try {
        let filter = undefined
        let grouper = undefined
        let formatter = undefined
        let currentDate = options.date ? new Date(String(options.date)) : new Date()
        let pattern = {}
        switch (purpose) {
            case 'byDay':
                {
                    pattern = new RegExp(
                        generatePattern(patternTemplate.today, [
                            currentDate.getFullYear(),
                            currentDate.getMonth() + 1,
                            currentDate.getDate(),
                        ])
                    )
                    if (options.interval) {
                        let firstValue = new Map()
                        let firstTime = undefined
                        let firstSig = false
                        let timeWant = new Map()
                        //决定时间间隔粒度大小的数值,如果数据与想要的时间相差小于这个大小,那么可以认为是有效数据
                        let particleSize = 999999999
                        filter = (x) => {
                            let currentHour = new Date(x)
                            let interval = undefined
                            let mis = undefined
                            let currentValue = undefined
                            if (firstSig) {
                                firstSig = false
                                particleSize = currentHour - firstTime
                            }
                            if (!firstTime) {
                                firstTime = options.theTopOfTime
                                    ? new Date(currentHour.toLocaleDateString() + ' 00:00')
                                    : currentHour
                                firstSig = true
                            }
                            if (options.interval.endsWith('h')) {
                                interval = Number(options.interval.replaceAll('h', '')) * 3600
                                mis = interval * 60
                                currentValue = currentHour.getHours()
                            } else if (options.interval.endsWith('m')) {
                                interval = Number(options.interval.replaceAll('m', '')) * 60
                                mis = interval * 5
                                currentValue = currentHour.getHours() + currentHour.getMinutes()
                            } else {
                                interval = Number(options.interval.replaceAll('s', ''))
                                mis = 1
                                currentValue = currentHour.toLocaleTimeString()
                            }
                            if (
                                pattern.test(x) &&
                                Math.abs(currentHour - firstTime) % (interval * 1000) < particleSize &&
                                !firstValue.has(currentValue) &&
                                !timeWant.has(Math.floor(Math.abs(currentHour - firstTime) / (interval * 1000)))
                            ) {
                                firstValue.set(currentValue)
                                timeWant.set(
                                    Math.floor(Math.abs(currentHour - firstTime) / (interval * 1000)),
                                    Math.floor(Math.abs(currentHour - firstTime) / (interval * 1000))
                                )
                                return true
                            } else {
                                return false
                            }
                        }
                    } else {
                        filter = (x) => {
                            return pattern.test(x)
                        }
                    }
                    formatter = (x) => {
                        return getFormatDate(3, x)
                    }
                }
                break
            case 'byWeek':
                {
                    //并非使用正则表达式,而是替换了pattern.test方法
                    const oneDayTime = 1000 * 60 * 60 * 24
                    const week = parseInt((parseInt(currentDate.getTime() / oneDayTime) + 4) / 7)
                    pattern.test = (x) => {
                        let xDate = parseInt(new Date(x).getTime() / oneDayTime)
                        return parseInt((xDate + 4) / 7) == week
                    }
                    filter = (x) => {
                        return pattern.test(x)
                    }
                    grouper = (x) => {
                        return new Date(x).getDay()
                    }
                }
                break
            case 'byMonth':
                {
                    pattern = new RegExp(
                        generatePattern(patternTemplate.thisMonth, [
                            currentDate.getFullYear(),
                            currentDate.getMonth() + 1,
                        ])
                    )
                    filter = (x) => {
                        return pattern.test(x)
                    }
                    grouper = (x) => {
                        return new Date(x).getDate()
                    }
                    formatter = (x) => {
                        return getFormatDate(2, x)
                    }
                }
                break
            case 'byYear':
                {
                    pattern = new RegExp(generatePattern(patternTemplate.thisYear, [currentDate.getFullYear()]))
                    filter = (x) => {
                        return pattern.test(x)
                    }
                    grouper = (x) => {
                        return new Date(x).getMonth()
                    }
                    formatter = (x) => {
                        return getFormatDate(1, x)
                    }
                }
                break
            case 'byRange':
                {
                    if (options.range) {
                        const d1 = new Date(options.range.start)
                        const d2 = new Date(options.range.end)
                        pattern.test = (x) => {
                            let date = new Date(x)
                            if (date < d2 && date > d1) {
                                return true
                            } else {
                                return false
                            }
                        }
                        filter = (x) => {
                            return pattern.test(x)
                        }
                        formatter = (x) => {
                            return getFormatDate(3, x)
                        }
                    }
                }
                break
            case 'byClass':
                {
                    let startDateTime = new Date(options.date + '/' + options.classOption.start)
                    let nextDate = new Date(options.date + '/' + options.classOption.start)
                    nextDate.setDate(nextDate.getDate() + 1)
                    console.log(startDateTime, nextDate)
                    if (options.interval) {
                        let firstValue = new Map()
                        let firstTime = undefined
                        let firstSig = false
                        let timeWant = new Map()
                        //决定时间间隔粒度大小的数值,如果数据与想要的时间相差小于这个大小,那么可以认为是有效数据
                        let particleSize = 999999999
                        filter = (x) => {
                            let currentHour = new Date(x)
                            let interval = undefined
                            let mis = undefined
                            let currentValue = undefined
                            if (firstSig) {
                                firstSig = false
                                particleSize = currentHour - firstTime
                            }
                            if (!firstTime) {
                                firstTime = options.theTopOfTime
                                    ? new Date(currentHour.toLocaleDateString() + ' 00:00')
                                    : currentHour
                                firstSig = true
                            }
                            if (options.interval.endsWith('h')) {
                                interval = Number(options.interval.replaceAll('h', '')) * 3600
                                mis = interval * 60
                                currentValue = currentHour.getHours()
                            } else if (options.interval.endsWith('m')) {
                                interval = Number(options.interval.replaceAll('m', '')) * 60
                                mis = interval * 5
                                currentValue = currentHour.getHours() + currentHour.getMinutes()
                            } else {
                                interval = Number(options.interval.replaceAll('s', ''))
                                mis = 1
                                currentValue = currentHour.toLocaleTimeString()
                            }
                            let nowDate = new Date(x)

                            if (
                                nowDate >= startDateTime &&
                                nowDate < nextDate &&
                                Math.abs(currentHour - firstTime) % (interval * 1000) < particleSize &&
                                !firstValue.has(currentValue) &&
                                !timeWant.has(Math.floor(Math.abs(currentHour - firstTime) / (interval * 1000)))
                            ) {
                                firstValue.set(currentValue)
                                timeWant.set(
                                    Math.floor(Math.abs(currentHour - firstTime) / (interval * 1000)),
                                    Math.floor(Math.abs(currentHour - firstTime) / (interval * 1000))
                                )
                                return true
                            } else {
                                return false
                            }
                        }
                    } else {
                        filter = (x) => {
                            // console.log(x)
                            let nowDate = new Date(x)
                            // console.log(nowDate >= startDateTime && nowDate < nextDate)
                            return nowDate >= startDateTime && nowDate < nextDate
                        }
                    }
                    grouper = (x) => {
                        try {
                            let nowDate = new Date(x)
                            let result = false
                            result = Math.floor((nowDate - startDateTime) / (1000 * 3600) / options.classOption.gap)
                            // console.log(result)
                            return result
                        } catch (error) {
                            console.log(error)
                            return false
                        }
                    }
                    formatter = (x) => {
                        return getFormatDate(3, x)
                    }
                }
                break
            default:
                return false
        }
        return {
            filter: filter,
            grouper: grouper,
            formatter: formatter,
        }
    } catch (e) {
        throw e
    }
}

// /**
//  *
//  * @param {'byDay'|'byMonth'|'byYear'} purpose 用于指定调用哪种形式的spliter
//  * @param {{dateStart:string|Date,dateEnd:string|Date}} [options]
//  * @returns
//  */
// function configureSpliter(purpose, options) {
//     let spliter = undefined
//     let start = new Date(options.dateStart)
//     let end = new Date(options.dateEnd)
//     switch (purpose) {
//         case 'byDay':
//             {
//                 let map = new Map()
//                 let counter = 0
//                 spliter = (x) => {
//                     let dateX = new Date(x)
//                     if (dateX <= end && dateX >= start) {
//                         let current = map.get(dateX.toLocaleDateString())
//                         if (current || current == 0) {
//                             return current
//                         } else {
//                             map.set(dateX.toLocaleDateString(), counter)
//                             return counter++
//                         }
//                     } else {
//                         return false
//                     }
//                 }
//             }
//             break
//         case 'byMonth':
//             {
//                 let map = new Map()
//                 let counter = 0
//                 spliter = (x) => {
//                     let dateX = new Date(x)
//                     if (dateX <= end && dateX >= start) {
//                         let current = map.get(dateX.getFullYear().toString() + '/' + dateX.getMonth().toString())
//                         if (current || current == 0) {
//                             return current
//                         } else {
//                             map.set(dateX.getFullYear().toString() + '/' + dateX.getMonth().toString(), counter)
//                             return counter++
//                         }
//                     } else {
//                         return false
//                     }
//                 }
//             }
//             break
//         case 'byYear':
//             {
//                 let map = new Map()
//                 let counter = 0
//                 spliter = (x) => {
//                     let dateX = new Date(x)
//                     if (dateX <= end && dateX >= start) {
//                         let current = map.get(dateX.getFullYear())
//                         if (current || current == 0) {
//                             return current
//                         } else {
//                             map.set(dateX.getFullYear(), counter)
//                             return counter++
//                         }
//                     } else {
//                         return false
//                     }
//                 }
//             }
//             break
//         default:
//             break
//     }
//     return spliter
// }
const Datejs = {
    type: 'date',
    configureFilter: configureFilter,
    // configureSpliter: configureSpliter,
}

export { Datejs }
// module.exports = {
//     configureFilter: Datejs.configureFilter,
// }
