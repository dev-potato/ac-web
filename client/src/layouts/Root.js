import React from 'react'
import PropTypes from 'prop-types'
import Application from '~/components/application'
import {AvalancheCanada} from '~/containers/Navbar'
import Highlight from '~/containers/Highlight'
import Footer from '~/components/footer'

Root.propTypes = {
    navbar: PropTypes.node,
    content: PropTypes.node,
    footer: PropTypes.node,
    children: PropTypes.node,
}

export default function Root({navbar, content, footer, children}) {
    return (
        <Application>
            {navbar || <AvalancheCanada />}
            <Highlight />
            {children || content}
            {footer !== null && <Footer />}
        </Application>
    )
}
