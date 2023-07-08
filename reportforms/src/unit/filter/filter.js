let array = ['date/date', 'equal/equal', 'ok/ok']
const filters = new Map()
array.forEach(async (x) => {
    let { name, component } = await import(`./${x}`)
    // console.log(await import(`./${x}`))
    filters.set(name, component)
})

// import { component } from './date/date'
// filters.set('date', component)
// import { component } from './equal/equal'
// filters.set('equal', component)
export { filters }
