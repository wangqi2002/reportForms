/**
 * @param {string} param
 * @returns
 */
function configureFilter(param) {
    let pattern = `^${param}$`
    let filter = (x) => {
        return pattern.test(x)
    }
    return filter
}

/**
 * @param {any[]} params
 * @example let filter=configureStriper([1,2,3,4])
 */
function configureStriper(params) {
    let map = new Map()
    params.forEach((index, value) => {
        map.set(value, index)
    })
    /**
     * 用于分离不同数据,返回数字,例如0就是第一组,1就是第二组
     * @param {any} x 接收任意参数
     * @returns {number} 得到序号
     */
    let striper = (x) => {
        return map.get(x)
    }
    return striper
}

const equal = {
    type: 'equal',
    configureFilter: configureFilter,
    configureStriper: configureStriper,
}
export {
    equal
}
