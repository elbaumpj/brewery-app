const mongoose = require('mongoose'); 
const Store = mongoose.model('Store');  


exports.homePage = (req, res) => {
    //console.log(req.name); 
   
    res.render('index'); 
};

exports.addStore = (req, res) => {
    res.render('editStore', {title: 'Add Store'}); 
}

exports.createStore = async (req, res) => {
    const store = await (new Store(req.body)).save();  
    req.flash('success', `Successfully created ${store.name}. Care to leave a reveiew?`)
    res.redirect(`/store/${store.slug}`); 
}

exports.getStores = async (req, res) => {
    const stores = await Store.find(); 
    res.render('stores', {title: 'Stores', stores}); 
}

exports.editStore = async (req, res) => {
    //1. find store given id
    const store = await Store.findOne({ _id: req.params.id }); 
    //2. confirm they are owner of store

    //3. render out edit form so user can update their store
    res.render('editStore', {title: `Edit ${store.name}`, store }); 
}

exports.updateStore = async (req, res) => {
    //1. find and update store
    const store = await Store.findOneAndUpdate({_id: req.params.id}, req.body, {
        new: true, 
        runValidators: true
    }).exec();
    req.flash('success', `Successfully updated <strong>${store.name}</strong>.`)
    res.redirect(`/stores/${store._id}/edit`); 

    //2. redirect user to store and tell them it worked 
}