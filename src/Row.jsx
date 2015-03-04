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

    shouldComponentUpdate: function(nextProps){
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
        var over = state.mouseOver || props.mouseOver

        var overStyle
        var selectedStyle
        var overSelectedStyle

        if (over){
            overStyle = props.overStyle
        }

        if (props.selected){
            selectedStyle = props.selectedStyle
        }

        if (over && props.selected){
            overSelectedStyle = props.overSelectedStyle
        }

        var style = assign({}, props.defaultStyle, props.style, overStyle, selectedStyle, overSelectedStyle)

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