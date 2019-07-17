import React from 'react'
import { storiesOf } from '@storybook/react'
import Quick from './Quick'
import Avalanche from './Avalanche'
import Snowpack from './Snowpack'
import Weather from './Weather'
import Incident from './Incident'
import { Submission } from './'
import { QUICK, WEATHER, SNOWPACK, AVALANCHE, INCIDENT } from 'constants/min'

const data = [
    {
        subid: '9c3458b6-c3d2-43ca-ae40-4350ee0fb363',
        obid: '6bc8aeb2-3b73-4e7c-a983-318fcea3e237',
        title: 'Test Only for design purposes',
        datetime: '2016-07-10T14:43:00-07:00',
        user: 'kklassen',
        obtype: 'weather',
        latlng: ['50.95540', '-118.14938'],
        uploads: ['2016/07/10/d48efff5-a746-465d-8dfc-68cc723379bf.jpeg'],
        ob: {
            snowfallRate: 1,
            newSnow24Hours: 1,
            windDirection: 'S',
            stormStartDate: '2016-07-10',
            minTemp: 11,
            precipitationType: 'Mixed snow & rain',
            temperature: 20,
            weatherObsComment: 'Test only for design purposes',
            maxTemp: 24,
            windSpeed: 'Light (1-25 km/h)',
            rainfallRate: 'Drizzle',
            precipitation24Hours: 2,
            skyCondition: 'Scattered clouds (2/8-4/8)',
            stormSnowAmount: 1,
            temperatureTrend: 'Rising',
            blowingSnow: 'None',
            tempLatlng: '50.95540,-118.14938',
        },
        focusUrl:
            'http://www.avalanche.ca/focus/6bc8aeb2-3b73-4e7c-a983-318fcea3e237',
        shareUrl:
            'http://www.avalanche.ca/share/test-only-for-design-purposes/6bc8aeb2-3b73-4e7c-a983-318fcea3e237',
        thumbs: [
            'http://www.avalanche.ca/api/min/uploads/2016/07/10/d48efff5-a746-465d-8dfc-68cc723379bf.jpeg',
        ],
        dateFormatted: 'Jul 10th, 2016 at 14:43 MST',
    },
    {
        subid: '9c3458b6-c3d2-43ca-ae40-4350ee0fb363',
        obid: '377cb449-8b4a-4d8f-9936-22d4431cc903',
        title: 'Test Only for design purposes',
        datetime: '2016-07-10T14:43:00-07:00',
        user: 'kklassen',
        obtype: 'snowpack',
        latlng: ['50.95540', '-118.14938'],
        uploads: ['2016/07/10/d48efff5-a746-465d-8dfc-68cc723379bf.jpeg'],
        ob: {
            snowpackWhumpfingObserved: 'No',
            snowpackTestInitiation: 'Hard',
            snowpackFootPenetration: 5,
            snowpackSiteAspect: {
                E: false,
                W: false,
                SE: false,
                SW: false,
                S: false,
                NW: false,
                N: true,
                NE: false,
            },
            snowpackSledPenetration: 10,
            snowpackSiteElevationBand: {
                Treeline: false,
                'Below treeline': false,
                Alpine: true,
            },
            snowpackObsType: 'Summary',
            snowpackSiteElevation: 2500,
            snowpackTestFracture: 'Sudden ("pop" or "drop")',
            snowpackTestFailure: 100,
            snowpackSurfaceCondition: {
                'New snow': false,
                Variable: false,
                Corn: true,
                'Surface hoar': false,
                Facets: false,
                Crust: false,
            },
            snowpackTestFailureLayerCrystalType: {
                'Depth hoar': false,
                Other: true,
                'Surface hoar': false,
                'Storm snow': false,
                Facets: false,
                Crust: false,
            },
            snowpackCrackingObserved: 'No',
            snowpackSkiPenetration: 8,
            snowpackDepth: 100,
            tempLatlng: '50.95540,-118.14938',
            snowpackObsComment: 'Test only for design purposes',
        },
        focusUrl:
            'http://www.avalanche.ca/focus/377cb449-8b4a-4d8f-9936-22d4431cc903',
        shareUrl:
            'http://www.avalanche.ca/share/test-only-for-design-purposes/377cb449-8b4a-4d8f-9936-22d4431cc903',
        thumbs: [
            'http://www.avalanche.ca/api/min/uploads/2016/07/10/d48efff5-a746-465d-8dfc-68cc723379bf.jpeg',
        ],
        dateFormatted: 'Jul 10th, 2016 at 14:43 MST',
    },
    {
        subid: '9c3458b6-c3d2-43ca-ae40-4350ee0fb363',
        obid: '1405e3a3-8792-4ac2-9c2c-5f23668af71b',
        title: 'Test Only for design purposes',
        datetime: '2016-07-10T14:43:00-07:00',
        user: 'kklassen',
        obtype: 'avalanche',
        latlng: ['50.95540', '-118.14938'],
        uploads: ['2016/07/10/d48efff5-a746-465d-8dfc-68cc723379bf.jpeg'],
        ob: {
            windExposure: 'No wind exposure',
            runoutZoneElevation: 1500,
            weakLayerCrystalType: {
                'Surface hoar and facets': false,
                'Depth hoar': false,
                'Surface hoar': false,
                'Storm snow': true,
                Facets: false,
            },
            avalancheSize: '1',
            avalancheCharacter: {
                'Cornice with slab': false,
                'Persistent slab': false,
                'Wet slab': true,
                'Storm slab': false,
                'Deep persistent slab': false,
                'Loose dry': false,
                'Cornice only': false,
                'Wind slab': false,
                'Loose wet': false,
            },
            avalancheObsComment: 'Test only for design purposes',
            slabWidth: 100,
            crustNearWeakLayer: 'No',
            runLength: 93,
            avalancheNumber: '1',
            avalancheOccurrenceTime: '2:45 PM',
            startZoneAspect: {
                E: false,
                W: false,
                SE: false,
                SW: false,
                S: false,
                NW: false,
                N: true,
                NE: false,
            },
            avalancheObservation: '>48 hrs ago',
            weakLayerBurialDate: '2016-07-10',
            startZoneElevationBand: {
                Treeline: false,
                'Below treeline': false,
                Alpine: true,
            },
            startZoneElevation: 2500,
            slabThickness: 100,
            startZoneIncline: 35,
            triggerSubtype: 'Remote',
            triggerDistance: 100,
            tempLatlng: '50.95540,-118.14938',
            triggerType: 'Helicopter',
            avalancheOccurrenceEpoch: '2016-07-10',
            vegetationCover: 'Open slope',
        },
        focusUrl:
            'http://www.avalanche.ca/focus/1405e3a3-8792-4ac2-9c2c-5f23668af71b',
        shareUrl:
            'http://www.avalanche.ca/share/test-only-for-design-purposes/1405e3a3-8792-4ac2-9c2c-5f23668af71b',
        thumbs: [
            'http://www.avalanche.ca/api/min/uploads/2016/07/10/d48efff5-a746-465d-8dfc-68cc723379bf.jpeg',
        ],
        dateFormatted: 'Jul 10th, 2016 at 14:43 MST',
    },
    {
        subid: '9c3458b6-c3d2-43ca-ae40-4350ee0fb363',
        obid: 'e775d955-e7aa-4b90-9522-8175c111660b',
        title: 'Test Only for design purposes',
        datetime: '2016-07-10T14:43:00-07:00',
        user: 'kklassen',
        obtype: 'quick',
        latlng: ['50.95540', '-118.14938'],
        uploads: ['2016/07/10/d48efff5-a746-465d-8dfc-68cc723379bf.jpeg'],
        ob: {
            avalancheConditions: {
                sound: false,
                snow: false,
                slab: true,
                temp: true,
            },
            ridingConditions: {
                snowConditions: {
                    prompt: 'Snow conditions were:',
                    type: 'multiple',
                    options: {
                        Wet: false,
                        Powder: false,
                        'Wind affected': false,
                        Hard: true,
                        Crusty: false,
                        Heavy: false,
                        'Deep powder': false,
                    },
                },
                ridingQuality: {
                    selected: 'Amazing',
                    prompt: 'Riding quality was:',
                    type: 'single',
                    options: ['Amazing', 'Good', 'OK', 'Terrible'],
                },
                stayedAway: {
                    prompt: 'We stayed away from:',
                    type: 'multiple',
                    options: {
                        'Alpine slopes': false,
                        'Cut-blocks': true,
                        'Sunny slopes': false,
                        'Convex slopes': true,
                        'Open trees': false,
                        'Steep slopes': false,
                    },
                },
                rideType: {
                    prompt: 'We rode:',
                    type: 'multiple',
                    options: {
                        'Alpine slopes': false,
                        'Dense trees': false,
                        'Cut-blocks': false,
                        'Sunny slopes': true,
                        'Convex slopes': false,
                        'Open trees': false,
                        'Mellow slopes': false,
                        'Steep slopes': true,
                    },
                },
                weather: {
                    prompt: 'The day was:',
                    type: 'multiple',
                    options: {
                        Wet: false,
                        Stormy: false,
                        Cold: false,
                        Cloudy: false,
                        Sunny: true,
                        Foggy: false,
                        Warm: false,
                        Windy: false,
                    },
                },
            },
            tempLatlng: '50.95540,-118.14938',
            comment: 'Great day to ride the Mountain Coaster at RMR',
        },
        focusUrl:
            'http://www.avalanche.ca/focus/e775d955-e7aa-4b90-9522-8175c111660b',
        shareUrl:
            'http://www.avalanche.ca/share/test-only-for-design-purposes/e775d955-e7aa-4b90-9522-8175c111660b',
        thumbs: [
            'http://www.avalanche.ca/api/min/uploads/2016/07/10/d48efff5-a746-465d-8dfc-68cc723379bf.jpeg',
        ],
        dateFormatted: 'Jul 10th, 2016 at 14:43 MST',
    },
    {
        subid: '9c3458b6-c3d2-43ca-ae40-4350ee0fb363',
        obid: '2e9622bc-57b1-4269-87f3-28f58dbc94d6',
        title: 'Test Only for design purposes',
        datetime: '2016-07-10T14:43:00-07:00',
        user: 'kklassen',
        obtype: 'incident',
        latlng: ['50.95540', '-118.14938'],
        uploads: ['2016/07/10/d48efff5-a746-465d-8dfc-68cc723379bf.jpeg'],
        ob: {
            otherActivityDescription: null,
            groupActivity: {
                Tobogganing: false,
                'Climbing/Mountaineering': false,
                Other: false,
                'Hiking/Scrambling': true,
                Snowshoeing: false,
                Skiing: false,
                Snowmobiling: false,
            },
            numberPartlyBuriedImpairedBreathing: null,
            terrainShapeTriggerPoint: 'Convex',
            incidentDescription: 'Test only for design purposes',
            terrainTrap: {
                Trees: false,
                'Slope transition or bench': true,
                'No obvious terrain trap': false,
                'Gully or depression': false,
                Cliff: false,
            },
            numberPeopleInjured: null,
            numberPartlyBuriedAbleBreathing: 1,
            snowDepthTriggerPoint: 'Shallow',
            numberInvolved: 1,
            numberCaughtOnly: null,
            groupSize: 1,
            numberFullyBuried: 0,
            tempLatlng: '50.95540,-118.14938',
        },
        focusUrl:
            'http://www.avalanche.ca/focus/2e9622bc-57b1-4269-87f3-28f58dbc94d6',
        shareUrl:
            'http://www.avalanche.ca/share/test-only-for-design-purposes/2e9622bc-57b1-4269-87f3-28f58dbc94d6',
        thumbs: [
            'http://www.avalanche.ca/api/min/uploads/2016/07/10/d48efff5-a746-465d-8dfc-68cc723379bf.jpeg',
        ],
        dateFormatted: 'Jul 10th, 2016 at 14:43 MST',
    },
]

function getObservation(type) {
    return data.find(ob => ob.obtype === type).ob
}

storiesOf('Mountain Information Network', module)
    .add('Quick', () => <Quick {...getObservation(QUICK)} />)
    .add('Avalanche', () => <Avalanche {...getObservation(AVALANCHE)} />)
    .add('Snowpack', () => <Snowpack {...getObservation(SNOWPACK)} />)
    .add('Weather', () => <Weather {...getObservation(WEATHER)} />)
    .add('Incident', () => <Incident {...getObservation(INCIDENT)} />)
    .add('Submission', () => <Submission observations={data} tabbed />)
    .add('Submission w/ disabled headers', () => (
        <Submission observations={data.slice(1, 3)} tabbed />
    ))
