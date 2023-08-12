const cloudinary = require('./cloudinary');




const uploadFile = async (file) => {
    const uploadedFile = await cloudinary.uploader.upload(file, {
        folder: "WikiCards"
    })
    if (!uploadedFile) {
        return false;
    }
    return uploadedFile.secure_url;
}

const deleteFile = async (file) => {
    const deletedFile = await cloudinary.uploader.destroy(file);
    if (!deletedFile) {
        return false;
    }
    return true;
}

module.exports = { uploadFile, deleteFile }