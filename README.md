# SurveySays

## Heroku Deployment

### https://survey-says-4200.herokuapp.com/

## Resources

### Users:

```js
const User = mongoose.model("User", {
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: [8, "Password must be more than 8 characters"],
  },
  followers: {
    type: Array,
    default: [],
  },
  following: {
    type: Array,
    default: [],
  },
});
```

### Posts:

```js
const Post = mongoose.model("Post", {
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  author: String,
  prompt: String,
  title: String,
  votesYes: {
    type: Array,
    default: [],
  },
  votesNo: {
    type: Array,
    default: [],
  },
});
```

## REST Endpoints

| Name                      | Method | Path                    |
| ------------------------- | ------ | ----------------------- |
| Get all users             | GET    | /users                  |
| Get users by search       | GET    | /users/:username |
| Get all users (following) | GET    | /friends                |
| Login user                | POST   | /sessions               |
| Get Session (user)        | GET    | /session                |
| Logout                    | DELETE | /session                |
| Create new user           | POST   | /users                  |
| Follow user               | PUT    | /friends/:id            |
| Unfollow user             | PUT    | /unfriends/:id          |
| ------------------------- | ------ | ----------------------- |
| Get all posts             | GET    | /posts                  |
| Get all posts (following) | GET    | /posts/following        |
| Create new post           | POST   | /posts                  |
| Update post               | PUT    | /posts/:id              |
| Vote Yes on Post          | PUT    | /posts/:id/votesYes     |
| Vote No on Post           | PUT    | /posts/:id/votesNo      |
| Delete post               | DELETE | /posts/:id              |

## Password Hashing

```js
// salt and hash password
const hashedPassword = await bcrypt.hash(req.body.password, 5);
// create new user
const newUser = new User({
  username: req.body.username,
  email: req.body.email,
  password: hashedPassword,
});
```
## Prototype

### https://www.figma.com/file/MjTfOjQ6Nz8YsibVyuYyBv/Untitled?node-id=0%3A1
