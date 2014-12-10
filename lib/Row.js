'use strict'

var React  = require('react')
var assign = require('object-assign')

module.exports = React.createClass({

    displayName: 'ReactListView.Row',

    render: function() {

        var props = this.prepareProps(this.props, this.state)

        return React.createElement("li", React.__spread({},  props))
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

        var className = (props.className || '') + ' z-row'

        if (index % 2){
            className += ' z-odd'
        } else {
            className += ' z-even'
        }

        if (state.mouseOver){
            className += ' z-over'
        }

        if (props.first){
            className += ' z-first'
        }

        if (props.last){
            className += ' z-last'
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