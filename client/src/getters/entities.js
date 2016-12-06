import Immutable from 'immutable'

const EMPTY_MAP = new Immutable.Map()

function getEntities(state) {
    return state.api.entities
}

export function getEntitiesForSchema(state, schema) {
    const key = schema.getKey()

    return getEntities(state).get(key, EMPTY_MAP)
}

export function getEntityForSchema(state, schema, id) {
    return getEntitiesForSchema(state, schema).get(id)
}
