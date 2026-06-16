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
      
    } else if (err) {
     
    }

  })
})


>>> we can use kill_port.bat to kill the port , if cmd said ki port is occupied


// Aggregation Pipeline ->>>  for calculation

[
  {
    $lookup: {
      from: "Gaurav",
      localField: "Gaurav_id",
      foreignField: "_id",
      as: "author_details"
    }
    },
  {
    $addFields: {
      author_details:{
        $arrayElemAt:["$author_details" , 0]
      }
    }
  }
  
]

// as there is no field like this so its emopty test array


Aggregation Pipeline ko simple language mein samjho:

👉 MongoDB data ko step-by-step process karne ka tareeka hai.

Jaise school mein attendance sheet hai:

Gaurav   21
Rahul    18
Aman     22

Ab tum chahte ho:

Sirf 20+ age wale students nikalo.
Unka naam dikhao.
Age ke according sort karo.

To MongoDB ye kaam stages mein karega:

[
  { $match: { age: { $gte: 20 } } }, // filter
  { $project: { username: 1 } },      // select fields
  { $sort: { age: -1 } }              // sort
]

Ye stages milkar Aggregation Pipeline kehlati hain.

Real Life Example

Socho tum Swiggy ho.

Sab orders aaye:

Order 1 - Delivered
Order 2 - Pending
Order 3 - Delivered

Ab tum chahte ho:

Step 1 → Sirf Delivered orders
Step 2 → Total count karo
Step 3 → Revenue nikalo

Ye pura process = Aggregation Pipeline.

Easy Formula
Data
 ↓
Filter ($match)
 ↓
Join ($lookup)
 ↓
Select ($project)
 ↓
Sort ($sort)
 ↓
Final Result
Interview Definition

Aggregation Pipeline is a framework in MongoDB that processes documents through multiple stages to filter, transform, group, join, and analyze data.

Bas yaad rakho:

Normal find() data laata hai.

aggregate() data ko process karke intelligent result laata hai. 🚀


>>>>>>>>>>>>>>>>>>>>>>>>>>>>Article opn Aggreagation pipeline

// # User Channel Profile Aggregation Pipeline

// ## Overview

// The `getUserChannelProfile` controller fetches a channel's public profile along with subscriber statistics using MongoDB Aggregation Pipeline. It combines user data with subscription data and calculates useful metrics such as subscriber count, channels subscribed to, and whether the current user is subscribed.

// ---

// ## Step 1: Extract Username

// ```js
// const { username } = req.params;
// ```

// The username is extracted from the URL parameters.

// Example:

// ```http
// GET /api/v1/users/channel/gaurav_0077
// ```

// Here, `gaurav_0077` becomes the username.

// ---

// ## Step 2: Validate Username

// ```js
// if (!username?.trim()) {
//     throw new ApiError(400, "Username is missing");
// }
// ```

// Checks whether a valid username was provided. If not, an error is returned.

// ---

// ## Step 3: Find the User

// ```js
// {
//     $match: {
//         username: username?.toLowerCase()
//     }
// }
// ```

// The `$match` stage filters the users collection and finds the channel whose username matches the requested username.

// ---

// ## Step 4: Fetch Subscribers

// ```js
// {
//     $lookup: {
//         from: "subscription",
//         localField: "_id",
//         foreignField: "channel",
//         as: "subscribers"
//     }
// }
// ```

// Joins the subscriptions collection and retrieves all users who have subscribed to this channel.

// Result:

// ```js
// subscribers: [...]
// ```

// ---

// ## Step 5: Fetch Channels Subscribed By This User

// ```js
// {
//     $lookup: {
//         from: "subscription",
//         localField: "_id",
//         foreignField: "subscriber",
//         as: "subscribedTo"
//     }
// }
// ```

// Retrieves all channels that this user has subscribed to.

// Result:

// ```js
// subscribedTo: [...]
// ```

// ---

// ## Step 6: Calculate Statistics

// ```js
// {
//     $addFields: {
//         subscribersCount: {
//             $size: "$subscribers"
//         },
//         channelSubscribedToCount: {
//             $size: "$subscribedTo"
//         }
//     }
// }
// ```

// Adds computed fields:

// * `subscribersCount` → Total number of subscribers.
// * `channelSubscribedToCount` → Total channels this user follows.

// ---

// ## Step 7: Check Subscription Status

// ```js
// isSubscribed: {
//     $cond: {
//         if: {
//             $in: [req.user?._id, "$subscribers.subscriber"]
//         },
//         then: true,
//         else: false
//     }
// }
// ```

// Determines whether the currently logged-in user is subscribed to the requested channel.

// Returns:

// ```js
// true
// ```

// or

// ```js
// false
// ```

// ---

// ## Step 8: Return Only Required Fields

// ```js
// {
//     $project: {
//         fullname: 1,
//         username: 1,
//         subscribersCount: 1,
//         channelSubscribedToCount: 1,
//         isSubscribed: 1,
//         avatar: 1,
//         coverImage: 1,
//         email: 1
//     }
// }
// ```

