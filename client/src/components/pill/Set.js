import React, { PropTypes, Children, cloneElement} from 'react'
import CSSModules from 'react-css-modules'
import {compose, withState, setDisplayName, setPropTypes} from 'recompose'
import styles from './Pill.css'

function K() {}

Set.propTypes = {
    children: PropTypes.node.isRequired,
    activeIndex: PropTypes.number,
    onActivate: PropTypes.func,

}

function Set({ activeIndex = 0, onActivate = K, setActiveIndex, children }) {
    return (
        <ul styleName='Set'>
            {Children.map(children, (item, index) => (
                cloneElement(item, {
                    active: activeIndex === index,
                    onClick: event => {
                        setActiveIndex(index)
                        onActivate(index)
                    }
                })
            ))}
        </ul>
    )
}

export default compose(
    setDisplayName('PillSet'),
    withState('activeIndex', 'setActiveIndex', props => props.activeIndex),
)(CSSModules(Set, styles))
