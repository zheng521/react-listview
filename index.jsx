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
var SELECTED
var initial = true
var SORT_DIR = 1
var SELECTED = {}

var SELECTED_INDEX = 30// - 10

var App = React.createClass({

    handleSelect: function(key) {
        console.log(arguments);
        // SELECTED = key
        // // SELECTED = {}
        // // SELECTED[key] = true

        // // console.log(SELECTED);

        // this.setState({})
    },

    handleSortChange: function(dir){
        SORT_DIR = dir
        this.setState({})
    },

    handleSelectedIndexChange: function(event) {
        // setTimeout(function(){
            // console.log('sort now');
            SELECTED_INDEX = event.target.value
            this.setState({})
        // }.bind(this), 1000)
    },

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

        var selected = SELECTED

        if (initial){
            initial = false
            data.forEach(function(item, index){
                if (index == SELECTED_INDEX){
                    // SELECTED = item.id
                    SELECTED[item.id] = true
                }
            })
        }

        function r(v, props, index){
            return v + ' is a very long long text! ' + index
        }

        return (
            <div className="App" style={{padding: 10}}>
                <input value={SELECTED_INDEX} onChange={this.handleSelectedIndexChange}/>
                <ListView
                    defaultSortDirection={SORT_DIR}
                    onSortChange={this.handleSortChange}
                    onSelectionChange={this.handleSelect}
                    defaultSelected={SELECTED}
                    renderText={r}
                    scrollToIndex={30}
                    data={data} title="React List View" style={style}/>
            </div>
        )
    }
})

React.render(<App />, document.getElementById('content'))