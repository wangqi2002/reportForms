let patternTemplate = {
    today: '^${params[0]}[/.: -]0?${params[1]}[/.: -]0?${params[2]}',
    thisMonth: '^${params[0]}[/.: -]0?${params[1]}',
    thisYear: '^${params[0]}',
} //注意正则表达式中-需要放到边界,否则会被误会为范围

let currentDate = new Date(options.date ? options.date : null)
let year = currentDate.getFullYear()
let month = currentDate.getMonth() + 1
let day = currentDate.getDate()
let pattern = new RegExp(generatePattern(patternTemplate.today, [year, month, day]))

/**
 * @param {string} raw
 * @param {any[]} params
 * @returns
 */
function generatePattern(raw, params) {
    return eval('`' + raw + '`')
}

/**
 * @param {string} purpose 用于确定转换到哪个类型
 * - `today` 今天
 * - `thisWeek` 本周
 * - `thisMonth` 本月
 * - `thisYear` 今年
 * - `range` 日期范围
 * @param {{start:Date|string,end:Date|string}} [range]
 * @returns
 */
function changeCurrentPattern(purpose, range, options) {
    switch (purpose) {
        case 'today':
            pattern = new RegExp(generatePattern(patternTemplate.today, [year, month, day]))
            break
        case 'thisWeek':
            {
                //并非使用正则表达式,而是替换了pattern.test方法
                const oneDayTime = 1000 * 60 * 60 * 24
                const week = parseInt(
                    (parseInt(new Date(options.date ? options.date : null).getTime() / oneDayTime) + 4) / 7
                )
                pattern.test = (x) => {
                    let xDate = parseInt(new Date(x).getTime() / oneDayTime)
                    return parseInt((xDate + 4) / 7) == week
                }
            }
            break
        case 'thisMonth':
            pattern = new RegExp(generatePattern(patternTemplate.thisMonth, [year, month]))
            break
        case 'thisYear':
            pattern = new RegExp(generatePattern(patternTemplate.thisYear, [year]))
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
    return true
}

function filter(value) {
    return pattern.test(value)
}

// changeCurrentPattern()

// // console.log(pattern)
// // changeCurrentPattern('range', { start: new Date('2022/5/1'), end: new Date('2023-4-20') })
// // console.log(pattern)
// // console.log(filter('2023 05 27'))
// // console.log(getRangeString('2017', '2022'))
// changeCurrentPattern('thisWeek')
// console.log(filter('2023 5 22'))
