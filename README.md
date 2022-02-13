# SurveySays

## Heroku Deployment

## Resources

### Users:

#### Mongoose model:

```js
const User = mongoose.model("User", {
	username: {
		type: String,
		require: true,
		min: 3,
		max: 20,
		unique: true,
	},
	email: {
		type: String,
		require: true,
		min: 5,
		max: 20,
		unique: true,
	},
	password: {
		type: String,
		require: true,
		min: 8,
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

#### Mongoose model:

```js
const Post = mongoose.model("Post", {
	userId: {
		type: String,
		require: true,
	},
	prompt: {
		type: String,
		max: 500,
	},
	title: {
		type: String,
		max: 20,
	},
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

| Name                      | Method | Path                 |
| ------------------------- | ------ | -------------------- |
| Get all users             | GET    | /users               |
| Get one user              | GET    | /users/:id           |
| Create new user           | POST   | /users               |
| Login user                | POST   | /users/login         |
| Update user               | PUT    | /users/:id           |
| Follow user               | PUT    | /users/:id/follow    |
| Unfollow user             | PUT    | /users/:id/unfollow  |
| Delete user               | DELETE | /users/:id           |
| Get all posts             | GET    | /posts               |
| Get all posts (following) | GET    | /posts/following/all |
| Get one post              | GET    | /posts/:id           |
| Create new post           | POST   | /posts               |
| Update post               | PUT    | /posts/:id           |
| Vote Yes on Post          | PUT    | /posts/:id/voteYes   |
| Vote No on Post           | PUT    | /posts/:id/voteNo    |
| Delete post               | DELETE | /posts/:id           |
