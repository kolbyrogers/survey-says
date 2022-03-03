const SERVER_URL = "https://survey-says-4200.herokuapp.com";
var app = new Vue({
	el: "#app",
	data: {
		surveys: [],
		friends: [],
		name: "",
		userId: "",

		showMainPage: false,
		showExplore: false,

		// form validation
		errors: [],
		formControl: "form-control",
		formError: "border border-danger",
		badPassword: false,
		badEmail: false,
		badUsername: false,
		badTitle: false,
		badPrompt: false,

		// sign in page
		showSignIn: true,
		signInEmail: "",
		signInPass: "",

		// registration page
		showRegistrationPage: false,
		registerName: "",
		registerEmail: "",
		registerPass: "",

		// add survey page
		showMakeSurvey: false,
		inputPrompt: "",
		inputTitle: "",

		// find friends page
		showFindFriends: false,
		searchUsername: "",
		friendsFound: [],

		// update survey page TODO!
		showUpdateSurvey: false,
		updatePrompt: "",
		updateTitle: "",
	},
	methods: {
		// validation
		resetErrors: function () {
			this.errors = [];
			this.badEmail = false;
			this.badPassword = false;
			this.badUsername = false;
			this.badTitle = false;
			this.badPrompt = false;
		},
		isValidEmail: function (email) {
			return email.match(
				/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			);
		},
		isUsersPost: function (postUserId) {
			return this.userId == postUserId;
		},

		// display
		hideAll: function () {
			this.resetErrors();
			this.showSignIn = false;
			this.showRegistrationPage = false;
			this.showMakeSurvey = false;
			this.showMainPage = false;
			this.showFindFriends = false;
			this.showExplore = false;
		},
		showSign: function () {
			this.hideAll();
			this.showSignIn = true;
		},
		showMain: function () {
			this.hideAll();
			this.getAllFollowingPosts();
			this.showMainPage = true;
		},
		showRegistration: function () {
			this.hideAll();
			this.showRegistrationPage = true;
		},
		makeSurvey: function () {
			this.hideAll();
			this.showMakeSurvey = true;
		},
		findFriends: function () {
			this.hideAll();
			this.getAllFriends();
			this.searchUsername = "";
			this.friendsFound = [];
			this.showFindFriends = true;
		},
		showExplorePage: function () {
			this.hideAll();
			this.getAllPosts();
			this.showExplore = true;
		},

		// users
		loginUser: function () {
			// validation
			this.resetErrors();
			if (!this.isValidEmail(this.signInEmail)) {
				this.badEmail = true;
				this.errors.push("Please enter a valid email address");
				return;
			}
			// request data
			var data = "email=" + encodeURIComponent(this.signInEmail);
			data += "&password=" + encodeURIComponent(this.signInPass);
			// request
			fetch(SERVER_URL + "/users/login", {
				method: "POST",
				body: data,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}).then((res) => {
				this.resetErrors();
				if (res.status == 200) {
					res.json().then((data) => {
						this.name = data.username;
						this.userId = data._id;
						this.showMain();
						return;
					});
				}
				if (res.status == 403) {
					this.signInPass = "";
					this.badPassword = true;
					this.errors.push("Invalid Password");
				}
				if (res.status == 404) {
					this.signInPass = "";
					this.signInEmail = "";
					this.badEmail = true;
					this.errors.push("Email not found. Do you need to register?");
				}
				return;
			});
		},
		registerUser: function () {
			// validation
			this.resetErrors();
			if (this.registerName.length < 3) {
				this.badUsername = true;
				this.errors.push("Username must be more than 2 characters");
			}
			if (!this.isValidEmail(this.registerEmail)) {
				this.badEmail = true;
				this.errors.push("Please enter a valid email address");
			}
			if (this.registerPass.length < 8) {
				this.badPassword = true;
				this.errors.push("Password must be more than 8 characters");
			}
			if (this.errors.length) {
				return;
			}
			// request data
			var data = "username=" + encodeURIComponent(this.registerName);
			this.name = this.registerName;
			data += "&email=" + encodeURIComponent(this.registerEmail);
			data += "&password=" + encodeURIComponent(this.registerPass);
			// request
			fetch(SERVER_URL + "/users", {
				method: "POST",
				body: data,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}).then((res) => {
				this.resetErrors();
				if (res.status == 201) {
					res.json().then((data) => {
						this.name = data.username;
						this.userId = data._id;
					});
					this.showMain();
				}
				if (res.status == 409) {
					this.badEmail = true;
					this.errors.push("Email is already associated with an account.");
				} else {
					alert("Server Error. Verify information and try again.");
				}
				this.registerName = "";
				this.registerEmail = "";
				this.registerPass = "";
			});
		},
		followUser: function (followId) {
			var data = "userId=" + encodeURIComponent(this.userId);
			fetch(SERVER_URL + "/users/" + followId + "/follow/", {
				method: "PUT",
				body: data,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}).then((res) => {
				if (res.status == 200) {
					this.findFriends();
				}
			});
		},
		unfollowUser: function (followId) {
			var data = "userId=" + encodeURIComponent(this.userId);
			fetch(SERVER_URL + "/users/" + followId + "/unfollow/", {
				method: "PUT",
				body: data,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}).then((res) => {
				if (res.status == 200) {
					this.findFriends();
				} else if (res.status == 403) {
					alert("You do not follow this user.");
				}
			});
		},
		searchForFriends: function () {
			this.resetErrors();
			this.friendsFound = [];
			fetch(SERVER_URL + "/users/search/" + this.searchUsername, {
				method: "GET",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}).then((res) => {
				if (res.status == 200) {
					res.json().then((data) => {
						this.friendsFound = data.filter((friend) => friend.username != this.name);
						if (!this.friendsFound.length) {
							this.errors.push("No users found :(");
						}
					});
				} else if (res.status == 404) {
					this.errors.push("No users found :(");
				}
			});
		},
		getAllFriends: function () {
			fetch(SERVER_URL + "/following/" + this.userId, {
				method: "GET",
			}).then((res) => {
				if (res.status == 200) {
					res.json().then((data) => {
						this.friends = data;
					});
				}
			});
		},

		// posts
		getAllPosts: function () {
			fetch(SERVER_URL + "/posts").then((res) => {
				res.json().then((data) => {
					this.surveys = data;
				});
			});
		},
		addPost: function () {
			// validation
			this.resetErrors();
			if (this.inputTitle.length < 3) {
				this.badTitle = true;
				this.errors.push("Title must be at least 3 characters");
			}
			if (this.inputPrompt.length < 3) {
				this.badPrompt = true;
				this.errors.push("Prompt must be at least 3 characters");
			}
			if (this.errors.length) {
				return;
			}
			// request data
			var data = "userId=" + encodeURIComponent(this.userId);
			data += "&author=" + encodeURIComponent(this.name);
			data += "&prompt=" + encodeURIComponent(this.inputPrompt);
			data += "&title=" + encodeURIComponent(this.inputTitle);
			// request
			fetch(SERVER_URL + "/posts", {
				method: "POST",
				body: data,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}).then((res) => {
				this.inputPrompt = "";
				this.inputTitle = "";
				if (this.showExplore) {
					this.showExplorePage();
				} else {
					this.showMain();
				}
			});
		},
		updatePost: function () {
			var data = "userId=" + encodeURIComponent(this.userId);
			data += "&title=" + encodeURIComponent(this.updateTitle);
			data += "&prompt=" + encodeURIComponent(this.updatePrompt);
			fetch(SERVER_URL + "/posts/" + this.postId, {
				method: "PUT",
				body: data,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}).then((res) => {
				this.updateTitle = "";
				this.updatePrompt = "";
				this.showMain();
			});
		},
		deletePost: function (postId) {
			var data = "userId=" + encodeURIComponent(this.userId);
			fetch(SERVER_URL + "/posts/" + postId, {
				method: "DELETE",
				body: data,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}).then((res) => {
				if (this.showExplore) {
					this.getAllPosts();
				} else {
					this.getAllFollowingPosts();
				}
			});
		},
		voteYes: function (postId) {
			var data = "userId=" + encodeURIComponent(this.userId);
			fetch(SERVER_URL + "/posts/" + postId + "/voteYes", {
				method: "PUT",
				body: data,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}).then((res) => {
				if (this.showExplore) {
					this.getAllPosts();
				} else {
					this.getAllFollowingPosts();
				}
			});
		},
		voteNo: function (postId) {
			var data = "userId=" + encodeURIComponent(this.userId);
			fetch(SERVER_URL + "/posts/" + postId + "/voteNo", {
				method: "PUT",
				body: data,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}).then((res) => {
				if (this.showExplore) {
					this.getAllPosts();
				} else {
					this.getAllFollowingPosts();
				}
			});
		},
		getAllFollowingPosts: function () {
			fetch(SERVER_URL + "/posts/following/" + this.userId, {
				method: "GET",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}).then((res) => {
				res.json().then((data) => {
					this.surveys = data;
				});
			});
		},
	},
	computed: {},
	created: function () {
		console.log(`App is ready.`);
	},
});
