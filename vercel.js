module.exports = {
    builds: [
        {
            src: 'app.js',
            use: '@vercel/node'
        }
    ],
    routes: [
        {
            src: '/(.*)',
            dest: '/'
        },
       
    ]
};
