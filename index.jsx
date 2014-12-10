'use strict';

var React = require('react')
var ListView = require('./src')

require('./index.styl')

var faker = require('faker');

var gen = (function(){

    var cache = {}

    return function(len){

        if (cache[len]){
            return cache[len]
        }

        var arr = []

        for (var i = 0; i < len; i++){
            arr.push({
                id       : i + 1,
                grade      : Math.round(Math.random() * 10),
                email    : faker.internet.email(),
                text: faker.name.firstName(),
                lastName : faker.name.lastName(),
                birthDate: faker.date.past()
            })
        }

        cache[len] = arr

        return arr
    }
})()


var VALUE = 90
var LEN = 50

var App = React.createClass({


    render: function() {


        var style = {
            border: '1px solid gray',
            height: 500
            //,
            // height: 400,
            // width: 20,
            // margin: 10,
            // padding: 10
        }

        var data = gen(LEN)

        return (
            <div className="App" style={{padding: 10}}>
                <ListView
                    data={data} title="React List View" style={style}/>
            </div>
        )
    }
})

React.render(<App />, document.getElementById('content'))