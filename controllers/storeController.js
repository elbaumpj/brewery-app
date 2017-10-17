const mongoose = require('mongoose'); 
const Store = mongoose.model('Store');  
const multer = require('multer'); 
const jimp = require('jimp'); 
const uuid = require('uuid'); 

const multerOptions = {
    storage: multer.memoryStorage(), 
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/'); 
        if(isPhoto) {
            next(null, true);
        } else {
            next({message: 'That file type is not allowed!'}, false); 
        }
    }
}; 

exports.homePage = (req, res) => {
    //console.log(req.name); 
   
    res.render('index'); 
};

exports.addStore = (req, res) => {
    res.render('editStore', {title: 'Add Store'}); 
}

exports.upload = multer(multerOptions).single('photo'); 

exports.resize = async (req, res, next) => {

    //check if there's no new file to resize 
    if(!req.file) {
        next(); 
        return; 
    }
    const extension = req.file.mimetype.split('/')[1]; 
    req.body.photo = `${uuid.v4()}.${extension}`; 
    //resize
    const photo = await jimp.read(req.file.buffer); 
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`); 

    //keep going after saving to db
    next(); 
}; 

exports.createStore = async (req, res) => {
    const store = await (new Store(req.body)).save();  
    req.flash('success', `Successfully created ${store.name}. Care to leave a reveiew?`)
    res.redirect(`/store/${store.slug}`); 
}; 

exports.getStores = async (req, res) => {
    const stores = await Store.find(); 
    res.render('stores', {title: 'Stores', stores}); 
}; 

exports.editStore = async (req, res) => {
    //1. find store given id
    const store = await Store.findOne({ _id: req.params.id }); 
    //2. confirm they are owner of store

    //3. render out edit form so user can update their store
    res.render('editStore', {title: `Edit ${store.name}`, store }); 
}; 

exports.updateStore = async (req, res) => {
    //set the location data to be a point
    req.body.location.type = 'Point';   
    //1. find and update store
    const store = await Store.findOneAndUpdate({_id: req.params.id}, req.body, {
        new: true, 
        runValidators: true
    }).exec();
    req.flash('success', `Successfully updated <strong>${store.name}</strong>.`)
    res.redirect(`/stores/${store._id}/edit`); 

    //2. redirect user to store and tell them it worked 
}; 

exports.getStoreBySlug = async (req, res, next) => {
    const store = await Store.findOne({ slug: req.params.slug}); 
    if(!store) return next(); 
    res.render('store', {store, title: store.name}); 
}; 

exports.getStoresByTag = async (req, res) => {
    const tags = await Store.getTagsList(); 
    const tag = req.params.tag; 
    res.render('tag', { tags, title: 'Tags', tag}) 
}; 