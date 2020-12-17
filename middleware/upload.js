const multer = require('multer');

//define storage for images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/images')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    },

})

const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024 * 3,
    },
})

module.exports = upload
