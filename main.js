const {
    WAConnection,
    MessageType,
    Presence,
    Mimetype,
    GroupSettingChange
} = require('@adiwajshing/baileys')
const fs = require('fs')
const { banner, start, success } = require('./lib/functions')
const { color } = require('./lib/color')

require('./index.js')
nocache('./index.js', module => console.log(`${module} is now updated!`))

const starts = async (fxsx = new WAConnection()) => {
    fxsx.logger.level = 'warn'
    console.log(banner.string)
    fxsx.on('qr', () => {
        console.log(color('[','white'), color('!','red'), color(']','white'), color(' Scan Kak'))
    })

    fs.existsSync('./session.json') && fxsx.loadAuthInfo('./session.json')
    fxsx.on('connecting', () => {
        start('2', 'Connecting...')
    })
    fxsx.on('open', () => {
        success('2', 'Connected')
    })
    await fxsx.connect({timeoutMs: 30*1000})
        fs.writeFileSync('./session.json', JSON.stringify(fxsx.base64EncodedAuthInfo(), null, '\t'))

    fxsx.on('chat-update', async (message) => {
        require('./index.js')(fxsx, message)
    })
}

/**
 * Uncache if there is file change
 * @param {string} module Module name or path
 * @param {function} cb <optional> 
 */
function nocache(module, cb = () => { }) {
    console.log('Module', `'${module}'`, 'is now being watched for changes')
    fs.watchFile(require.resolve(module), async () => {
        await uncache(require.resolve(module))
        cb(module)
    })
}

/**
 * Uncache a module
 * @param {string} module Module name or path
 */
function uncache(module = '.') {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(module)]
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}

starts()
