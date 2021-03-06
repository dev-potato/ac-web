import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import { DateUtils } from 'react-day-picker'
import format from 'date-fns/format'
import { Form, Legend, ControlSet, Control } from 'components/form'
import { DropdownFromOptions, Geocoder } from 'components/controls'
import { LEVELS, TAGS } from './constants'
import { ASC } from 'constants/sortings'
import { useBoolean } from 'hooks'
import controls from 'components/controls/Controls.css'
import { Close, Expand } from 'components/button'
import { WHITE } from 'constants/colors'
import 'react-day-picker/lib/style.css'
import styles from './Forms.css'

Courses.propTypes = {
    level: PropTypes.oneOf(Array.from(LEVELS.keys())),
    from: PropTypes.instanceOf(Date),
    to: PropTypes.instanceOf(Date),
    tags: PropTypes.instanceOf(Set),
    place: PropTypes.object,
    onParamsChange: PropTypes.func.isRequired,
}

export function Courses({ level, from, to, tags, place, onParamsChange }) {
    return (
        <Layout legend="Find a course">
            <Control>
                <DropdownFromOptions
                    onChange={niveau => {
                        onParamsChange({
                            level: niveau === level ? undefined : niveau,
                        })
                    }}
                    value={level}
                    placeholder="Level"
                    options={LEVELS}
                />
            </Control>
            <DateRangeControl from={from} to={to} onChange={onParamsChange} />
            <Control>
                <DropdownFromOptions
                    multiple
                    onChange={tags => onParamsChange({ tags })}
                    value={tags}
                    placeholder="Filter by"
                    options={TAGS}
                />
            </Control>
            <Control>
                <Geocoder
                    placeholder="Location"
                    onChange={place =>
                        onParamsChange({
                            place,
                            sorting: place ? ['distance', ASC] : null,
                        })
                    }
                    value={place?.text}
                />
            </Control>
        </Layout>
    )
}

Providers.propTypes = {
    tags: PropTypes.instanceOf(Set),
    place: PropTypes.object,
    onParamsChange: PropTypes.func.isRequired,
}

export function Providers({ tags, place, onParamsChange }) {
    return (
        <Layout legend="Find a provider">
            <Control>
                <DropdownFromOptions
                    onChange={tags => onParamsChange({ tags })}
                    value={tags}
                    placeholder="Filter by"
                    options={TAGS}
                />
            </Control>
            <Control>
                <Geocoder
                    placeholder="Location"
                    onChange={place =>
                        onParamsChange({
                            place,
                            sorting: place ? ['distance', ASC] : null,
                        })
                    }
                    value={place?.text}
                />
            </Control>
        </Layout>
    )
}

// Utils
Layout.propTypes = {
    legend: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
}
function Layout({ legend, children }) {
    return (
        <Form style={STYLE}>
            <Legend>{legend}</Legend>
            <ControlSet horizontal>{children}</ControlSet>
        </Form>
    )
}
function DateRangeControl({ from, to, onChange }) {
    const ref = useRef(null)
    const showClear = from && to
    const [mouseEntered, setMouseEntered] = useState(null)
    const [opened, show, hide] = useBoolean(from && !to)
    const value = formatDateRange(from, to)
    function reset() {
        // https://github.com/gpbl/react-day-picker/issues/804
        ref.current.setState(
            {
                value: '',
                typedValue: '',
            },
            () => {
                onChange({ from: null, to: null })
            }
        )
    }

    return (
        <Control style={DATE_RANGE_STYLE}>
            <DayPickerInput
                ref={ref}
                style={{ flex: 1 }}
                value={value}
                showOverlay={opened}
                formatDate={formatDate}
                placeholder="Date range"
                onDayPickerHide={hide}
                onDayPickerShow={show}
                hideOnDayClick={false}
                dayPickerProps={{
                    className: styles.DayPickerSelectable,
                    numberOfMonths: 2,
                    selectedDays: [
                        from,
                        {
                            from,
                            to: to || mouseEntered,
                        },
                    ],
                    disabledDays: {
                        before: from || new Date(),
                    },
                    month: from || new Date(),
                    modifiers: {
                        start: from,
                        end: mouseEntered,
                    },
                    onDayMouseEnter(day) {
                        if (!isSelectingFirstDay(from, to, day)) {
                            setMouseEntered(day)
                        }
                    },
                    onDayClick(day) {
                        if (isSelectingFirstDay(from, to, day)) {
                            setMouseEntered(null)
                            onChange({
                                from: day,
                                to: null,
                            })
                        } else {
                            const { current } = ref

                            setMouseEntered(day)
                            onChange({
                                to: day,
                            })
                            current.hideDayPicker()
                        }
                    },
                }}
                inputProps={{
                    readOnly: true,
                    className: controls.Input,
                }}
            />
            {showClear ? (
                <Close onClick={reset} />
            ) : (
                <Expand
                    chevron
                    expanded={opened}
                    onClick={() => {
                        const { current } = ref

                        opened
                            ? current.hideDayPicker()
                            : current.showDayPicker()
                    }}
                />
            )}
        </Control>
    )
}

// Utils
const FORMAT = 'MMM D YYYY'
const SHORT_FORMAT = 'MMM D'
function isSelectingFirstDay(from, to, day) {
    const isBeforeFirstDay = from && DateUtils.isDayBefore(day, from)
    const isRangeSelected = from && to
    return !from || isBeforeFirstDay || isRangeSelected
}
function formatDateRange(from, to) {
    if (!from || !to) {
        return ''
    }

    return `${format(
        from,
        from.getFullYear() === to.getFullYear() ? SHORT_FORMAT : FORMAT
    )} to ${format(to, FORMAT)}`
}
function formatDate() {
    return ''
}

// Styles
const STYLE = {
    margin: 'auto',
    position: 'relative',
}
const DATE_RANGE_STYLE = {
    backgroundColor: WHITE,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
}
