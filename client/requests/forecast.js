import parseDate from 'date-fns/parse'
import addDays from 'date-fns/add_days'
import isBefore from 'date-fns/is_before'
import isValid from 'date-fns/is_valid'
import startOfToday from 'date-fns/start_of_today'
import { baseURL } from './config.json'
import fetch from 'utils/fetch'
import * as Ratings from 'constants/forecast/rating'
import * as Modes from 'constants/forecast/mode'

export function forecast(name, date) {
    const url = buildForecastURL(name, date)

    return fetch(url).then(parse)
}

export function forecasts() {
    const url = buildForecastURL('all')

    return fetch(url)
}

export function regions() {
    const url = baseURL + '/forecasts'

    return fetch(url).then(payload => ({
        ...payload,
        features: payload.features.filter(
            region => region.properties.type !== 'hotzone'
        ),
    }))
}

// Utils
function buildForecastURL(name, date) {
    let path = 'forecasts'

    if (isArchiveBulletinRequest(date)) {
        const data = parseDate(date)

        path = `bulletin-archive/${data.toISOString()}`
    }

    return baseURL + `/${path}/${name}.json`
}
function isArchiveBulletinRequest(date) {
    if (!date) {
        return false
    }

    date = parseDate(date, 'YYYY-MM-DD')

    if (isValid(date)) {
        return isBefore(date, startOfToday())
    }

    return false
}

// Parser
function parse(forecast) {
    if (!forecast || !forecast.region) {
        return forecast
    }

    const dateIssued = parseDate(forecast.dateIssued)
    const validUntil = parseDate(forecast.validUntil)
    // const untilFurhterNotice = validUntil < dateIssued
    const {
        dangerRatings = [],
        dangerMode,
        confidence,
        avalancheSummary,
        snowpackSummary,
        weatherForecast,
    } = forecast

    // TODO(wnh): Clean this up and merge it into either the server side or the
    // transformDangerRating function
    function fixDangerRatingDates(dangerRating, index) {
        return Object.assign({}, dangerRating, {
            date: addDays(dateIssued, index + 1),
        })
    }

    return {
        ...forecast,
        confidence: asConfidenceObject(confidence),
        dangerMode: TO_MODES.get(dangerMode),
        dateIssued,
        validUntil,
        // TODO: Should come from the server. Impossible to compute locally
        isArchived:
            isBefore(dateIssued, new Date()) &&
            isBefore(validUntil, new Date()),
        dangerRatings: dangerRatings
            .map(transformDangerRating)
            .map(fixDangerRatingDates),
        avalancheSummary: trim(avalancheSummary),
        snowpackSummary: trim(snowpackSummary),
        weatherForecast: trim(weatherForecast),
    }
}

// Utils transformers
function asConfidenceObject(confidence) {
    const [level, comment] =
        typeof confidence === 'string' ? confidence.split(' - ') : []

    return {
        level,
        comment,
    }
}
function transformDangerRating({ date, dangerRating }) {
    const { alp, tln, btl } = dangerRating

    return {
        date: parseDate(date),
        dangerRating: {
            alp: TO_RATINGS.get(alp),
            tln: TO_RATINGS.get(tln),
            btl: TO_RATINGS.get(btl),
        },
    }
}

// Utils
function trim(text) {
    return typeof text === 'string' ? text.trim() : text
}

// Constants
// TODO: Use constants server response to reduce client side transformation.
const TO_RATINGS = new Map([
    ['1:Low', Ratings.LOW],
    ['2:Moderate', Ratings.MODERATE],
    ['3:Considerable', Ratings.CONSIDERABLE],
    ['4:High', Ratings.HIGH],
    ['5:Extreme', Ratings.EXTREME],
    ["N/A:'Spring'", Ratings.NO_RATING],
    ['N/A:No Rating', Ratings.NO_RATING],
])
const TO_MODES = new Map([
    ['Off season', Modes.OFF],
    ['Summer situation', Modes.SUMMER],
    ['Spring situation', Modes.SPRING],
    ['Early season', Modes.EARLY_SEASON],
])