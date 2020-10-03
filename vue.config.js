module.exports = {
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                productName: "devtext",
                appId: "com.stabo.devtext",
                win: {
                    icon: 'src/assets/app.ico',
                    target: [
                        {
                            target: 'zip', // 'zip', 'nsis', 'portable'
                            arch: ['x64'] // 'x64', 'ia32'
                        }
                    ]
                }
            }
        }
    }
}
