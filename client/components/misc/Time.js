import React from 'react'
import PropTypes from 'prop-types'
import { compose, setDisplayName, withProps } from 'recompose'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import parse from 'date-fns/parse'
import formatDate from 'date-fns/format'

Time.propTypes = {
    value: PropTypes.instanceOf(Date),
    format: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    className: PropTypes.string,
    children: PropTypes.node,
}

export default function Time({
    value = new Date(),
    format,
    children,
    className,
}) {
    const date = parse(value)

    if (typeof format === 'function') {
        format = format(value)
    }

    return (
        <time dateTime={formatDate(date)} className={className}>
            {children || formatDate(date, format)}
        </time>
    )
}

export function createTime(displayName, defaultFormat) {
    return compose(
        setDisplayName(displayName),
        withProps(({ format }) => ({
            format: format || defaultFormat,
        }))
    )(Time)
}

Relative.propTypes = {
    value: PropTypes.instanceOf(Date),
    options: PropTypes.object,
    children: PropTypes.node,
}

const OPTIONS = {
    addSuffix: true,
}

export function Relative({ value = new Date(), children, options = OPTIONS }) {
    return (
        <time dateTime={value.toISOString()}>
            {children || distanceInWordsToNow(value, options)}
        </time>
    )
}
