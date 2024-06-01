  const epayco = require('epayco-sdk-node')({
    apiKey: '0db9fdb7fdef593fc398efc8439ea9bc',
    privateKey: '2c9deeff0f07551d5e76631236463622',
    lang: 'ES',
    test: true // Cambia a false para producción
});

module.exports = epayco;
