module.exports = {
    builds: [
        {
            src: 'app.js',
            use: '@vercel/node'
        }
    ],
    routes: [
        {
            src: '/api/(.*)',
            dest: '/api/index.js'
        },
        {
            src: '/(.*)',
            dest: '/app.js'
        }
    ]
};
