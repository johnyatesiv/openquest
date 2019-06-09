import coreClient from './client'
//const Addons = require('Addons')
import Events from './lib/Events'
//const Characters = require('Characters')

const modules = {

}

const EventMap = {}

Object.keys(modules).forEach(key => {
    Object.keys(modules[key].events).forEach(event => {
        EventMap[event.name] = event.processor
    })
})

Object.keys(EventMap).forEach(key => {
    client.on(key, function(update) {
        EventMap[key].process(update)
    })
})