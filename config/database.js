if (process.env.NODE_ENV == 'production'){
    modeule.exports = {
        mongoURI: "mongodb://Admin:admin@ds117888.mlab.com:17888/quickjot-prod"
    }
} else {
    module.exports = {
        mongoURI: "mongodb://localhost/quickjot-dev"
    }
}