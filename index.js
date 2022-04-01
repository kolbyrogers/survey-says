const cors = require("cors");
const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("passport-local");

const model = require("./model");
const Post = model.Post;
const User = model.User;

const app = express();
const port = process.env.PORT || 8080;

// MIDDLEWARE
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(
	session({
		secret: "q23w4se5drtfyguhijnomk",
		resave: false,
		saveUninitialized: true,
	}),
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
	new passportLocal.Strategy(
		{
			usernameField: "email",
			passwordField: "plainPassword",
		},
		async function (email, plainPassword, done) {
			try {
				const user = await User.findOne({ email: email });
				if (!user) {
					return done(null, false, { message: "User not found" });
				}
				const validPassword = await bcrypt.compare(plainPassword, user.password);
				if (!validPassword) {
					done(null, false, { message: "Bad Password" });
				} else {
					return done(null, user);
				}
			} catch (err) {
				return done(err);
			}
		},
	),
);
passport.serializeUser(function (user, done) {
	done(null, user._id);
});
passport.deserializeUser(async function (userId, done) {
	try {
		const user = await User.findOne({ _id: userId });
		done(null, user);
	} catch (err) {
		done(err);
	}
});

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
app.get("/following", async (req, res) => {
	try {
		const following = [];
		const user = await User.findById(req.user._id);
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
// authenticate user
app.post("/sessions", passport.authenticate("local"), function (req, res) {
	// passport handles
	res.sendStatus(201);
});

app.get("/session", function (req, res) {
	if (req.user) {
		res.json(req.user);
	} else {
		res.sendStatus(401);
	}
});
app.delete("/session", function (req, res) {
	req.logout();
	res.sendStatus(204);
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
			console.error("ERROR:", err);
			res.status(500).json(err);
		}
	}
});
//follow a user
app.put("/friends/:id", async (req, res) => {
	if (req.user) {
		if (req.user._id !== req.params.id) {
			try {
				const user = await User.findById(req.params.id);
				const currentUser = await User.findById(req.user._id);
				if (!user.followers.includes(req.user._id)) {
					await user.updateOne({ $push: { followers: req.user._id } });
					await currentUser.updateOne({ $push: { following: req.params.id } });
					res.status(200).json("User followed");
				} else {
					res.status(403).json("You already follow this user");
				}
			} catch (err) {
				console.log(err);
				res.status(500).json(err);
			}
		} else {
			res.status(403).json("Cannot follow yourself");
		}
	} else {
		res.sendStatus(401);
	}
});
// unfollow a user
app.put("/unfriends/:id", async (req, res) => {
	// bad to have verbs in path
	if (req.user) {
		if (req.user._id !== req.params.id) {
			try {
				const user = await User.findById(req.params.id);
				const currentUser = await User.findById(req.user._id);
				if (user.followers.includes(req.user._id)) {
					await user.updateOne({ $pull: { followers: req.user._id } });
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
	} else {
		res.sendStatus(401);
	}
});

// SURVEYS
// get all posts
app.get("/posts", (req, res) => {
	if (req.user) {
		Post.find().then((posts) => res.json(posts));
	} else {
		res.sendStatus(401);
	}
});
// get all posts (following)
app.get("/posts/following", async (req, res) => {
	if (req.user) {
		try {
			const currentUser = await User.findById(req.user._id);
			const userPosts = await Post.find({ userId: currentUser._id });
			const friendPosts = await Promise.all(
				currentUser.following.map((friendId) => {
					return Post.find({ userId: friendId });
				}),
			);
			res.status(200).json(userPosts.concat(...friendPosts));
		} catch (err) {
			console.error(err);
			res.status(500).json(err);
		}
	} else {
		res.sendStatus(401);
	}
});
// create a post
app.post("/posts", async (req, res) => {
	if (req.user) {
		const newPost = new Post({
			userId: req.user._id,
			author: req.user.username,
			prompt: req.body.prompt,
			title: req.body.title,
		});
		try {
			const savedPost = await newPost.save();
			res.status(201).json("Post created");
		} catch (err) {
			console.error(err);
			res.status(500).json(err);
		}
	} else {
		res.sendStatus(401);
	}
});
// update a post
app.put("/posts/:id", async (req, res) => {
	if (req.user) {
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
	} else {
		res.sendStatus(401);
	}
});
// vote yes
app.put("/posts/:id/votesYes", async (req, res) => {
	if (req.user) {
		try {
			const post = await Post.findById(req.params.id);

			if (post.votesNo.includes(req.user._id)) {
				await post.updateOne({ $pull: { votesNo: req.user._id } });
			}
			if (!post.votesYes.includes(req.user._id)) {
				await post.updateOne({ $push: { votesYes: req.user._id } });
				res.status(200).json("Voted Yes");
			} else {
				await post.updateOne({ $pull: { votesYes: req.user._id } });
				res.status(200).json("Vote deleted");
			}
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		res.sendStatus(401);
	}
});
// vote no
app.put("/posts/:id/votesNo", async (req, res) => {
	if (req.user) {
		try {
			const post = await Post.findById(req.params.id);

			if (post.votesYes.includes(req.user._id)) {
				await post.updateOne({ $pull: { votesYes: req.user._id } });
			}
			if (!post.votesNo.includes(req.user._id)) {
				await post.updateOne({ $push: { votesNo: req.user._id } });
				res.status(200).json("Voted No");
			} else {
				await post.updateOne({ $pull: { votesNo: req.user._id } });
				res.status(200).json("Vote deleted");
			}
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		res.sendStatus(401);
	}
});
// delete a post
app.delete("/posts/:id", async (req, res) => {
	if (req.user) {
		try {
			const post = await Post.findById(req.params.id);
			await post.deleteOne();
			res.status(200).json("Post deleted");
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		res.sendStatus(401);
	}
});

app.listen(port, () => {
	console.log(`App is listening on port ${port}`);
});
