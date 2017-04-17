import QUICK_REPORT from '~/containers/min/quick.json'
import t from '~/vendor/tcomb-form'
import format from 'date-fns/format'
import identity from 'lodash/identity'
import Submission from '~/containers/min/types'
import {QUICK, AVALANCHE, SNOWPACK, WEATHER, INCIDENT} from '~/constants/min'

const ObservationKeys = new Map([
    [QUICK, 'quickReport'],
    [AVALANCHE, 'avalancheReport'],
    [SNOWPACK, 'snowpackReport'],
    [WEATHER, 'weatherReport'],
    [INCIDENT, 'incidentReport'],
])

const ObservationTransformers = new Map([
    [QUICK, quick => {
        quick.ridingConditions = quick.ridingConditions || {}

        function ridingConditionsReducer(conditions, key) {
            const prev = QUICK_REPORT.ridingConditions[key]
            const next = quick.ridingConditions[key]

            if (prev.type === 'single') {
                conditions[key] = {
                    ...prev,
                    selected: next || prev.selected
                }
            } else {
                conditions[key] = {
                    ...prev,
                    options: next || prev.options
                }
            }

            return conditions
        }

        return {
            comment: quick.comment || QUICK_REPORT.comment,
            avalancheConditions: quick.avalancheConditions || QUICK_REPORT.avalancheConditions,
            ridingConditions: Object.keys(QUICK_REPORT.ridingConditions)
                                    .reduce(ridingConditionsReducer, {}),
        }
    }],
    [AVALANCHE, ({avalancheOccurrence, ...avalanche}) => {
        return {
            ...avalanche,
            avalancheOccurrenceEpoch: format(avalancheOccurrence, 'YYYY-MM-DD'),
            avalancheOccurrenceTime: format(avalancheOccurrence, 'hh:mm A'),
        }
    }],
    [SNOWPACK, identity],
    [WEATHER, identity],
    [INCIDENT, incident => {
        const {
            numberFullyBuried = 0,
            numberPartlyBuriedImpairedBreathing = 0,
            numberPartlyBuriedAbleBreathing = 0,
            numberCaughtOnly = 0,
            numberPeopleInjured = 0,
        } = incident.groupDetails || {}
        const numberInvolved = numberFullyBuried + numberPartlyBuriedImpairedBreathing + numberPartlyBuriedAbleBreathing + numberCaughtOnly + numberPeopleInjured

        if (numberInvolved > 0) {
            incident.numberInvolved = numberInvolved
        }

        return incident
    }],
])

function transformProvider(provider) {
    return {
        ...provider,
        isSponsor: provider.is_sponsor,
        locDescription: provider.loc_description,
        primContact: provider.prim_contact,
    }
}

export function transformProviderResponse(data) {
    return {
        ...data,
        results: data.results.map(transformProvider)
    }
}

export function transformCourseResponse(data) {
    return {
        ...data,
        results: data.results.map(course => ({
            ...course,
            dateStart: course.date_start,
            dateEnd: course.date_end,
            locDescription: course.loc_description,
            provider: transformProvider(course.provider),
        }))
    }
}

export function transformSubmissionForPost(value) {
    const result = t.validate(value, Submission)

    if (!result.isValid()) {
        throw new Error('Can not transform submission because it is not valid')
    }

    const {required, uploads} = value
    const observations = JSON.parse(JSON.stringify(value.observations))
    const {longitude, latitude} = required.latlng
    const data = {
        ...required,
        datetime: required.datetime.toISOString(),
        latlng: [String(latitude), String(longitude)],
        obs: Object.keys(observations).reduce((obs, type) => {
            const ob = observations[type]

            if (ob) {
                const transformer = ObservationTransformers.get(type)
                const key = ObservationKeys.get(type)

                obs[key] = transformer.call(null, ob)
            }

            return obs
        }, {})
    }

    // Conversion to form data
    // Could be a util function
    const form = new FormData()

    Object.keys(data).forEach(key => {
        let value = data[key]

        if (typeof value !== 'string') {
            value = JSON.stringify(value)
        }

        form.append(key, value)
    })

    // Files[Iterator] does not exist in Safari :(
    const files = uploads.files || []
    for (let i = 0; i < files.length; i++) {
        form.append(`files${i+1}`, files[i])
    }

    return form
}

function sanitizeMountainInformationNetworkSubmission(submission) {
    return {
        ...submission,
        latlng: submission.latlng.map(Number),
    }
}

export function sanitizeMountainInformationNetworkSubmissions(data) {
    if (Array.isArray(data)) {
        return data.map(sanitizeMountainInformationNetworkSubmission)
    }

    return sanitizeMountainInformationNetworkSubmission(data)
}
