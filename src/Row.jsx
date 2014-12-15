'use strict'

var React  = require('react')
var assign = require('object-assign')

module.exports = React.createClass({

    displayName: 'ReactListView.Row',

    render: function() {

        var props = this.prepareProps(this.props, this.state)

        return <li {...props} />
    },

    getInitialState: function() {
        return {}
    },

    prepareProps: function(thisProps, state) {
        var props = {}

        assign(props, thisProps)

        props.onMouseOver = this.handleMouseOver
        props.onMouseOut  = this.handleMouseOut

        props.className = this.prepareClassName(props, state)

        return props

    },

    prepareClassName: function(props, state) {
        var index = props.index

        var className = props.className || ''

        if (state.mouseOver || props.mouseOver){
            className += ' z-over'
        }

        return className
    },

    handleMouseOver: function() {
        this.setState({
            mouseOver: true
        })
    },

    handleMouseOut: function() {
        this.setState({
            mouseOver: false
        })
    }
})