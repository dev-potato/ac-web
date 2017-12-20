import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Article, Header as PageHeader } from 'components/page'

export default class Layout extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        children: PropTypes.arrayOf(PropTypes.node).isRequired,
    }
    render() {
        return (
            <Article>
                <PageHeader title={this.props.title} />
                {this.props.children}
            </Article>
        )
    }
}