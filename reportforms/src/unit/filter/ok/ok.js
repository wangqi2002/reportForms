const map = new Map()

/**
 * @param {string} param
 * @returns
 */
function configureFilter(param) {
    console.log(param)
    if (param.start) {
        let start = Number(param.start)
        let end = Number(param.end)
        let filter = (x) => {
            return Number(x) <= end && Number(x) >= start
        }
        return filter
    } else {
        let filter = (x) => {
            return eval(`/^${param}$/`).test(String(x))
        }
        console.log(param)
        return filter
    }
}

/**
 * @param {any[]} params
 * @example let filter=configureSpliter([1,2,3,4])
 */
function configureSpliter(params) {
    params.forEach((value, index) => {
        map.set(value, index)
    })
    /**
     * 用于分离不同数据,返回数字,例如0就是第一组,1就是第二组
     * @param {any} x 接收任意参数
     * @returns {number} 得到序号
     */
    let spliter = (x) => {
        console.log(map)
        return map.get(x)
    }
    return spliter
}

const component = {
    type: 'ok',
    configureFilter: configureFilter,
    configureSpliter: configureSpliter,
}
let name = 'ok'
export { name, component }
