const removeExtension = (filename) => {
    return filename.split('.').shift();
}

const getExtension = (filename) =>{
    return  filename.split('.').at(-1);
}
module.exports = {removeExtension, getExtension}