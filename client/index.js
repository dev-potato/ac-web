// Polyfills and shims
import '@babel/polyfill'
import 'raf/polyfill'
import 'url-search-params-polyfill'
import 'whatwg-fetch'
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'
import 'utils/polyfills/requestIdleCallback'

import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Redirect, Location } from '@reach/router'
import { AvalancheCanada, AvalancheCanadaFoundation } from 'layouts'
import ScrollTo from 'components/ScrollTo'
import Analytics from 'services/analytics'

import 'services/sentry'

import 'styles'

ReactDOM.render(
    <Location>{application}</Location>,
    document.getElementById('app')
)

function application({ location }) {
    return (
        <Analytics location={location}>
            <ScrollTo location={location}>
                <Router primary={false}>
                    <CAC path="cac" />
                    <AvalancheCanada path="/*" />
                    <AvalancheCanadaFoundation path="foundation/*" />
                </Router>
            </ScrollTo>
        </Analytics>
    )
}

// Subroutes
function CAC() {
    return (
        <Router>
            <Redirect from="training/ast/courses" to="training/courses" />
            <Redirect from="training/overview" to="training" />
            <Redirect from="training/online-course" to="tutorial" />
            <Redirect from="/" to="/" />
        </Router>
    )
}

// Utils
function redirect({ match }) {
    if (match) {
        const { uri } = match

        // Leave the application and goes to nginx to do appropriate redirect
        window.open(`https://avalanche.ca/${uri}`, uri)
    }

    return null
}
