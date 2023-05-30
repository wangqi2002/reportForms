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
 * @param {{start:Date|string,end:Date|string}} [range]
 * @example
 * let filter = configureFilter('today')
 * filter('2023/5/28')
 * @returns
 */
function configureFilter(purpose, range, date) {
    let currentDate = date ? new Date(date) : new Date()
    let pattern = undefined
    switch (purpose) {
        case 'today':
            pattern = new RegExp(
                generatePattern(patternTemplate.today, [
                    currentDate.getFullYear(),
                    currentDate.getMonth() + 1,
                    currentDate.getDate(),
                ])
            )
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
            }
            break
        case 'thisMonth':
            pattern = new RegExp(
                generatePattern(patternTemplate.thisMonth, [currentDate.getFullYear(), currentDate.getMonth() + 1])
            )
            break
        case 'thisYear':
            pattern = new RegExp(generatePattern(patternTemplate.thisYear, [currentDate.getFullYear()]))
            break
        case 'range': {
            if (range) {
                const d1 = new Date(range.start)
                const d2 = new Date(range.end)
                //重写pattern.test方法,不再使用正则表达式
                pattern.test = (x) => {
                    let date = new Date(x)
                    if (date < d2 && date > d1) {
                        return true
                    } else {
                        return false
                    }
                }
            }
        }
        default:
            return false
    }
    let filter = (x) => pattern.test(x)
    return filter
}

/**
 *
 * @param {'byDay'|'byMonth'|'byYear'} purpose 用于指定调用哪种形式的striper
 * @param {string|Date} dateStart
 * @param {string|Date} dateEnd
 * @returns
 */
function configureStriper(purpose, dateStart, dateEnd) {
    let striper = undefined
    let start = new Date(dateStart)
    let end = new Date(dateEnd)

    switch (purpose) {
        case 'byDay':
            {
                let map = new Map()
                let counter = 0
                striper = (x) => {
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
                striper = (x) => {
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
                striper = (x) => {
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
    return striper
}

// let striper = configureStriper('byYear', '2022/4/1', '2023/5/26')
// let a = ['2023/4/1', '2023/5/26', '2023/4/2', '2023/5/2', '2021/4/8', '2023/4/1', '2023/4/2', '2022/4/2']
// a.forEach((x) => {
//     console.log(striper(x))
// })
