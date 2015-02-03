(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"));
	else if(typeof define === 'function' && define.amd)
		define(["React"], factory);
	else if(typeof exports === 'object')
		exports["ReactListView"] = factory(require("React"));
	else
		root["ReactListView"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */'use strict'

	var React    = __webpack_require__(1)
	var LoadMask = __webpack_require__(7)
	var Title = __webpack_require__(2)
	var TitleFactory = React.createFactory(Title)
	var Row = __webpack_require__(3)
	var RowFactory = React.createFactory(Row)
	var assign   = __webpack_require__(6)

	var getSelected   = __webpack_require__(4)

	var stringOrNumber = React.PropTypes.oneOfType([
	    React.PropTypes.number,
	    React.PropTypes.string
	])

	function emptyFn(){}

	function scrollToRowIfNeeded(row, parentNode, scrollConfig){
	    parentNode       = parentNode || row.parentNode
	    var scrollTop    = parentNode.scrollTop
	    var parentHeight = parentNode.offsetHeight
	    var scrollBottom = scrollTop + parentHeight
	    var rowTop       = row.offsetTop// + scrollTop
	    var rowBottom    = rowTop + row.offsetHeight

	    if (rowTop < scrollTop || rowBottom > scrollBottom){
	        row.scrollIntoView(scrollConfig)

	        return true
	    }

	    return false
	}

	module.exports = React.createClass({

	    displayName: 'ReactListView',

	    mixins: [
	        __webpack_require__(5)
	    ],

	    propTypes: {
	        renderText: React.PropTypes.func,
	        title     : stringOrNumber,
	        rowHeight : stringOrNumber,
	        rowStyle  : React.PropTypes.oneOf([
	            React.PropTypes.object,
	            React.PropTypes.func
	        ]),

	        data       : React.PropTypes.array,
	        loading    : React.PropTypes.bool,
	        emptyText  : React.PropTypes.string,
	        loadingText: React.PropTypes.string,

	        idProperty     : React.PropTypes.string,
	        displayProperty: React.PropTypes.string,
	        selected       : React.PropTypes.object,

	        sortable     : React.PropTypes.bool,
	        sortDirection: stringOrNumber,
	        toggleSort   : React.PropTypes.func
	    },

	    scrollToRow: function(row) {
	        if (row){
	            return scrollToRowIfNeeded.call(this, row, this.refs.listWrap.getDOMNode())
	        }
	    },

	    scrollToRowById: function(id) {
	        this.scrollToRow(this.findRowById(id))
	    },

	    scrollToRowByIndex: function(index) {
	        this.scrollToRow(this.findRowByIndex(index))

	    },

	    findRowByIndex: function(index) {
	        var item = this.props.data[index]

	        if (!item){
	            return
	        }

	        var id = item[this.props.idProperty]

	        return this.findRowById(id)
	    },

	    findRowById: function(id) {
	        if (this.isMounted()){
	            return this.getDOMNode().querySelector('[data-row-id="' + id + '"]')
	        }
	    },

	    getDefaultProps: function() {
	        return {
	            rowBoundMethods: {
	                onRowMouseDown: 'onMouseDown',
	                onRowMouseUp  : 'onMouseUp',
	                onRowClick    : 'onClick',
	                onRowMouseOver: 'onMouseOver',
	                onRowMouseOut : 'onMouseOut'
	            },

	            sortable: true,

	            selectRowOnClick: true,

	            idProperty: 'id',
	            displayProperty: 'text',
	            emptyText: 'No records',
	            loadingText: '',

	            rowHeight: null,

	            defaultStyle: {},
	            defaultListStyle: {}
	        }
	    },

	    getInitialState: function() {
	        return {
	            defaultSelected: this.props.defaultSelected
	        }
	    },

	    render: function() {

	        var state = this.state
	        var props = this.prepareProps(this.props)
	        var title = this.renderTitle(props, state)
	        var body  = this.renderBody(props, state)

	        props.data = null

	        if (props.scrollToIndex){
	            setTimeout(function(){
	                this.scrollToRow(props.scrollToIndex)
	            }.bind(this), 0)
	        }

	        return (
	            React.createElement("div", React.__spread({},  props), 
	                title, 
	                body
	            )
	        )
	    },

	    prepareProps: function(thisProps) {

	        var props = assign({}, thisProps)

	        props.style         = this.prepareStyle(props)
	        props.titleStyle    = this.prepareTitleStyle(props)
	        props.bodyStyle     = this.prepareBodyStyle(props)
	        props.listWrapStyle = this.prepareListWrapStyle(props)
	        props.rowStyle      = this.prepareRowStyle(props)

	        props.className = this.prepareClassName(props)

	        return props
	    },

	    prepareStyle: function(props) {

	        var style = {}

	        assign(style, props.defaultStyle, props.style)

	        return style
	    },

	    prepareClassName: function(props) {
	        var className = props.className || ''

	        className += ' z-listview'

	        if (!this.getCount(props)){
	            className += ' z-empty'
	        }

	        var sortableCls = props.sortable?
	                            ' z-sortable':
	                            ''
	        if (props.sortable && props.sortDirection){
	            sortableCls += props.sortDirection === 'asc' || props.sortDirection === 1?
	                                ' z-asc':
	                                props.sortDirection === 'desc' || props.sortDirection === -1?
	                                    ' z-desc':
	                                    ''
	        }

	        className += sortableCls

	        return className
	    },

	    prepareBodyStyle: function(props) {
	        var bodyStyle = assign({}, props.defaultBodyStyle, props.bodyStyle)

	        return bodyStyle
	    },

	    prepareTitleStyle: function(props) {
	        var titleStyle = assign({}, props.defaultTitleStyle, props.titleStyle)

	        return titleStyle
	    },

	    prepareRowStyle: function(props) {

	        var rowStyle = props.rowStyle

	        if (typeof rowStyle === 'function'){
	            rowStyle = null
	        }

	        var rowStyle = assign({}, props.defaultRowStyle, rowStyle, {
	            height: props.rowHeight
	        })

	        return rowStyle
	    },

	    prepareListWrapStyle: function(props) {
	        var style = {}

	        assign(style, props.defaultListStyle, {
	            border   : props.listBorder,
	            width    : props.listWidth  || props.listSize,
	            height   : props.listHeight || props.listSize,
	            maxHeight: props.listMaxHeight,
	            maxWidth : props.listMaxWidth
	        }, props.listStyle)

	        return style
	    },

	    renderTitle: function(props) {
	        if (props.title){
	            return (props.titleFactory || TitleFactory)({
	                style    : props.titleStyle,
	                className: (props.titleClassName || '') + ' z-title',
	                onClick: this.handleTitleClick.bind(this, props)
	            }, props.title, this.renderTitleSort(props))
	        }
	    },

	    renderTitleSort: function(props) {
	        if (props.sortable !== false){
	            return React.createElement("span", {className: "z-icon-sort-info"})
	        }
	    },

	    renderBody: function(props, state) {

	        var bodyClassName = props.bodyClassName || ''

	        bodyClassName += ' z-body'

	        return (
	            React.createElement("div", {className: bodyClassName, style: props.bodyStyle}, 
	                this.renderListWrap(props, state), 
	                React.createElement(LoadMask, {visible: props.loading})
	            )
	        )
	    },

	    renderListWrap: function(props, state) {
	        return (
	            React.createElement("div", {ref: "listWrap", className: "z-list-wrap", style: props.listWrapStyle}, 
	                React.createElement("div", {className: "z-scroller"}, 
	                    this.renderList(props, state)
	                )
	            )
	        )
	    },

	    getCount: function(props) {
	        return props.data?
	                    props.data.length:
	                    0
	    },

	    handleTitleClick: function(props, event){
	        if (props.sortable){
	            ;(props.toggleSort || this.toggleSort)(props)
	        }
	    },

	    toggleSort: function(props){
	        var dir = props.sortDirection === 'asc'?
	                    1:
	                    props.sortDirection === 'desc'?
	                        -1:
	                        props.sortDirection

	        var newDir
	        if (dir != 1 && dir != -1){
	            newDir = 1
	        } else {
	            newDir = dir === 1? -1: dir === -1?  0: 1
	        }

	        ;(props.onSortChange || emptyFn)(newDir, props)
	    },

	    renderList: function(props, state) {

	        var className = 'z-list'
	        var count = this.getCount(props)
	        var empty = false

	        if (!count){
	            empty = true
	            className += ' z-empty'
	        }

	        var data = props.data || []

	        var selected = getSelected(props, state)

	        return (
	            React.createElement("ul", {className: className, style: props.listTagStyle}, 
	                empty? this.renderEmpty(props): data.map(this.renderRow.bind(this, props, state, selected))
	            )
	        )
	    },

	    renderEmpty: function(props) {
	        return React.createElement("li", {className: "z-row-empty"}, props.loading? props.loadingText: props.emptyText)
	    },

	    renderRow: function(props, state, selected, item, index, arr) {
	        var key  = item[props.idProperty]
	        var text = item[props.displayProperty]

	        if (typeof props.renderText == 'function'){
	            text = props.renderText(text, item, index, props)
	        }

	        var rowClassName = ''

	        var isSelected = false

	        if (typeof selected == 'object' && selected){
	            isSelected = !!selected[key]
	        } else if (selected != null){
	            isSelected = key === selected
	        }

	        if (isSelected){
	            this.selIndex = index
	            rowClassName += ' z-selected'
	        }

	        if (state.mouseOverKey === key){
	            rowClassName += ' z-over'
	        }

	        var rowStyle = props.rowStyle

	        var rowProps = {
	            key      : key,
	            style    : rowStyle,
	            'data-row-id': key,
	            index    : index,
	            first    : index === 0,
	            last     : index === arr.length - 1,
	            data     : item,
	            className: rowClassName,
	            children : text
	        }

	        rowProps.onClick = this.handleRowClick.bind(this, item, index, rowProps, props)


	        if (typeof this.props.rowStyle == 'function'){
	            rowProps.style = assign({}, rowProps.style, this.props.rowStyle(item, index, rowProps))
	        }

	        this.bindRowMethods(props, rowProps, props.rowBoundMethods, item, index)

	        rowProps.className = this.prepareRowClassName(rowProps, this.state)

	        if (props.rowFactory){
	            rowProps.onMouseOver = this.handleRowMouseOver.bind(this, item, index, props, key)
	            rowProps.onMouseOut  = this.handleRowMouseOut.bind(this, item, index, props, key)
	        }

	        var defaultFactory = RowFactory
	        var factory = props.rowFactory || defaultFactory

	        var result = factory(rowProps)

	        if (result === undefined){
	            result = defaultFactory(rowProps)
	        }

	        return result
	    },

	    handleRowMouseOver: function(item, index, props, key){
	        this.setState({
	            mouseOverKey: key
	        })
	    },

	    handleRowMouseOut: function(item, index, props, key){
	        this.setState({
	            mouseOverKey: undefined
	        })
	    },

	    bindRowMethods: function(props, rowProps, bindMethods, item, index) {
	        Object.keys(bindMethods).forEach(function(key){
	            var eventName = bindMethods[key]

	            if (props[key]){
	                rowProps[eventName] = props[key].bind(null, item, index, props)
	            }
	        }, this)
	    },

	    prepareRowClassName: function(rowProps, state) {
	        var index = rowProps.index

	        var className = (rowProps.className || '') + ' z-row'

	        if (index % 2){
	            className += ' z-odd'
	        } else {
	            className += ' z-even'
	        }

	        if (rowProps.first){
	            className += ' z-first'
	        }

	        if (rowProps.last){
	            className += ' z-last'
	        }

	        return className
	    },

	    handleRowClick: function(item, index, rowProps, props, event) {

	        // if (props.selectRowOnClick){

	        //     var key         = item[props.idProperty]
	        //     var selected    = props.selected || {}
	        //     var rowSelected = !!selected[key]

	        //     var fn = rowSelected? 'onDeselect': 'onSelect'

	        //     ;(props[fn] || emptyFn)(key, item, index, selected, props)
	        //     ;(props.onSelectionChange || emptyFn)(key, item, index, selected, props)
	        // }

	        ;(props.onRowClick || emptyFn)(item, index, props, event)

	        this.handleSelection(rowProps, event)
	    }
	})

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */'use strict';

	var React  = __webpack_require__(1)
	var assign = __webpack_require__(6)

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

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */'use strict'

	var React  = __webpack_require__(1)
	var assign = __webpack_require__(6)
	var prefixer = __webpack_require__(8)

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

	        return React.createElement("li", React.__spread({},  props, {data: null}))
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

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function(props, state){
	    var selected = props.selected == null?
	                        state.defaultSelected
	                        :
	                        props.selected

	    return selected
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var assign = __webpack_require__(6)
	var getSelected = __webpack_require__(4)

	var hasOwn = function(obj, prop){
	    return Object.prototype.hasOwnProperty.call(obj, prop)
	}

	/**
	 * Here is how multi selection is implemented - trying to emulate behavior in OSX Finder
	 *
	 * When there is no selection, and an initial click for selection is done, keep that index (SELINDEX)
	 *
	 * Next, if we shift+click, we mark as selected the items from initial index to current click index.
	 *
	 * Now, if we ctrl+click elsewhere, keep the selection, but also add the selected file,
	 * and set SELINDEX to the new index. Now on any subsequent clicks, have the same behavior,
	 * selecting/deselecting items starting from SELINDEX to the new click index
	 */


	module.exports = {

	    findInitialSelectionIndex: function(){
	        var selected = getSelected(this.props, this.state)
	        var index = undefined

	        if (!Object.keys(selected).length){
	            return index
	        }


	        var i = 0
	        var data = this.props.data
	        var len = data.length
	        var id
	        var idProperty = this.props.idProperty

	        for (; i < len; i++){
	            id = data[i][idProperty]

	            if (selected[id]){
	                index = i
	            }
	        }

	        return index
	    },

	    notifySelection: function(selected, data){
	        if (typeof this.props.onSelectionChange == 'function'){
	            this.props.onSelectionChange(selected, data)
	        }

	        if (!hasOwn(this.props, 'selected')){
	            this.setState({
	                defaultSelected: selected
	            })
	        }
	    },

	    handleSingleSelection: function(data, event){
	        var props = this.props

	        var rowSelected = this.isRowSelected(data)
	        var newSelected = !rowSelected

	        if (rowSelected && event && !event.ctrlKey){
	            //if already selected and not ctrl, keep selected
	            newSelected = true
	        }

	        var selectedId = newSelected?
	                            data[props.idProperty]:
	                            null

	        this.notifySelection(selectedId, data)
	    },


	    handleMultiSelection: function(data, event, config){

	        var selIndex = config.selIndex
	        var prevShiftKeyIndex = config.prevShiftKeyIndex

	        var props = this.props
	        var map   = selIndex == null?
	                        {}:
	                        assign({}, getSelected(props, this.state))

	        if (prevShiftKeyIndex != null && selIndex != null){
	            var min = Math.min(prevShiftKeyIndex, selIndex)
	            var max = Math.max(prevShiftKeyIndex, selIndex)

	            var removeArray = props.data.slice(min, max + 1) || []

	            removeArray.forEach(function(item){
	                if (item){
	                    var id = item[props.idProperty]
	                    delete map[id]
	                }
	            })
	        }

	        data.forEach(function(item){
	            if (item){
	                var id = item[props.idProperty]
	                map[id] = item
	            }
	        })

	        this.notifySelection(map, data)
	    },

	    handleMultiSelectionRowToggle: function(data, event){

	        var selected   = getSelected(this.props, this.state)
	        var isSelected = this.isRowSelected(data)

	        var clone = assign({}, selected)
	        var id    = data[this.props.idProperty]

	        if (isSelected){
	            delete clone[id]
	        } else {
	            clone[id] = data
	        }

	        this.notifySelection(clone, data)

	        return isSelected
	    },

	    handleSelection: function(rowProps, event){

	        var props = this.props

	        if (!hasOwn(props, 'selected') && !hasOwn(props, 'defaultSelected')){
	            return
	        }

	        var isSelected  = this.isRowSelected(rowProps.data)
	        var multiSelect = this.isMultiSelect()

	        if (!multiSelect){
	            this.handleSingleSelection(rowProps.data, event)
	            return
	        }

	        if (this.selIndex === undefined){
	            this.selIndex = this.findInitialSelectionIndex()
	        }

	        var selIndex = this.selIndex

	        //multi selection
	        var index = rowProps.index
	        var prevShiftKeyIndex = this.shiftKeyIndex
	        var start
	        var end
	        var data

	        if (event.ctrlKey){
	            this.selIndex = index
	            this.shiftKeyIndex = null

	            var unselect = this.handleMultiSelectionRowToggle(props.data[index], event)

	            if (unselect){
	                this.selIndex++
	                this.shiftKeyIndex = prevShiftKeyIndex
	            }

	            return
	        }

	        if (!event.shiftKey){
	            //set selIndex, for future use
	            this.selIndex = index
	            this.shiftKeyIndex = null

	            //should not select many, so make selIndex null
	            selIndex = null
	        } else {
	            this.shiftKeyIndex = index
	        }

	        if (selIndex == null){
	            data = [props.data[index]]
	        } else {
	            start = Math.min(index, selIndex)
	            end   = Math.max(index, selIndex) + 1
	            data  = props.data.slice(start, end)
	        }

	        this.handleMultiSelection(data, event, {
	            selIndex: selIndex,
	            prevShiftKeyIndex: prevShiftKeyIndex
	        })
	    },


	    isRowSelected: function(data){
	        var selectedMap = this.getSelectedMap()
	        var id          = data[this.props.idProperty]

	        return selectedMap[id]
	    },

	    isMultiSelect: function(){
	        var selected = getSelected(this.props, this.state)

	        return selected && typeof selected == 'object'
	    },

	    getSelectedMap: function(){
	        var selected    = getSelected(this.props, this.state)
	        var multiSelect = selected && typeof selected == 'object'
	        var map

	        if (multiSelect){
	            map = selected
	        } else {
	            map = {}
	            map[selected] = true
	        }

	        return map
	    }
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function ToObject(val) {
		if (val == null) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	module.exports = Object.assign || function (target, source) {
		var from;
		var keys;
		var to = ToObject(target);

		for (var s = 1; s < arguments.length; s++) {
			from = arguments[s];
			keys = Object.keys(Object(from));

			for (var i = 0; i < keys.length; i++) {
				to[keys[i]] = from[keys[i]];
			}
		}

		return to;
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React  = __webpack_require__(1)
	var assign = __webpack_require__(10)
	var Loader = __webpack_require__(9)

	module.exports = React.createClass({

	    displayName: 'LoadMask',

	    getDefaultProps: function(){

	        return {
	            visibleDisplayValue: 'block',
	            defaultStyle: {
	                position: 'absolute',
	                width   : '100%',
	                height  : '100%',
	                display : 'none',
	                top: 0,
	                left: 0
	            }
	        }
	    },

	    render: function(){
	        var props = assign({}, this.props)

	        this.prepareStyle(props)

	        props.className = props.className || ''
	        props.className += ' loadmask'

	        return React.DOM.div(props, React.createElement(Loader, {size: props.size}))
	    },

	    prepareStyle: function(props){

	        var style = {}

	        assign(style, props.defaultStyle)
	        assign(style, props.style)

	        style.display = props.visible?
	                        props.visibleDisplayValue:
	                        'none'

	        props.style = style
	    }
	})

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var hasOwn         = __webpack_require__(11)
	var getPrefixed    = __webpack_require__(12)

	var map      = __webpack_require__(13)
	var plugable = __webpack_require__(14)

	function plugins(key, value){

		var result = {
			key  : key,
			value: value
		}

		;(RESULT.plugins || []).forEach(function(fn){

			var tmp = map(function(res){
				return fn(key, value, res)
			}, result)

			if (tmp){
				result = tmp
			}
		})

		return result
	}

	function normalize(key, value){

		var result = plugins(key, value)

		return map(function(result){
			return {
				key  : getPrefixed(result.key),
				value: result.value
			}
		}, result)

		return result
	}

	var RESULT = function(style){
		var k
		var item
		var result = {}

		for (k in style) if (hasOwn(style, k)){
			item = normalize(k, style[k])

			if (!item){
				continue
			}

			map(function(item){
				result[item.key] = item.value
			}, item)
		}

		return result
	}

	module.exports = plugable(RESULT)

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React  = __webpack_require__(1)
	var assign = __webpack_require__(10)

	module.exports = React.createClass({

	    displayName: 'Loader',

	    getDefaultProps: function(){
	        return {
	            defaultStyle: {
	                margin: 'auto',
	                position: 'absolute',
	                top: 0,
	                left: 0,
	                bottom: 0,
	                right: 0,
	            },
	            defaultClassName: 'loader',
	            size: 40,
	        }
	    },

	    render: function() {
	        var props = assign({}, this.props)

	        this.prepareStyle(props)

	        props.className = props.className || ''
	        props.className += ' ' + props.defaultClassName

	        return React.DOM.div(props,
	            React.createElement("div", {className: "loadbar loadbar-1"}),
	            React.createElement("div", {className: "loadbar loadbar-2"}),
	            React.createElement("div", {className: "loadbar loadbar-3"}),
	            React.createElement("div", {className: "loadbar loadbar-4"}),
	            React.createElement("div", {className: "loadbar loadbar-5"}),
	            React.createElement("div", {className: "loadbar loadbar-6"}),
	            React.createElement("div", {className: "loadbar loadbar-7"}),
	            React.createElement("div", {className: "loadbar loadbar-8"}),
	            React.createElement("div", {className: "loadbar loadbar-9"}),
	            React.createElement("div", {className: "loadbar loadbar-10"}),
	            React.createElement("div", {className: "loadbar loadbar-11"}),
	            React.createElement("div", {className: "loadbar loadbar-12"})
	        )
	    },

	    prepareStyle: function(props){

	        var style = {}

	        assign(style, props.defaultStyle)
	        assign(style, props.style)

	        style.width = props.size
	        style.height = props.size

	        props.style = style
	    }
	})

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function ToObject(val) {
		if (val == null) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	module.exports = Object.assign || function (target, source) {
		var from;
		var keys;
		var to = ToObject(target);

		for (var s = 1; s < arguments.length; s++) {
			from = arguments[s];
			keys = Object.keys(Object(from));

			for (var i = 0; i < keys.length; i++) {
				to[keys[i]] = from[keys[i]];
			}
		}

		return to;
	};


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function(obj, prop){
		return Object.prototype.hasOwnProperty.call(obj, prop)
	}


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var toUpperFirst = __webpack_require__(15)
	var getPrefix    = __webpack_require__(16)

	var properties = {
	  'flex': 1,
	  'flexFlow': 1,
	  'userSelect': 1,
	  'transform': 1,
	  'transition': 1,
	  'transformOrigin': 1,
	  'transformStyle': 1,
	  'transitionProperty': 1,
	  'transitionDuration': 1,
	  'transitionTimingFunction': 1,
	  'transitionDelay': 1,
	  'borderImage': 1,
	  'borderImageSlice': 1,
	  'boxShadow': 1,
	  'backgroundClip': 1,
	  'backfaceVisibility': 1,
	  'perspective': 1,
	  'perspectiveOrigin': 1,
	  'animation': 1,
	  'animationDuration': 1,
	  'animationName': 1,
	  'animationDelay': 1,
	  'animationDirection': 1,
	  'animationIterationCount': 1,
	  'animationTimingFunction': 1,
	  'animationPlayState': 1,
	  'animationFillMode': 1,
	  'appearance': 1
	}


	module.exports = function(key){

		if (!properties[key]){
			return key
		}

		var prefix = getPrefix(key)

		return prefix?
				prefix + toUpperFirst(key):
				key

	}

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function(fn, item){

		if (!item){
			return
		}

		if (Array.isArray(item)){
			return item.map(fn).filter(function(x){
				return !!x
			})
		} else {
			return fn(item)
		}
	}

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var getCssPrefixed = __webpack_require__(17)

	module.exports = function(target){
		target.plugins = target.plugins || [
			(function(){
				var values = {
					'flex':1,
					'inline-flex':1
				}

				return function(key, value){
					if (key === 'display' && value in values){
						return {
							key: key,
							value: getCssPrefixed(key, value)
						}
					}
				}
			})()
		]

		target.plugin = function(fn){
			target.plugins = target.plugins || []

			target.plugins.push(fn)
		}

		return target
	}

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function(str){
		return str?
				str.charAt(0).toUpperCase() + str.slice(1):
				''
	}

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var toUpperFirst = __webpack_require__(15)
	var prefixes     = ["ms", "Moz", "Webkit", "O"]

	var el = __webpack_require__(18)

	var PREFIX

	module.exports = function(key){

		if (PREFIX){
			return PREFIX
		}

		var i = 0
		var len = prefixes.length
		var tmp
		var prefix

		for (; i < len; i++){
			prefix = prefixes[i]
			tmp = prefix + toUpperFirst(key)

			if (typeof el.style[tmp] != 'undefined'){
				return PREFIX = prefix
			}
		}
	}

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var toUpperFirst = __webpack_require__(15)
	var getPrefix    = __webpack_require__(16)
	var getPrefixed  = __webpack_require__(12)
	var el           = __webpack_require__(18)

	var MEMORY = {}

	module.exports = function(key, value){

	    var k = key + ': ' + value

	    if (MEMORY[k]){
	        return MEMORY[k]
	    }

	    var prefix = getPrefix('appearance')
	    var prefixed = getPrefixed(key)

	    var prefixedValue = '-' + prefix.toLowerCase() + '-' + value

	    el.style[prefixed] = prefixedValue

	    if (el.style[prefixed] === prefixedValue){
	        value = prefixedValue
	    }

	    MEMORY[k] = value

	    return value
	}

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var el

	if(!!global.document){
	  	el = global.document.createElement('div')
	}

	module.exports = el
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }
/******/ ])
});
