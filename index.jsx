'use strict';

var React = require('react')
var ListView = require('./src')

// require('./index.styl')

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
                id       : i + 1 + 'x',
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
var LEN = 200
var SELECTED
var initial = true
var SORT_DIR = 1
var SELECTED = {}
var PADDING = 15

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

    refresh: function(){
        this.setState({})
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

        console.log('refresh');

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

        var changePadding = function(e){
            PADDING = e.target.value
            this.setState({})
        }.bind(this)

        function up(item, index, props, event){
            console.log(props.data[index])
        }

        return (
            <div className="App" style={{padding: 10}}>
                <input value={PADDING} onChange={changePadding}/>
                <button onClick={this.refresh}>refresh</button>
                <ListView
                    defaultSortDirection={0}

                    onSelectionChange={this.handleSelect}
                    xdefaultSelected={{}}
                    renderText={r}
                    rowStyle={{padding: PADDING}}
                    evenRowStyle={{color: 'red'}}
                    onRowMouseUp={up}
                    data={data} title="React List View" style={style}/>
            </div>
        )
    }
})

React.render(<App />, document.getElementById('content'))