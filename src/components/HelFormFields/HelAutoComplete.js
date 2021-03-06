import React from 'react'

import { injectIntl } from 'react-intl'

import { AutoComplete } from 'material-ui'
import { TextField } from 'material-ui'

import Typeahead from 'src/typeahead.js'

import {connect} from 'react-redux'
import {setData} from 'src/actions/editor.js'

class HelAutoComplete extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            dataSource: [],
            selectedKey: this.props.editor.values['event-location-id'] || ''
        }
    }

    // NOTE: uses a crude hack to include the id with the name
    onInput(input) {
        Typeahead.bloodhoundInstance.search(input,
            (datums) => {
                let items = datums.splice(0,10).map((item) => ({
                    text: item.value,
                    key: item.id,
                    value: (<AutoComplete.Item primaryText={item.value} secondaryText={item.street_address}/>)
                }))

                this.setState({dataSource: items})
            }
        )
    }

    onNewRequest(chosenRequest, index, dataSource) {

        // Set state to update the text field
        this.setState({selectedKey: dataSource[index].key})

        // Do action to save form state to storage
        let obj = { 'event-location-name': chosenRequest }
        obj[this.props.name] = dataSource[index].key
        this.props.dispatch(setData(obj))

        if(typeof this.props.onSelection === 'function') {
            this.props.onSelection(chosenRequest, index, dataSource)
        }
    }

    render() {
        let anchorOrigin = {
          vertical: 'bottom',
          horizontal: 'left'
        }

        let targetOrigin = {
          vertical: 'top',
          horizontal: 'left'
        }

        let labelText = this.props.intl.formatMessage({id:'event-location'})
        if (this.props.editor.values['event-location-name']) {
            labelText += ` (${this.props.editor.values['event-location-name']})`
        }

        return (
            <span>
                <AutoComplete
                    fullWidth={true}
                    showAllItems={true}
                    anchorOrigin={anchorOrigin}
                    targetOrigin={targetOrigin}
                    dataSource={this.state.dataSource}
                    floatingLabelText={labelText}
                    onUpdateInput={(t) => { this.onInput(t) }}
                    onNewRequest={(t,i,d) => { this.onNewRequest(t,i,d) }} />
                <TextField fullWidth={true} value={this.state.selectedKey} disabled={true} required={this.props.required} floatingLabelText={this.props.intl.formatMessage({ id: "event-location-id" })} />
            </span>
        )
    }
}



export default connect((state) =>({
    editor: state.editor
}))(injectIntl(HelAutoComplete))
