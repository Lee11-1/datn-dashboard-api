/* eslint-disable no-underscore-dangle */
/* eslint-disable import/order */
const moment = require('moment')
const _ = require('lodash')

function tryParseJson(params) {
    if (params && Array.isArray(params)) {
        return params.map(tryParseJson)
    }
    if (params && typeof params === 'object') {
        Object.keys(params).forEach(key => {
            params[key] = tryParseJson(params[key])
        })

        return params
    }

    let tempVal
    try {
        tempVal = JSON.parse(params)
    } catch (error) {
        tempVal = params
    }

    return tempVal
}

function tryMergeLog(logs) {
    let log = logs
        .map(x => x.log_processed)
        .filter(i => i && (i.sid || i.lid || i.src))

    if (!(log && log.length > 0)) {
        log = logs.filter(i => i.sid || i.lid || i.src)
    }
    const beautyLog = log.filter(i => !i.__CID)
    const logNeedToMerge = log.filter(i => i.__CID)
    const mergeLog = _(logNeedToMerge)
        .groupBy('__CID')
        .map(i => {
            const tmp = _.sortBy(i, '__CIDX')
            const toReturn = tmp[0]
            toReturn.msg = tmp.map(t => t.msg).join('')

            return toReturn
        })
        .value()

    return _([...beautyLog, ...mergeLog])
        .map(logItem => {
            const { msg } = logItem
            logItem.time = moment(logItem.time).format(
                'YYYY-MM-DD HH:mm:ss.SSS'
            )
            if (!msg) {
                const groupLog = []
                const req = logItem.request
                const res = logItem.response
                const { response } = logItem
                delete logItem.request
                delete logItem.response
                if (req) {
                    groupLog.push({
                        msg: req,
                        metadata: logItem
                    })
                }
                if (res) {
                    groupLog.push({
                        msg: response,
                        metadata: {
                            ...logItem,
                            metric:
                                logItem.metric &&
                                logItem.metric.replace('request', 'response')
                        }
                    })
                }

                return groupLog
            }
            delete logItem.msg

            return {
                msg,
                metadata: logItem
            }
        })
        .filter(i => i.msg || i.length === 2)
        .flatten()
        .value()
}

module.exports = {
    tryParseJson,
    tryMergeLog
}
