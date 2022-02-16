const cors = require("cors");
const express = require("express");
const model = require("./model");
const bcrypt = require("bcrypt");

const Post = model.Post;
const User = model.User;

const app = express();
const port = 8080;

// MIDDLEWARE
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// USERS //////////////////////////////////////////////////////////////////////
// get all users
app.get("/users", (req, res) => {
	User.find().then((users) => res.json(users));
});
// login user
app.post("/users/login", async (req, res) => {
	try {
		// check if email exists
		const user = await User.findOne({ email: req.body.email });
		!user && res.status(404).send("User not found");
		// check if password is valid
		const validPassword = await bcrypt.compare(req.body.password, user.password);
		!validPassword && res.status(400).send("Invalid Password");
		// send user
		res.status(200).json(user);
		console.log("Login successful.");
	} catch (err) {
		res.status(500);
	}
});
// register user
app.post("/users", async (req, res) => {
	try {
		// salt and hash password
		const salt = await bcrypt.genSalt(5);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);
		// create new user
		const newUser = new User({
			username: req.body.username,
			email: req.body.email,
			password: hashedPassword,
		});
		// save user and respond
		const user = await newUser.save();
		console.log("User created.");
		res.status(201).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
});

// update user
app.put("/users/:id", async (req, res) => {
	if (req.body.userId === req.params.id) {
		if (req.body.password) {
			try {
				const salt = await bcrypt.genSalt(10);
				req.body.password = await bcrypt.hash(req.body.password, salt);
			} catch (err) {
				return res.status(500).json(err);
			}
		}
		try {
			const user = await User.findByIdAndUpdate(req.params.id, {
				$set: req.body,
			});
			res.status(200).json("Account has been updated");
		} catch (err) {
			return res.status(500).json(err);
		}
	} else {
		return res.status(403).json("You can only update your account!");
	}
});

//delete user
app.delete("/users/:id", async (req, res) => {
	if (req.body.userId === req.params.id || req.body.isAdmin) {
		try {
			await User.findByIdAndDelete(req.params.id);
			res.status(200).json("Account has been deleted");
		} catch (err) {
			return res.status(500).json(err);
		}
	} else {
		return res.status(403).json("You can only delete your account!");
	}
});

//get a user
app.get("/users/:id", async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		const { password, updatedAt, ...other } = user._doc;
		res.status(200).json(other);
	} catch (err) {
		res.status(500).json(err);
	}
});

//follow a user
app.put("/users/:id/follow", async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id);
			const currentUser = await User.findById(req.body.userId);
			if (!user.followers.includes(req.body.userId)) {
				await user.updateOne({ $push: { followers: req.body.userId } });
				await currentUser.updateOne({ $push: { following: req.params.id } });
				res.status(200).json("user has been followed");
			} else {
				res.status(403).json("you already follow this user");
			}
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		res.status(403).json("you cannot follow yourself");
	}
});

//unfollow a user
app.put("/users/:id/unfollow", async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id);
			const currentUser = await User.findById(req.body.userId);
			if (user.followers.includes(req.body.userId)) {
				await user.updateOne({ $pull: { followers: req.body.userId } });
				await currentUser.updateOne({ $pull: { following: req.params.id } });
				res.status(200).json("user has been unfollowed");
			} else {
				res.status(403).json("you dont follow this user");
			}
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		res.status(403).json("you cant unfollow yourself");
	}
});
//////////////////////////////////////////////////////////////////////////////

// SURVEYS ///////////////////////////////////////////////////////////////////
// get all posts
app.get("/posts", (req, res) => {
	Post.find().then((posts) => res.json(posts));
});
// create a post
app.post("/posts", async (req, res) => {
	const newPost = new Post(req.body);
	try {
		const savedPost = await newPost.save();
		res.status(201).json("Created");
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
			res.status(200).json("the post has been updated");
		} else {
			res.status(403).json("you can update only your post");
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
			res.status(200).json("the post has been deleted");
		} else {
			res.status(403).json("you can delete only your post");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});
// vote yes
app.put("/posts/:id/voteYes", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post.votesYes.includes(req.body.userId)) {
			await post.updateOne({ $push: { votesYes: req.body.userId } });
			res.status(200).json("The post has been voted Yes");
		} else {
			await post.updateOne({ $pull: { votesYes: req.body.userId } });
			res.status(200).json("The vote has been deleted");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});
// vote no
app.put("/posts/:id/voteNo", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post.votesNo.includes(req.body.userId)) {
			await post.updateOne({ $push: { votesNo: req.body.userId } });
			res.status(200).json("The post has been voted No");
		} else {
			await post.updateOne({ $pull: { votesNo: req.body.userId } });
			res.status(200).json("The vote has been deleted");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});
// get a post
app.get("/posts/:id", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		res.status(200).json(post);
	} catch (err) {
		res.status(500).json(err);
	}
});
// get all posts (following)
app.get("/posts/following/all", async (req, res) => {
	try {
		const currentUser = await User.findById(req.body.userId);
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
///////////////////////////////////////////////////////////////////////////

app.listen(port, () => {
	console.log(`App is listening on port ${port}`);
});
