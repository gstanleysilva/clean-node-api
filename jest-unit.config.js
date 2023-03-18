// Creating configuration to tell jest that extension .spec.ts will be used for unit tests
const config = require('./jest.config.ts')
config.testMatch = ['**/*.spec.ts']
module.exports = config
