const mongoose = require("mongoose");
const { arrayBuffer } = require("stream/consumers");
const { boolean } = require("webidl-conversions");
mongoose.connect(
	"mongodb+srv://krogers:MwgGeaBR8Fpswklj@cluster0.ka7qd.mongodb.net/surveySays?retryWrites=true&w=majority",
);

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
const Post = mongoose.model("Post", {
	userId: {
		type: String,
		require: true,
	},
	prompt: {
		type: String,
		max: 100,
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

module.exports = {
	Post: Post,
	User: User,
};
