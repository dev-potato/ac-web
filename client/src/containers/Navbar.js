import {connect} from 'react-redux'
import {compose, withProps, withHandlers} from 'recompose'
import Navbar from '~/components/navbar'
import * as Menus from '~/constants/menu'
import {getIsAuthenticated, getProfile} from '~/getters/auth'
import {login, logout} from '~/actions/auth'

function mapStateToProps(state) {
    const {name, picture} = getProfile(state) || {}

    return {
        isAuthenticated: getIsAuthenticated(state),
        name,
        avatar: picture,
    }
}

export const AvalancheCanada = compose(
    connect(mapStateToProps, {
        login,
        logout,
    }),
    withProps({
        menu: Menus.AvalancheCanada,
    }),
    withHandlers({
        onLogin: props => () => {
            props.login()
        },
        onLogout: props => () => {
            props.logout()
        },
    })
)(Navbar)

export const AvalancheCanadaFoundation = withProps({
    isFoundation: true,
    menu: Menus.AvalancheCanadaFoundation,
})(Navbar)
