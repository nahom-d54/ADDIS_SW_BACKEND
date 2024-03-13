const express = require("express")
const Music = require("../../models/music")
const Genre = require("../../models/genre")
const protect = require('../../middlewares/protect')
const multer = require("multer")
const mm = require('music-metadata');

const musicRoute = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/musics'); // Specify the directory where uploaded files will be stored
    },
    filename: function (req, file, cb) {
      const fileName = `${Math.random().toString(36).substring(2, 8)}_${new Date().getTime().toString()}`+ '.' + file.originalname.substr(file.originalname.lastIndexOf('.') + 1);
      cb(null, fileName ); // Use the original file name as the uploaded file name
    },
  });
const upload = multer({ storage, 
    limits: {
        fileSize: 1024 * 1024 * 10, // 10MB
  }, 
});

musicRoute.get('/musics',async (req, res) => {
    const page = parseInt(req.query._page) || 1;
    const musicsPerPage = parseInt(req.query._per_page) || process.env.DEFAULT_PAGE_LIMIT || 10;
    const offset = (page - 1) * musicsPerPage;
    try {
        const totalMusics = await Music.countDocuments();
        const totalPages = Math.ceil(totalMusics / musicsPerPage);
        
        const musics = await Music.find().skip(offset).limit(musicsPerPage).populate('genre').exec()
        
        const responseFormat = {
            first: 1,
            prev: page > 1 ? page - 1 : null,
            next: page < totalPages ? page + 1 : null,
            last: page === totalPages ? page : totalPages,
            pages: totalPages,
            items: totalMusics,
            data: musics
        };
        
        res.json(responseFormat)

    }catch ( e ) {
        res.send(e)
    }
})
musicRoute.get('/musics/:id',async (req, res) => {
    const id = req.params.id
    try {
        const music = await Music.findOne({_id: id}).populate('genre').exec()
        res.json(music)

    }catch ( e ) {
        res.send(e)
    }
})

musicRoute.patch('/musics/:id', protect , async (req, res) => {
    const id = req.params.id
    try {

        const music = await Music.findOneAndUpdate({_id: id, owner: req.user._id}, req.body, { new: true }).populate('genre').exec()
        res.json(music)

    }catch ( e ) {
        res.send(e)
    }

})
musicRoute.delete('/musics/:id',protect, async (req, res) => {
    const id = req.params.id
    try {
        const music = await Music.findOneAndDelete({_id: id}).populate('genre').exec()
        res.json(music)

    }catch ( e ) {
        res.send(e)
    }

})
musicRoute.post('/musics', protect,upload.single('music_file'), async (req, res) => {
    try {
        const metadata = await mm.parseFile(req.file.path,{duration: true})
        
	const {_id,...body} = req.body
        const music = new Music(body)
        music.owner = req.user._id
        music.genre = req.body.genre ? req.body.genre : '65eeba7cc053fbbe4b9a65dc'
        music.path = `/${req.file.destination}/${req.file.filename}`
        music.mimetype = req.file.mimetype
        music.duration = Math.floor(metadata.format.duration)

        const invalidMusic = await music.validate()
        if(invalidMusic){
            throw new Error("Invalid music format given !")
        }
        const saveMusic = await music.save()
	const savedMusic = await Music.findOne({_id: saveMusic._id}).populate('genre').exec()
        res.json(savedMusic)

    }catch ( e ) {
        res.send(e)
    }

})
musicRoute.get('/genres', async (req, res) => {
    try {
        const allGenre = await Genre.find()
        res.json(allGenre)
    }catch(err){
        res.status(500).send(err)
    }
})

musicRoute.get('/download/:fileId', async (req, res) => {
  
  const fileName = 'custom-filename.ext';
  try {
        const music = await Music.findOne({_id: fileId})
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  	res.sendFile(music.path);

    }catch ( e ) {
        res.send(e)
    }


  
});

module.exports = musicRoute