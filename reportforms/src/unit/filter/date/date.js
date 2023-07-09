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
 * @param {'today'|'thisWeek'|'thisMonth'|'thisYear'|'range'} purpose 用于确定转换到哪个类型
 * - `today` 今天
 * - `thisWeek` 本周
 * - `thisMonth` 本月
 * - `thisYear` 今年
 * - `range` 日期范围
 * @param {{
 * date?:Date|string,
 * range?:{start:Date|string,end:Date|string},
 * interval?:string,
 * theTopOfTheHour?:boolean
 * }} [options]
 * - `date?:Date|string`
 * - `range?:{start:Date|string,end:Date|string}`用于指定日期范围,仅用于'range'情况
 * @example
 * let filter = configureFilter('today')
 * filter('2023/5/28')
 * @returns
 */
function configureFilter(purpose, options) {
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
                    filter = (x) => {
                        let currentHour = new Date(x)
                        let interval = undefined
                        let mis = undefined
                        let currentValue = undefined
                        if (!firstTime) {
                            firstTime = options.theTopOfTheHour
                                ? new Date(currentHour.toLocaleDateString() + ' 00:00')
                                : currentHour
                        }
                        if (options.interval.endsWith('h')) {
                            interval = Number(options.interval.replaceAll('h', '')) * 3600
                            mis = 3600
                            currentValue = currentHour.getHours()
                        } else if (options.interval.endsWith('m')) {
                            interval = Number(options.interval.replaceAll('m', '')) * 60
                            mis = 60
                            currentValue = currentHour.getHours() + currentHour.getMinutes()
                        } else {
                            interval = Number(options.interval.replaceAll('s', ''))
                            mis = 1
                            currentValue = currentHour.toLocaleTimeString()
                        }
                        if (
                            pattern.test(x) &&
                            (Math.abs(currentHour - firstTime) / 1000) % interval <= mis &&
                            !firstValue.has(currentValue)
                        ) {
                            firstValue.set(currentValue)
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
                    generatePattern(patternTemplate.thisMonth, [currentDate.getFullYear(), currentDate.getMonth() + 1])
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
        default:
            return false
    }
    return {
        filter: filter,
        grouper: grouper,
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
const Date = {
    type: 'date',
    configureFilter: configureFilter,
    configureSpliter: configureSpliter,
}

// let { filter, grouper } = configureFilter('thisYear', { replace: 'avg' })
// console.log(filter('2023/7/8 13:00:00'))
// console.log(grouper('2023/12/12 13:00:00'))
// console.log(filter('2023/7/8 14:00:52'))
// console.log(filter('2023/7/8 14:12:42'))
// console.log(filter('2023/7/8 15:12:42'))
// console.log(new Date('2023/7/23 15:12:42').getDate())
export { Date }
