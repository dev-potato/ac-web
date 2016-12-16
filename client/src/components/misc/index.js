import {createTime} from './Time'

export Ribbon from './Ribbon'

export Sponsor from './Sponsor'

export Avatar from './Avatar'

export Mailto from './Mailto'
export Phone from './Phone'

export Br from './Br'

export P from './P'

export GoBack from './GoBack'

export const Time = createTime('Time', 'HH:mm')
export const DateTime = createTime('DateTime', 'dddd, MMMM D, HH:mm')
export const Day = createTime('Day', 'dddd')
export const DateElement = createTime('Date', function format(value) {
    const now = new Date()

    return value.getFullYear() === now.getFullYear() ? 'dddd, MMMM D' : 'dddd, MMMM D, YYYY'
})

export InnerHTML from './InnerHTML'

export Collapse from './Collapse'

export {Muted, Loading, Error, Warning, Helper} from './Text'

export Image from './Image'

export Backdrop from './Backdrop'

export DayPicker from './DayPicker'
export {DateUtils} from 'react-day-picker'

export Ratio from './Ratio'
export ElementResize from './ElementResize'

export Delay from './Delay'
