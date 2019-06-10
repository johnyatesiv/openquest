import core from 'core'

class Base {
    constructor (id, name) {
        this.initialize()
        this.id = id
        this.name = name
    }

    /**
     * Stub method for extending classes to set up their own characteristics
     */
    initialize () {

    }


    /**
     * Processes an instance of Event referencing this object type
     * @param Event
     */
    process (Event) {

    }

    /** Deregisters self from global scope, cannot be the target of Events **/
    removeSelf () {
        delete core.registry[this.id]
    }

    /** Add self as a target to an Event **/
    addLink (Event) {
        Event.target = this.id
    }
}

export default Base