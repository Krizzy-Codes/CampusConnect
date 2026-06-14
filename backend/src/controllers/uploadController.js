const cloudinary = require('../cloudinary');

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }

    // Buffer ko base64 mein convert karo
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    // Cloudinary pe upload karo
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'campusconnect',
      transformation: [{ width: 800, quality: 'auto' }]
    });

    res.json({
      message: 'Image uploaded!',
      imageUrl: result.secure_url
    });

  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};

module.exports = { uploadImage };