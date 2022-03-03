# SurveySays

## Heroku Deployment

### TODO

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
		min: [8, "Password must be at least 8 characters"],
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
	userId: String,
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

### NEED UPDATING

| Name                      | Method | Path                    |
| ------------------------- | ------ | ----------------------- |
| Get all users             | GET    | /users                  |
| Get one user              | GET    | /users/search/:username |
| Get all users (following) | GET    | /following/:id          |
| Login user                | POST   | /users/login            |
| Create new user           | POST   | /users                  |
| Follow user               | PUT    | /users/:id/follow       |
| Unfollow user             | PUT    | /users/:id/unfollow     |
| ------------------------- | ------ | ----------------------- |
| Get all posts             | GET    | /posts                  |
| Get all posts (following) | GET    | /posts/following/all    |
| Create new post           | POST   | /posts                  |
| Update post               | PUT    | /posts/:id              |
| Vote Yes on Post          | PUT    | /posts/:id/voteYes      |
| Vote No on Post           | PUT    | /posts/:id/voteNo       |
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
