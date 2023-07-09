// let array = ['date/date', 'equal/equal', 'ok/ok']
// const filters = new Map()
// array.forEach(async (x) => {
//     let { name, component } = await import(`./${x}`)
//     // console.log(await import(`./${x}`))
//     filters.set(name, component)
// })

import { Date } from './date/date'
import { Equal } from './equal/equal'
const filters = new Map()
filters.set('equal', Date)
filters.set('date', Equal)

export { filters }
