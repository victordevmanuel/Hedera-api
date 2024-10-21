module.exports = {
    builds: [
        {
            src: './index.js',
            use: '@vercel/node'
        }
    ],
    routes: [
        {
            src: '/api/(.*)',
            dest: '/api'
        },
        {
            src: '/(.*)',
            dest: '/'
        }
    ]
};
