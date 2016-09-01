import {normalize, arrayOf} from 'normalizr'
import * as Schemas from 'api/schemas'
import {createApiAction} from 'api/utils'

export const FORECAST_REQUEST = 'FORECAST_REQUEST'
export const FORECAST_SUCCESS = 'FORECAST_SUCCESS'
export const FORECAST_FAILURE = 'FORECAST_FAILURE'

export const FORECAST_REGIONS_REQUEST = 'FORECAST_REGIONS_REQUEST'
export const FORECAST_REGIONS_SUCCESS = 'FORECAST_REGIONS_SUCCESS'
export const FORECAST_REGIONS_FAILURE = 'FORECAST_REGIONS_FAILURE'

export const HOT_ZONE_AREAS_REQUEST = 'HOT_ZONE_AREAS_REQUEST'
export const HOT_ZONE_AREAS_SUCCESS = 'HOT_ZONE_AREAS_SUCCESS'
export const HOT_ZONE_AREAS_FAILURE = 'HOT_ZONE_AREAS_FAILURE'

export const HOT_ZONE_REPORT_REQUEST = 'HOT_ZONE_REPORT_REQUEST'
export const HOT_ZONE_REPORT_SUCCESS = 'HOT_ZONE_REPORT_SUCCESS'
export const HOT_ZONE_REPORT_FAILURE = 'HOT_ZONE_REPORT_FAILURE'

export const MOUNTAIN_INFORMATION_NETWORK_OBSERVATIONS_REQUEST = 'MOUNTAIN_INFORMATION_NETWORK_OBSERVATIONS_REQUEST'
export const MOUNTAIN_INFORMATION_NETWORK_OBSERVATIONS_SUCCESS = 'MOUNTAIN_INFORMATION_NETWORK_OBSERVATIONS_SUCCESS'
export const MOUNTAIN_INFORMATION_NETWORK_OBSERVATIONS_FAILURE = 'MOUNTAIN_INFORMATION_NETWORK_OBSERVATIONS_FAILURE'

export const INCIDENTS_REQUEST = 'INCIDENTS_REQUEST'
export const INCIDENTS_SUCCESS = 'INCIDENTS_SUCCESS'
export const INCIDENTS_FAILURE = 'INCIDENTS_FAILURE'

export const PROVIDERS_REQUEST = 'PROVIDERS_REQUEST'
export const PROVIDERS_SUCCESS = 'PROVIDERS_SUCCESS'
export const PROVIDERS_FAILURE = 'PROVIDERS_FAILURE'

export const COURSES_REQUEST = 'COURSES_REQUEST'
export const COURSES_SUCCESS = 'COURSES_SUCCESS'
export const COURSES_FAILURE = 'COURSES_FAILURE'

export const loadForecastRegions = createApiAction(
    Schemas.ForecastRegion,
    FORECAST_REGIONS_REQUEST,
    FORECAST_REGIONS_SUCCESS,
    FORECAST_REGIONS_FAILURE,
)

export const loadForecast = createApiAction(
    Schemas.Forecast,
    FORECAST_REQUEST,
    FORECAST_SUCCESS,
    FORECAST_FAILURE,
)

export const loadHotZoneAreas = createApiAction(
    Schemas.HotZoneArea,
    HOT_ZONE_AREAS_REQUEST,
    HOT_ZONE_AREAS_SUCCESS,
    HOT_ZONE_AREAS_FAILURE,
)

export const loadHotZoneReport = createApiAction(
    Schemas.HotZoneReport,
    HOT_ZONE_REPORT_REQUEST,
    HOT_ZONE_REPORT_SUCCESS,
    HOT_ZONE_REPORT_FAILURE,
)

const loadMountainInformationNetworkObservations = createApiAction(
    Schemas.MountainInformationNetworkObservation,
    MOUNTAIN_INFORMATION_NETWORK_OBSERVATIONS_REQUEST,
    MOUNTAIN_INFORMATION_NETWORK_OBSERVATIONS_SUCCESS,
    MOUNTAIN_INFORMATION_NETWORK_OBSERVATIONS_FAILURE,
)

export function loadMountainInformationNetworkObservationsForDays(days = 7) {
    return loadMountainInformationNetworkObservations({days})
}

export const loadIncidents = createApiAction(
    Schemas.Incident,
    INCIDENTS_REQUEST,
    INCIDENTS_SUCCESS,
    INCIDENTS_FAILURE,
)

export const loadProviders = createApiAction(
    Schemas.Provider,
    PROVIDERS_REQUEST,
    PROVIDERS_SUCCESS,
    PROVIDERS_FAILURE,
)

export const loadCourses = createApiAction(
    Schemas.Course,
    COURSES_REQUEST,
    COURSES_SUCCESS,
    COURSES_FAILURE,
)
