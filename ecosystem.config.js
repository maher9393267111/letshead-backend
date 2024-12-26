module.exports = {
    apps: [{
        name: "letsheat", script: "./server.js", exec_mode: 'cluster', instances: 'max',
    }]
}