// The `$project` stage filters the output and returns only the required profile information.

// ---

// ## Step 9: Handle Missing Channel

// ```js
// if (!channel?.length) {
//     throw new ApiError(404, "Channel doesn't exist");
// }
// ```

// Since aggregation returns an array, this check ensures that a matching channel was found.

// ---

// ## Step 10: Send Response

// ```js
// return res.status(200).json(
//     new ApiResponse(
//         200,
//         channel[0],
//         "User channel fetched successfully"
//     )
// );
// ```

// Returns the channel profile data along with subscriber statistics and subscription status.

// ---

// ## Final Response Example

// ```json
// {
//   "fullname": "Gaurav Sharma",
//   "username": "gaurav_0077",
//   "subscribersCount": 125,
//   "channelSubscribedToCount": 42,
//   "isSubscribed": true,
//   "avatar": "avatar_url",
//   "coverImage": "cover_url",
//   "email": "gaurav@gmail.com"
// }
// ```

// This aggregation pipeline efficiently combines multiple database operations into a single query, reducing server load and improving performance.



>> we get id in the form of string but in code we directly use find by id and all that  because mongoose will be handling all this id ad other in thing in the backend

>>so we dont need to pass the coplete string in the code 




watchHistory->>>

# Watch History Aggregation Pipeline

## Overview

This API fetches the watch history of the currently logged-in user. It also retrieves information about the owner (creator) of each video using a nested MongoDB aggregation pipeline.

---

## Controller Function

```js
const getWatchHistory = asyncHandler(async(req , res) => {
```

* `asyncHandler` is used to automatically catch errors from async functions.
* This function runs whenever the watch history endpoint is called.

---

## Step 1: Start Aggregation on User Collection

```js
const user = await User.aggregate([
```

* `aggregate()` is used when we need advanced database operations.
* It allows us to filter, join collections, transform data, and calculate values.

---

## Step 2: Find Current User

```js
{
    $match: {
        _id: new mongoose.Types.ObjectId(req.user._id)
    }
}
```

### What happens here?

* `req.user._id` comes from the JWT authentication middleware.
* MongoDB stores IDs as `ObjectId`.
* Therefore we convert the string ID into a MongoDB ObjectId.

Example:

```js
"6862a0209ade676428caa0c6"
```

becomes

```js
ObjectId("6862a0209ade676428caa0c6")
```

Only the logged-in user's document is selected.

---

## Step 3: Fetch Watch History Videos

```js
{
    $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory"
    }
}
```

### Purpose

The User collection only stores video IDs:

```js
watchHistory: [
    ObjectId("video1"),
    ObjectId("video2")
]
```

Using `$lookup`, MongoDB replaces those IDs with complete video documents.

---

## Step 4: Nested Lookup for Video Owner

```js
pipeline: [
    {
        $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner"
        }
    }
]
```

### Why?

Each video contains:

```js
{
    title: "MongoDB Tutorial",
    owner: ObjectId("123")
}
```

We want complete owner information instead of only the owner's ID.

MongoDB joins the Videos collection with the Users collection and fetches the owner's details.

---

## Step 5: Select Only Required Owner Fields

```js
{
    $project: {
        fullName: 1,
        username: 1,
        avatar: 1
    }
}
```

Instead of returning the entire user document, only important fields are returned:

* Full Name
* Username
* Avatar

This improves performance and security.

---

## Step 6: Convert Owner Array to Object

```js
{
    $addFields: {
        owner: {
            $first: "$owner"
        }
    }
}
```

### Why?

After `$lookup`, MongoDB returns:

```js
owner: [
    {
        fullName: "Gaurav Sharma",
        username: "gaurav_0077"
    }
]
```

Since every video has only one owner, we convert the array into a single object:

```js
owner: {
    fullName: "Gaurav Sharma",
    username: "gaurav_0077"
}
```

This makes the response cleaner and easier to use on the frontend.

---

## Step 7: Send Response

```js
return res
.status(200)
.json(
    new ApiResponse(
        200,
        user[0].watchHistory,
        "Watch history fetched successfully"
    )
)
```

### What happens?

* HTTP status code `200` indicates success.
* Watch history data is sent to the client.
* A success message is included.

---

## Final Flow

```text
User
 ↓
Find Logged-in User
 ↓
Get Watch History Video IDs
 ↓
Fetch Complete Video Documents
 ↓
Fetch Owner Details For Each Video
 ↓
Keep Only Required Owner Fields
 ↓
Return Watch History Response
```

---

## Example Response

```json
[
  {
    "_id": "video123",
    "title": "MongoDB Aggregation Tutorial",
    "owner": {
      "fullName": "Gaurav Sharma",
      "username": "gaurav_0077",
      "avatar": "avatar_url"
    }
  }
]
```

This aggregation pipeline demonstrates how MongoDB can perform multiple operations (filtering, joining collections, selecting fields, and transforming data) in a single database query.

