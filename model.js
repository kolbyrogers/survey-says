const mongoose = require("mongoose");
mongoose.connect(
	"mongodb+srv://krogers:MwgGeaBR8Fpswklj@cluster0.ka7qd.mongodb.net/surveySays?retryWrites=true&w=majority",
);

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

module.exports = {
	Post: Post,
	User: User,
};
