module.exports = {
    purge: [],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            maxWidth: {
                'order-image': '70px'
            },
            height: {
                'full-content': 'calc(100% - 64px)'
            },
            minHeight: {
                'full-content': 'calc(100% - 64px)'
            }
        }
    },
    variants: {
        extend: {}
    },
    plugins: []
}
