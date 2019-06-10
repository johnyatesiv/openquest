import coreClient from './coreClient'
import * as Modules from './lib/index'

class Core {
    constructor (coreClient, Modules) {
        this.coreClient = coreClient
        this.Modules = Modules
        this.Registry = {}
        this.EventMap = {}

        Object.keys(this.Modules).forEach(key => {
            Object.keys(this.Modules[key].events).forEach(event => {
                this.EventMap[event.name] = event.processor
            })
        })

        Object.keys(this.EventMap).forEach(key => {
            this.coreClient.on(key, function(update) {
                this.EventMap[key].process(update)
            })
        })
    }

    removeFromRegsitry (id) {
        delete this.Registry[id]
    }
}

const Instance = new Core(coreClient, Modules)