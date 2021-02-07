module.exports = {
    purge: [],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            maxWidth: {
                'order-image': '70px'
            },
            height: {
                'full-content': 'calc(100% - 64px)',
                'full-container': 'calc(100% - 64px - 2.5rem)'
            },
            minHeight: {
                'full-content': 'calc(100% - 64px)'
            },
            width: {
                400: '400px'
            }
        }
    },
    variants: {
        extend: {}
    },
    plugins: []
}
