import {PropTypes} from 'react'
import {Link} from 'react-router'
import {compose, mapProps, setPropTypes, setDisplayName, withState, lifecycle} from 'recompose'
import {connect} from 'react-redux'
import {load} from 'actions/prismic'
import {getDocumentForUid} from 'getters/prismic'
import {title, pathname} from 'utils/prismic'

function mapStateToProps(state, {type, uid}) {
    const document = getDocumentForUid(state, type, uid)

    if (document) {
        return {
            children: title(document)
        }
    }

    return {

    }
}

export default compose(
    setDisplayName('DocumentLink'),
    setPropTypes({
        type: PropTypes.string.isRequired,
        uid: PropTypes.string.isRequired,
    }),
    connect(mapStateToProps, {
        load
    }),
    lifecycle({
        componentDidMount() {
            const {type, uid, load} = this.props

            load({type, uid})
        },
    }),
    mapProps(props => ({
        to: pathname(props),
        children: props.children,
    }))
)(Link)
