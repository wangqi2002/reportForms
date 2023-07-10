// let array = [
//     { path: 'date/date', component: 'Date', name: 'Date' },
//     { path: 'equal/equal', component: 'Equal', name: 'Equal' },
// ]
// const filters = new Map()
// array.forEach((x) => {
//     import(`./${x.path}`).then((value) => {
//         eval(`filters.set(x.name.toLowerCase(), value.${x.name})`)
//         console.log(filters)
//     })
// })

import { Date } from './date/date'
import { Equal } from './equal/equal'
const filters = new Map()
filters.set('equal', Equal)
filters.set('date', Date)
export { filters }
