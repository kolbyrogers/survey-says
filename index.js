const cors = require("cors");
const express = require("express");
const model = require("./model");
const bcrypt = require("bcrypt");

const Post = model.Post;
const User = model.User;

const app = express();
const port = process.env.PORT || 8080;

// MIDDLEWARE
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// USERS
// get all users | testing only
app.get("/users", (req, res) => {
	User.find().then((users) => res.json(users));
});
//search for users
app.get("/users/search/:username", async (req, res) => {
	// bad to have verbs in path
	// should change path to use query params
	try {
		const query = { username: new RegExp(req.params.username, "i") };
		const users = await User.find(query);
		if (users.length) {
			res.status(200).json(users);
		} else {
			res.status(404).json("No users found");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});
//get all following
app.get("/following/:id", async (req, res) => {
	try {
		const following = [];
		const user = await User.findById(req.params.id);
		if (user.following) {
			for (const friendId of user.following) {
				const user = await User.findById(friendId);
				following.push(user);
			}
			res.status(200).json(following);
		}
	} catch (err) {
		res.status(500).json(err);
	}
});
// login user
app.post("/users/login", async (req, res) => {
	// bad to use verbs in path...
	try {
		const user = await User.findOne({ email: req.body.email });
		if (!user) {
			res.status(404).send("User not found");
			return;
		}
		const validPassword = await bcrypt.compare(req.body.password, user.password);
		if (!validPassword) {
			res.status(403).send("Invalid Password");
			return;
		}
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
});
// register user
app.post("/users", async (req, res) => {
	try {
		const hashedPassword = await bcrypt.hash(req.body.password, 5);
		const newUser = new User({
			username: req.body.username,
			email: req.body.email,
			password: hashedPassword,
		});
		const user = await newUser.save();
		res.status(201).json(user);
	} catch (err) {
		if (err.code === 11000) {
			res.status(409).json("User already exists");
		} else {
			res.status(500).json(err);
		}
	}
});
//follow a user
app.put("/users/:id/follow", async (req, res) => {
	// bad to have verbs in path
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id);
			const currentUser = await User.findById(req.body.userId);
			if (!user.followers.includes(req.body.userId)) {
				await user.updateOne({ $push: { followers: req.body.userId } });
				await currentUser.updateOne({ $push: { following: req.params.id } });
				res.status(200).json("User followed");
			} else {
				res.status(403).json("You already follow this user");
			}
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		res.status(403).json("Cannot follow yourself");
	}
});
// unfollow a user
app.put("/users/:id/unfollow", async (req, res) => {
	// bad to have verbs in path
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id);
			const currentUser = await User.findById(req.body.userId);
			if (user.followers.includes(req.body.userId)) {
				await user.updateOne({ $pull: { followers: req.body.userId } });
				await currentUser.updateOne({ $pull: { following: req.params.id } });
				res.status(200).json("User unfollowed");
			} else {
				res.status(403).json("You dont follow this user");
			}
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		res.status(403).json("Can not unfollow yourself");
	}
});

// SURVEYS
// get all posts
app.get("/posts", (req, res) => {
	Post.find().then((posts) => res.json(posts));
});
// get all posts (following)
app.get("/posts/following/:id", async (req, res) => {
	try {
		const currentUser = await User.findById(req.params.id);
		const userPosts = await Post.find({ userId: currentUser._id });
		const friendPosts = await Promise.all(
			currentUser.following.map((friendId) => {
				return Post.find({ userId: friendId });
			}),
		);
		res.status(200).json(userPosts.concat(...friendPosts));
	} catch (err) {
		res.status(500).json(err);
	}
});
// create a post
app.post("/posts", async (req, res) => {
	const newPost = new Post(req.body);
	try {
		const savedPost = await newPost.save();
		res.status(201).json("Post created");
	} catch (err) {
		res.status(500).json(err);
	}
});
// update a post
app.put("/posts/:id", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post.userId === req.body.userId) {
			await post.updateOne({ $set: req.body });
			res.status(200).json("Post updated");
		} else {
			res.status(403).json("You can only update your posts");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});
// vote yes
app.put("/posts/:id/voteYes", async (req, res) => {
	// bad to have verbs in path
	try {
		const post = await Post.findById(req.params.id);

		if (post.votesNo.includes(req.body.userId)) {
			await post.updateOne({ $pull: { votesNo: req.body.userId } });
		}
		if (!post.votesYes.includes(req.body.userId)) {
			await post.updateOne({ $push: { votesYes: req.body.userId } });
			res.status(200).json("Voted Yes");
		} else {
			await post.updateOne({ $pull: { votesYes: req.body.userId } });
			res.status(200).json("Voten deleted");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});
// vote no
app.put("/posts/:id/voteNo", async (req, res) => {
	// bad to have verbs in path
	try {
		const post = await Post.findById(req.params.id);

		if (post.votesYes.includes(req.body.userId)) {
			await post.updateOne({ $pull: { votesYes: req.body.userId } });
		}
		if (!post.votesNo.includes(req.body.userId)) {
			await post.updateOne({ $push: { votesNo: req.body.userId } });
			res.status(200).json("Voted No");
		} else {
			await post.updateOne({ $pull: { votesNo: req.body.userId } });
			res.status(200).json("Vote deleted");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});
// delete a post
app.delete("/posts/:id", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post.userId === req.body.userId) {
			await post.deleteOne();
			res.status(200).json("Post deleted");
		} else {
			res.status(403).json("You can delete only your post");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

app.listen(port, () => {
	console.log(`App is listening on port ${port}`);
});
