import React, { Component, PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import isSameDay from 'date-fns/is_same_day'
import ForecastContainer from 'containers/Forecast'
import { Status } from 'components/misc'
import { Muted } from 'components/text'
import { Day, DateElement } from 'components/time'
import { Chart } from 'components/graphics/avaluator'
import { LEVELS } from 'constants/forecast/rating'
import { Control, ControlSet } from 'components/form'
import { Dropdown } from 'components/controls/Dropdown'
import { Option } from 'components/controls/options'
import { Home } from 'components/links'
import Drawer, {
    Header,
    Container,
    Navbar,
    Body,
    DisplayOnMap,
    Close,
    LEFT,
} from 'components/page/drawer'
import TerrainRatings from './panels/TerrainRatings'
import ChartExplained from './panels/ChartExplained'
import Welcome, { Help } from './panels/Welcome'
import ELEVATIONS, {
    ALP,
    Texts as ElevationTexts,
} from 'constants/forecast/elevation'
import {
    SIMPLE,
    CHALLENGING,
    COMPLEX,
    Texts as TerrainRatingTexts,
} from 'constants/forecast/ates'

export default class TripPlanning extends Component {
    static propTypes = {
        region: PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        }),
        area: PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            rating: PropTypes.oneOf([SIMPLE, CHALLENGING, COMPLEX]).isRequired,
        }),
        elevation: PropTypes.oneOf(Array.from(ELEVATIONS)),
        onElevationChange: PropTypes.func.isRequired,
        date: PropTypes.instanceOf(Date),
        onDateChange: PropTypes.func.isRequired,
        open: PropTypes.bool,
        onCloseClick: PropTypes.func.isRequired,
        onLocateClick: PropTypes.func.isRequired,
    }
    static defaultProps = {
        elevation: ALP,
    }
    renderContent(forecast) {
        const { region, onLocateClick, ...props } = this.props

        return <Content {...props} forecast={forecast} />
    }
    renderChildren({ status, forecast }) {
        const hasDangerRatings = forecast && forecast.has('dangerRatings')

        const messages = {
            ...status.messages,
            isLoaded: hasDangerRatings ? undefined : this.isLoadedMessage,
        }

        return (
            <Fragment>
                <div style={CONTENT_STYLE}>
                    <Status {...status} messages={messages} />
                    {hasDangerRatings && this.renderContent(forecast)}
                </div>
                {hasDangerRatings && <ChartExplained />}
            </Fragment>
        )
    }
    get isLoadedMessage() {
        return (
            <Fragment>
                <p>
                    No danger ratings are available to run the TripPlanner in
                    that area.
                </p>
                <p>
                    Avalanche Forecast are not produce for every regions, in
                    some cases they are available externally.
                </p>
            </Fragment>
        )
    }
    get home() {
        return <Home style={HOME_STYLE}>Back to main map</Home>
    }
    get container() {
        const { area, region, onCloseClick } = this.props

        return (
            <Container>
                <Navbar style={NAVBAR_STYLE}>
                    {this.home}
                    <Close onClick={onCloseClick} />
                </Navbar>
                <Header subject="Trip planning">
                    <h1>
                        <span>{area.name}</span>
                        <DisplayOnMap onClick={this.props.onLocateClick} />
                    </h1>
                </Header>
                <Body>
                    {region ? (
                        <ForecastContainer name={region.id}>
                            {props => this.renderChildren(props)}
                        </ForecastContainer>
                    ) : (
                        <Muted>{this.isLoadedMessage}</Muted>
                    )}
                    <TerrainRatings />
                    <Help />
                </Body>
            </Container>
        )
    }
    get welcome() {
        return (
            <Container>
                <Navbar style={NAVBAR_STYLE}>{this.home}</Navbar>
                <Header subject="Trip planning" />
                <Body>
                    <Welcome />
                </Body>
            </Container>
        )
    }
    render() {
        const { area, open } = this.props

        return (
            <Drawer side={LEFT} width={400} open={open}>
                {area ? this.container : this.welcome}
            </Drawer>
        )
    }
}

