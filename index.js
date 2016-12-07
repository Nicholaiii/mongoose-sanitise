/**
 * mongoose-sanitise
 * MIT Licensed
 * Copyright (c) 2016 Nicholai Nissen
 */

'use strict'

/*
Default options for sanitising
 */
const defaultOptions = ['password', '__v', 'updatedAt', 'createdAt', 'hash', 'salt', 'pwd', 'pass']
const sanitise = require('lodash.unset')

/**
 * Sanitise a mongoose schema! :)
 * @param  {Object} schema  Mongoose Schema
 * @param  {Object} options Options object
 * @return null
 */
const mongooseSanitise = function mongooseSanitise(schema, opts) {
    /* Declare a local options that is defaulting to empty object */
    let options = opts || {}

    /* American friendly language...  */
    if (options.sanitize && !options.sanitise) options.sanitise = options.sanitize
    if (options.desanitize && !options.desanitise) options.desanitise = options.desanitize

    /* Add missing fields */
    if (!options.sanitise) options.sanitise = []
    if (!options.desanitise) options.desanitise = []

    /* Change id to string setting if neccessary */
    let idToString = options.idToString || !0

    /* Add and remove the fields that the user might have specified */
    let fields = [...defaultOptions, ...options.sanitise]
        .filter(e => !options.desanitise.includes(e))

    /* Do the whole magic */
    let transform = function janitor(document) {
        /* Get the vanilla toJSON document */
        var doc = document.toJSON({
            transform: false
        })

        /* Respect idToString settings */
        if (idToString) doc._id = doc._id.toString()
            /* Map fields */
        fields = fields.filter(e => {
            return !sanitise(doc, e) /* and remove them */
        })

        return doc
    }

    schema.set('toJSON', {
        transform
    })
}

module.exports = exports = mongooseSanitise
