let patternTemplate = {
    today: '^${params[0]}[/.: -]0?${params[1]}[/.: -]0?${params[2]}',
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
/**
 * @param {'today'|'thisWeek'|'thisMonth'|'thisYear'|'range'|'byClass'} purpose 用于确定转换到哪个类型
 * - `today` 今天
 * - `thisWeek` 本周
 * - `thisMonth` 本月
 * - `thisYear` 今年
 * - `range` 日期范围
 * @param {{
 * date?:Date|string,
 * range?:{start:Date|string,end:Date|string},
 * interval?:string,
 * theTopOfTheHour?:boolean,
 * classRange?:[{start:Date|string,end:Date|string}]
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
        let currentDate = options.date ? new Date(options.date) : new Date()
        let pattern = {}
        switch (purpose) {
            case 'today':
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
                                firstTime = options.theTopOfTheHour
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
                }
                break
            case 'thisWeek':
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
            case 'thisMonth':
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
                }
                break
            case 'thisYear':
                {
                    pattern = new RegExp(generatePattern(patternTemplate.thisYear, [currentDate.getFullYear()]))
                    filter = (x) => {
                        return pattern.test(x)
                    }
                    grouper = (x) => {
                        return new Date(x).getMonth()
                    }
                }
                break
            case 'range':
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
                    }
                }
                break
            case 'byClass':
                {
                    let currentDay = currentDate.toLocaleDateString()
                    let classRanges = options.classRange
                    let crossSig = false
                    for (let index = 0; index < classRanges.length; index++) {
                        let x = classRanges[index]
                        let d1 = new Date(currentDay + '-' + x.start)
                        let d2 = new Date(currentDay + '-' + x.end)
                        if (crossSig) {
                            d1 = new Date(d1.setDate(d1.getDate() + 1))
                            d2 = new Date(d2.setDate(d2.getDate() + 1))
                        } else if (d2 < d1) {
                            d2 = new Date(d2.setDate(d2.getDate() + 1))
                            crossSig = true
                        }
                        classRanges[index] = {
                            start: d1,
                            end: d2,
                        }
                    }
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
                        let nowDate = new Date(x)
                        let result = false
                        classRanges.forEach((value, index) => {
                            if (nowDate < value.end && nowDate >= value.start) {
                                result = index
                                return undefined
                            }
                        })
                        return result
                    }
                }
                break
            default:
                return false
        }
        return {
            filter: filter,
            grouper: grouper,
        }
    } catch (e) {
        throw e
    }
}

/**
 *
 * @param {'byDay'|'byMonth'|'byYear'} purpose 用于指定调用哪种形式的spliter
 * @param {{dateStart:string|Date,dateEnd:string|Date}} [options]
 * @returns
 */
function configureSpliter(purpose, options) {
    let spliter = undefined
    let start = new Date(options.dateStart)
    let end = new Date(options.dateEnd)
    switch (purpose) {
        case 'byDay':
            {
                let map = new Map()
                let counter = 0
                spliter = (x) => {
                    let dateX = new Date(x)
                    if (dateX <= end && dateX >= start) {
                        let current = map.get(dateX.toLocaleDateString())
                        if (current || current == 0) {
                            return current
                        } else {
                            map.set(dateX.toLocaleDateString(), counter)
                            return counter++
                        }
                    } else {
                        return false
                    }
                }
            }
            break
        case 'byMonth':
            {
                let map = new Map()
                let counter = 0
                spliter = (x) => {
                    let dateX = new Date(x)
                    if (dateX <= end && dateX >= start) {
                        let current = map.get(dateX.getFullYear().toString() + '/' + dateX.getMonth().toString())
                        if (current || current == 0) {
                            return current
                        } else {
                            map.set(dateX.getFullYear().toString() + '/' + dateX.getMonth().toString(), counter)
                            return counter++
                        }
                    } else {
                        return false
                    }
                }
            }
            break
        case 'byYear':
            {
                let map = new Map()
                let counter = 0
                spliter = (x) => {
                    let dateX = new Date(x)
                    if (dateX <= end && dateX >= start) {
                        let current = map.get(dateX.getFullYear())
                        if (current || current == 0) {
                            return current
                        } else {
                            map.set(dateX.getFullYear(), counter)
                            return counter++
                        }
                    } else {
                        return false
                    }
                }
            }
            break
        default:
            break
    }
    return spliter
}
const Datejs = {
    type: 'date',
    configureFilter: configureFilter,
    configureSpliter: configureSpliter,
}

export { Datejs }
// module.exports = {
//     configureFilter: Datejs.configureFilter,
// }

// let { filter, grouper } = configureFilter('byClass', {
//     date: '2023/8/23',
//     classRange: [
//         { start: '8:00', end: '16:00' },
//         { start: '16:00', end: '00:00' },
//         { start: '00:00', end: '8:00' },
//     ],
// })
// let a = grouper('2023/8/24 3:00')
// console.log(a)
