react-listview
==============

> React ListView

## Install

```sh
$ npm install react-listview --save
```


## Usage

```jsx
var data = [
	{id: 'das34r3sd', label: 'Ben Travis'},
	{id: 'fdsa42$#4', label: 'John Madson'}
]
<ListView data={data} idProperty='id' displayProperty='label' />
```

## Props

 * data - the array of data to show in the list
 * idProperty - the property of each array item that can be used as an id
 * displayProperty - the property of each array item that should be rendered
 * renderText: Function(text: String, item: Object, index: Number, rowProps: Object) - custom display function - called for each row
 * title: 'String' - if specified, a list title will be shown

 * loading: Boolean - use this to show a loading mask over the list
 * emptyText: String - defaults to 'No records'
 * loadingText: String - emptyText to be used when you have loading: true

### Virtual rendering

 * virtualRendering: Boolean - defaults to true
 * rowHeight: Number - defaults to null
 * bufferRowCount: Number - defaults to null

 By default, the listview only renders a limited amount of rows - those in view and a few more. If `bufferRowCount` is specified, it dictates how many rows are rendered.

This is called virtual rendering (`virtualRendering`: true), and is used to drastically improve performance on lists with more than a few items. Virtual rendering will also be used if you specify a `rowHeight`. If you don't want to use virtual rendering, make sure you specify `virtualRendering: false` and also no `rowHeight`. BEWARE: if you have more than 100 items, you will see degrading performance.


### Sorting props

 * sortable: Boolean - defaults to true
 * sortDirection - 1 (or 'asc'), -1 (or 'desc'), other for none
 * defaultSortDirection - if you want sorting to be done by the ListView component
 * onSortChange: Function(newDir) - called when the user clicks the title, so a sort action should be triggered

### Selection props

 * selected: Object/string/number - if an object, multiple selection is allowed, otherwise, single selection. For multiple selection, the keys of the `selected` property should be the ids of the selected rows (see `idProperty`). For single selection, `selected` should be a row id (value from `idProperty`)
 * defaultSelected - stateful alternative of `selected`
 * onSelectionChange: Function(newSelected)

### Row interaction props

 * onRowClick: Function(item, index, props, event)
 * onRowMouseUp: Function(item, index, props, event)
 * onRowMouseDown: Function(item, index, props, event)
 * onRowMouseEnter: Function(item, index, props, event)
 * onRowMouseLeave: Function(item, index, props, event)
 * onRowMouseOver: Function(item, index, props, event)
 * onRowMouseOut: Function(item, index, props, event)

### Styling props

 * emptyTextStyle
 * emptyStyle - style applied to the whole ListView when there is no item in the data array

### Row styling

 * rowStyle: Object/Function(item, index, rowProps)
 * selectedRowStyle: Object
 * overRowStyle: Object
 * overSelectedRowStyle: Object
 * rowHeight: Number - defaults to null
 * rowBorder: String/Boolean You can specify rowBorder:false in order not to show row borders
