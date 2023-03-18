// Creating configuration to tell jest that extension .test.ts will be used for integration tests
const config = require('./jest.config.ts')
config.testMatch = ['**/*.test.ts']
module.exports = config
