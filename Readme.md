# first backend project with javascript

-[Model link](https://app.eraser.io/workspace/RC7xPjUR2FePWlvwE8Kk?origin=share)


<!-- // MULTER DOCUMENTRY -->

Mulberries

Multer is a Node.js middleware for data management multipart/form-data, primarily used for uploading files. It is written on top of Busboy for maximum efficiency.

NOTE : Multer will not process any form that is not a multipart ( multipart/form-data).


Installation

$ npm install --save multer
npm i multer


Usage

Multer adds an object body and an object file or files to the object request. The object bodycontains the values ​​of the text fields of the form, the object fileor filescontains the files uploaded via the form.

Example of basic use:

Don't forget to include it enctype="multipart/form-data"in your form.

<form action="/profile" method="post" enctype="multipart/form-data">
  <input type="file" name="avatar" />
</form>
const express = require('express')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const app = express()

app.post('/profile', upload.single('avatar'), function (req, res, next) {
  // req.file est le fichier `avatar`
  // req.body contiendra les champs de texte, s'il y en avait
})


app.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
  // req.files est un tableau de fichiers "photos"
  // req.body contiendra les champs de texte, s'il y en avait
})


const uploadMiddleware = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])
app.post('/cool-profile', uploadMiddleware, function (req, res, next) {
  // req.files est un objet (String -> Array) où fieldname est la clé et la valeur est un tableau de fichiers
  //
  // e.g.
  //  req.files['avatar'][0] -> Fichier
  //  req.files['gallery'] -> Tableau
  //
  // req.body contiendra les champs de texte, s'il y en avait
})
If you need to manage a multi-part form with only text, you must use the following method .none():

const express = require('express')
const app = express()
const multer  = require('multer')
const upload = multer()

app.post('/profile', upload.none(), function (req, res, next) {
  // req.body contiens les champs de text
})

Here is an example of using Multer in an HTML form. Pay particular attention to the fields enctype="multipart/form-data"and name="uploaded_file":

<form action="/stats" enctype="multipart/form-data" method="post">
  <div class="form-group">
    <input type="file" class="form-control-file" name="uploaded_file">
    <input type="text" class="form-control" placeholder="Number of speakers" name="nspeakers">
    <input type="submit" value="Get me the stats!" class="btn btn-default">
  </div>
</form>
Next, in your JavaScript file, you'll add these lines to access both the file and the body. It's important that you use the value of the nameform field in your download function. This tells Multer which field in the request to look for the files. If these fields aren't the same in the HTML form and on your server, your download will fail.

const multer  = require('multer')
const upload = multer({ dest: './public/data/uploads/' })
app.post('/stats', upload.single('uploaded_file'), function (req, res) {
  // req.file est le nom de votre fichier dans le formulaire ci-dessus, ici 'uploaded_file'
  // req.body contiendra les champs de texte, s'il y en avait
  console.log(req.file, req.body)
});


In an average web application, only one destmay be required and configured as shown in the following example.

const upload = multer({ dest: 'uploads/' })
If you want more control over your downloads, you'll want to use the `--download` storage option instead of ` dest--download`. Multer comes with storage engines DiskStorage and MemoryStorage`--download`; other engines are available from third parties.

.single(fieldname)
Accept a single file with the name fieldname. The single file will be stored in req.file.

.array(fieldname[, maxCount])
Accept an array of files, all with the name fieldname. An error may occur if more maxCountfiles are uploaded. The array of files will be stored in req.files.

.fields(fields)
Accepts a mix of files, specified by fields. An object with arrays of files will be stored in req.files.

fieldsmust be an array of objects with nameand possibly a maxCount. Example:

[
  { name: 'avatar', maxCount: 1 },
  { name: 'gallery', maxCount: 8 }
]
.none()
Only accept text fields. If a file upload is attempted, an error with the code "LIMIT_UNEXPECTED_FILE" will be issued.

.any()
Accepts all files that arrive on the feed. An array of files will be stored in req.files.

WARNING: Always ensure you manage the files a user downloads. Never add multer as a global middleware, as a malicious user could download files to an unintended route. Only use this feature on routes where you manage downloaded files.


% DiskStorage->>>>>>>>>>>..

The disk storage engine gives you total control over file storage on the disk.

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp/my-uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })
There are two options available, destinationand filename. They are both functions that determine where the file should be stored.

destinationis used to determine which folder should store downloaded files. This can also be given as a value string(for example, `/dev/save/files` '/tmp/uploads'). Otherwise destination, the operating system's default directory is used for temporary files.

Note: You are responsible for creating the directory when you provide it destinationas a function. When passing a string, multer will ensure the directory is created for you.

filenameis used to determine the file name in the folder. If no "file name" is given, each file will receive a random name that does not include a file extension.

Note: Multer will not add any file extensions for you; your function must return a full filename with a file extension.

Each function receives both the request ( req) and information about the case ( file) to help with the decision.

Note that req.bodythis may not have been fully completed yet. This depends on the order in which the client transmits the fields and files to the server.

To understand the calling convention used in the callback (the need to pass null as the first parameter), refer to Node.js error handling

MemoryStorage
The in-memory storage engine stores files in memory as objects Buffer. It has no options.

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
When using in-memory storage, the file information will contain a field called bufferwhich contains the entire file.

WARNING : Downloading very large files or relatively small files in large numbers very quickly may cause your application to run out of memory when in-memory storage is used.

limits
An object specifying the size limits of the following optional properties. Multer passes this object directly into busboy, and details of the properties can be found on the busboy page .

The following integer values ​​are available:


fileFilter
Define this in a function to control which files should be downloaded and which should be ignored. The function should look like this:

function fileFilter (req, file, cb) {

  // La fonction doit appeler `cb` avec un booléen
  // pour indiquer si le fichier doit être accepté

  // Pour rejeter ce fichier, passez `false`, comme ceci:
  cb(null, false)

  // Pour accepter le fichier, passez `true`, comme ceci:
  cb(null, true)

  // Vous pouvez toujours passer une erreur si quelque chose ne va pas:
  cb(new Error('I don\'t have a clue!'))

}
Error Handling
In case of an error, Multer will delegate the error to Express. You can display a nice error page using the standard Express method .

If you want to detect errors specifically from Multer, you can call the middleware function yourself. Alternatively, if you only want to catch Multer errors , you can use the class MulterErrorthat is attached to the object multeritself (for example err instanceof multer.MulterError).

const multer = require('multer')
const upload = multer().single('avatar')

app.post('/profile', function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Une erreur Multer s'est produite lors du téléchargement.
    } else if (err) {
      // Une erreur inconnue s'est produite lors du téléchargement.
    }

    // Tout s'est bien passé.
  })
})