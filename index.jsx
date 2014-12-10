'use strict';

var React = require('react')
var ListView = require('./src')

require('./index.styl')

var VALUE = 90

var App = React.createClass({


    render: function() {

        var firstStyle = {
            height: 20
        }

        var secondStyle = {
            // border: '1px solid gray'
            //,
            // height: 400,
            // width: 20,
            // margin: 10,
            // padding: 10
        }

        return (
            <div className="App" style={{padding: 10}}>
            </div>
        )
    }
})

React.render(<App />, document.getElementById('content'))