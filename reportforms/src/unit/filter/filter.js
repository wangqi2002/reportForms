import { date } from "./date/date"
import { equal } from "./equal/equal"

const filters = new Map();
filters.set("date", date)
filters.set("equal", equal)

export {
    filters
}