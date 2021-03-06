'use strict';

var React  = require('react')
var assign = require('object-assign')

module.exports = React.createClass({

    displayName: 'ReactListView.Title',

    getDefaultProps: function() {
        return {
            title: ''
        }
    },

    render: function() {
        var props = this.prepareProps(this.props)

        return React.createElement("div", React.__spread({},  props))
    },

    prepareProps: function(thisProps) {
        var props = {}

        assign(props, thisProps)

        return props
    }
})