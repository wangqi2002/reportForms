import { date } from "./date"
import { equal } from "./equal"

const filters = new Map();
filters.set("date", date)
filters.set("equal", equal)

export {
    filters
}