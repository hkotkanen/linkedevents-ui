import constants from '../constants'
import fetch from 'isomorphic-fetch'

function makeRequest(query, startDate, endDate) {
    var url = `${appSettings.api_base}/event/?text=${query}`

    if (startDate) {
        url += `&start=${startDate.format('YYYY-MM-DD')}`
    }
    if (endDate) {
        url += `&end=${endDate.format('YYYY-MM-DD')}`
    }

    return fetch(url).then(function(response) {
        if (response.status >= 400) {
            return {
                apiErrorMsg: 'API error from server'
            }
        }
        return response.json()
    })
}

export function receiveEvents(json) {
    if(json.apiErrorMsg) {
        return {
            type: constants.RECEIVE_EVENTS_ERROR,
            apiErrorMsg: json.apiErrorMsg,
            items: []
        }
    }
    else {
        return {
            type: constants.RECEIVE_EVENTS,
            items: json.data,
            receivedAt: Date.now()
        }
    }
}

// NOTE: Server should always return either json, or nothing (on failed connection)
export function fetchEvents(query, startDate, endDate) {
    return (dispatch) => {
        return makeRequest(query, startDate, endDate)
            .then(json => dispatch(receiveEvents(json)))
    }
}
