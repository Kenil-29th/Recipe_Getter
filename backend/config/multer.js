const multer = require('multer');//handles file upload
const path = require('path');//works with file path safely
const fs = require('fs');//file system operation(create folder,check existence)

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');//check for the folder to store the file if not exist then it create it
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({//tell to store on the server not in memory
  destination: (req, file, cb) => {//where the files is going to be store
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {//create a unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `recipe-${uniqueSuffix}${ext}`);
  },//prevent file overrite ,keeps file unique even if name are same
});

const fileFilter = (req, file, cb) => {//check for the file type reject if the file type is not match with the given below
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const isValidExt = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const isValidMime = allowedTypes.test(file.mimetype);//extension can be fake MIME type check for the file content

  if (isValidExt && isValidMime) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed'), false);
  }
};

const upload = multer({//multer limit for the file size
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

module.exports = upload;// make this availabe to import