class Content extends PureComponent {
    static propTypes = {
        elevation: PropTypes.oneOf(Array.from(ELEVATIONS)).isRequired,
        onElevationChange: PropTypes.func.isRequired,
        date: PropTypes.instanceOf(Date),
        onDateChange: PropTypes.func.isRequired,
        forecast: PropTypes.object.isRequired,
        area: PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            rating: PropTypes.oneOf([SIMPLE, CHALLENGING, COMPLEX]).isRequired,
        }),
    }
    get date() {
        return (
            this.props.date ||
            this.props.forecast.getIn(['dangerRatings', 0, 'date'])
        )
    }
    get activeDangerRatings() {
        const { date } = this

        return this.props.forecast
            .get('dangerRatings')
            .find(dangerRating => isSameDay(date, dangerRating.get('date')))
            .get('dangerRating')
            .toObject()
    }
    get dates() {
        return this.props.forecast
            .get('dangerRatings')
            .map(dangerRating => dangerRating.get('date'))
    }
    get danger() {
        const { rating } = this.props.area
        const dangerRatings = this.activeDangerRatings

        if (rating === SIMPLE) {
            const { elevation } = this.props

            return dangerRatings[elevation.toLowerCase()]
        } else {
            return LEVELS[
                Math.max(
                    LEVELS.indexOf(dangerRatings.alp),
                    LEVELS.indexOf(dangerRatings.tln),
                    LEVELS.indexOf(dangerRatings.btl)
                )
            ]
        }
    }
    get warning() {
        const { rating } = this.props.area

        switch (rating) {
            case SIMPLE:
                return (
                    <p>
                        For trips in "Simple" terrain, use the highest danger
                        rating for the elevation band(s) where you will be
                        travelling.
                    </p>
                )
            case COMPLEX:
            case CHALLENGING: {
                const text = TerrainRatingTexts.get(rating).toLowerCase()

                return (
                    <p>
                        For trips in "{text}" terrain, use the highest danger
                        rating given in the bulletin.
                    </p>
                )
            }
            default:
                return null
        }
    }
    get title() {
        const { elevation, date, area } = this.props

        return (
            <h2 style={CHART_TITLE_STYLE}>
                {area.name}
                {' riding in '}
                {TerrainRatingTexts.get(area.rating).toLowerCase()}
                {' and '}
                {ElevationTexts.get(elevation).toLowerCase()}
                {' terrain on '}
                <DateElement value={date} />
            </h2>
        )
    }
    render() {
        return (
            <Fragment>
                <Form {...this.props} date={this.date} dates={this.dates} />
                {/* {this.title} */}
                <div style={CHART_STYLE}>
                    <Chart
                        terrain={this.props.area.rating}
                        danger={this.danger}
                    />
                </div>
                {/* <Legend /> */}
                {this.warning}
                <p>
                    Remember to verify all information used during the trip
                    planning stage at the trail head. Confirm that the trip
                    decision is still within the comfort zone and skill level of
                    your group.
                </p>
            </Fragment>
        )
    }
}

class Form extends Component {
    static propTypes = {
        elevation: PropTypes.oneOf(Array.from(ELEVATIONS)).isRequired,
        onElevationChange: PropTypes.func.isRequired,
        date: PropTypes.instanceOf(Date).isRequired,
        onDateChange: PropTypes.func.isRequired,
        dates: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired,
    }
    render() {
        const {
            elevation,
            onElevationChange,
            onDateChange,
            date,
            dates,
        } = this.props

        return (
            <ControlSet>
                <Control horizontal>
                    <label style={LABEL_STYLE}>Day</label>
                    <Dropdown
                        onChange={onDateChange}
                        value={date}
                        style={INPUT_STYLE}>
                        {dates.map((date, index) => (
                            <Option key={index} value={date}>
                                <Day value={date} />
                            </Option>
                        ))}
                    </Dropdown>
                </Control>
                <Control horizontal>
                    <label style={LABEL_STYLE}>Elevation</label>
                    <Dropdown
                        onChange={onElevationChange}
                        value={elevation}
                        style={INPUT_STYLE}>
                        {Array.from(ElevationTexts).map(([value, text]) => (
                            <Option key={value} value={value}>
                                {text}
                            </Option>
                        ))}
                    </Dropdown>
                </Control>
            </ControlSet>
        )
    }
}

// Constants
const CONTENT_STYLE = {
    margin: '0 1em',
}
const CHART_STYLE = {
    margin: '1em 0',
}
const CHART_TITLE_STYLE = {
    marginBotton: 0,
}
const INPUT_STYLE = {
    flex: 0.75,
}
const LABEL_STYLE = {
    flex: 0.25,
    color: 'grey',
    marginRight: '1em',
}
const NAVBAR_STYLE = {
    justifyContent: 'space-between',
}
const HOME_STYLE = {
    paddingLeft: '1em',
}