'use strict'

var React  = require('react')
var assign = require('object-assign')
var normalize = require('react-style-normalizer')

var DISPLAY_NAME = 'ReactListView.Row'

module.exports = React.createClass({

    displayName: DISPLAY_NAME,

    getDefaultProps: function() {
        return {
            defaultStyle: null,
            style       : null
        }
    },

    render: function() {

        var props = this.prepareProps(this.props, this.state)

        return <li {...props} data={null}/>
    },

    getInitialState: function() {
        return {}
    },

    xshouldComponentUpdate: function(nextProps){
        var updateOnOverChange
        var updateOnSelectedChange

        if (nextProps.mouseOverChange){
            updateOnOverChange = nextProps.mouseOver != this.props.mouseOver
        }

        if (nextProps.selectedChange){
            updateOnSelectedChange = nextProps.selected != this.props.selected
        }

        if (updateOnSelectedChange !== undefined || updateOnOverChange !== undefined){
            return updateOnSelectedChange || updateOnOverChange || false
        }

        return true
    },

    prepareProps: function(thisProps, state) {
        var props = {}

        assign(props, thisProps)

        props.style = this.prepareStyle(props, state)

        props.onMouseEnter = this.handleMouseOver
        props.onMouseLeave  = this.handleMouseOut

        props.className = this.prepareClassName(props, state)

        return props

    },

    prepareStyle: function(props, state) {
        return normalize(assign({}, props.defaultStyle, props.style))
    },

    prepareClassName: function(props, state) {
        var index = props.index

        var className = props.className || ''

        if (state.mouseOver || props.mouseOver){
            className += ' z-over'
        }

        return className
    },

    handleMouseOver: function(event) {

        this.setState({
            mouseOver: true
        })

        if (this.props.onMouseEnter){
            this.props.onMouseEnter(this.props, event)
        }
    },

    handleMouseOut: function(event) {
        this.setState({
            mouseOver: false
        })

        if (this.props.onMouseLeave){
            this.props.onMouseLeave(this.props, event)
        }
    }
})