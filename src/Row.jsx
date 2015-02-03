'use strict'

var React  = require('react')
var assign = require('object-assign')
var prefixer = require('react-style-normalizer')

module.exports = React.createClass({

    displayName: 'ReactListView.Row',

    getDefaultProps: function() {
        return {
            defaultStyle: {
                userSelect: 'none'
            }
        }
    },

    render: function() {

        var props = this.prepareProps(this.props, this.state)

        return <li {...props} data={null}/>
    },

    getInitialState: function() {
        return {}
    },

    prepareProps: function(thisProps, state) {
        var props = {}

        assign(props, thisProps)

        props.style = this.prepareStyle(props)
        props.onMouseOver = this.handleMouseOver
        props.onMouseOut  = this.handleMouseOut

        props.className = this.prepareClassName(props, state)

        return props

    },

    prepareStyle: function(props) {
        var style = assign({}, props.defaultStyle, props.style)

        return prefixer(style)
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