const SERVER_URL = "https://survey-says-4200.herokuapp.com";
// const SERVER_URL = "http://localhost:8080";
var app = new Vue({
	el: "#app",
	data: {
		surveys: [],
		friends: [],
		name: "",
		user: null,

		showMainPage: true,
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
		showSignIn: false,
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
			return this.user._id == postUserId;
		},

		// display
		clearInputs: function () {
			this.name = "";
			this.showSignIn = true;
			this.signInEmail = "";
			this.signInPass = "";
			this.showRegistrationPage = false;
			this.registerName = "";
			this.registerEmail = "";
			this.registerPass = "";
			this.showMakeSurvey = false;
			this.inputPrompt = "";
			this.inputTitle = "";
			this.showFindFriends = false;
			this.searchUsername = "";
			this.friendsFound = [];
		},
		hideAll: function () {
			this.surveys = [];
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
		logout: function () {
			fetch(SERVER_URL + "/session", {
				method: "DELETE",
				credentials: "include",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}).then((res) => {
				this.clearInputs();
				this.showSign();
			});
		},
		getUser: async function () {
			fetch(SERVER_URL + "/session", {
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}).then((res) => {
				if (res.status == 200) {
					res.json().then((data) => {
						this.user = data;
						return data;
					});
				} else if (res.status == 401) {
					this.logout();
				}
			});
		},
		loginUser: function () {
			this.resetErrors();
			if (!this.isValidEmail(this.signInEmail)) {
				this.badEmail = true;
				this.errors.push("Please enter a valid email address");
				return;
			}
			var data = "email=" + encodeURIComponent(this.signInEmail);
			data += "&plainPassword=" + encodeURIComponent(this.signInPass);
			fetch(SERVER_URL + "/sessions", {
				method: "POST",
				body: data,
				credentials: "include",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}).then((res) => {
				this.resetErrors();
				if (res.status == 201) {
					this.getUser();
					this.showMain();
					return;
				}
				if (res.status == 401) {
					this.signInEmail = "";
					this.signInPass = "";
					this.badPassword = true;
					this.badEmail = true;
					this.errors.push("Invalid Email or Password");
				}
				return;
			});
		},
		registerUser: function () {
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
			var data = "username=" + encodeURIComponent(this.registerName);
			this.name = this.registerName;
			data += "&email=" + encodeURIComponent(this.registerEmail);
			data += "&password=" + encodeURIComponent(this.registerPass);
			fetch(SERVER_URL + "/users", {
				method: "POST",
				body: data,
				credentials: "include",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}).then((res) => {
				this.resetErrors();
				if (res.status == 201) {
					this.signInEmail = this.registerEmail;
					this.signInPass = this.registerPass;
					this.loginUser();
				}
				if (res.status == 409) {
					this.badEmail = true;
					this.errors.push("Email is already associated with an account.");
				}
				this.registerName = "";
				this.registerEmail = "";
				this.registerPass = "";
			});
		},
		followUser: function (followId) {
			fetch(SERVER_URL + "/friends/" + followId, {
				method: "PUT",
				credentials: "include",
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
			fetch(SERVER_URL + "/unfriends/" + followId, {
				method: "PUT",
				credentials: "include",
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
			fetch(SERVER_URL + "/friends", {
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
			var data = "prompt=" + encodeURIComponent(this.inputPrompt);
			data += "&title=" + encodeURIComponent(this.inputTitle);
			fetch(SERVER_URL + "/posts", {
				method: "POST",
				body: data,
				credentials: "include",
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
		// updatePost: function () {
		// 	data += "&title=" + encodeURIComponent(this.updateTitle);
		// 	data += "&prompt=" + encodeURIComponent(this.updatePrompt);
		// 	fetch(SERVER_URL + "/posts/" + this.postId, {
		// 		method: "PUT",
		// 		body: data,
		// 		credentials: "include",
		// 		headers: {
		// 			"Content-Type": "application/x-www-form-urlencoded",
		// 		},
		// 	}).then((res) => {
		// 		this.updateTitle = "";
		// 		this.updatePrompt = "";
		// 		this.showMain();
		// 	});
		// },
		deletePost: function (postId) {
			var data = "userId=" + encodeURIComponent(this.userId);
			fetch(SERVER_URL + "/posts/" + postId, {
				method: "DELETE",
				body: data,
				credentials: "include",
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
			fetch(SERVER_URL + "/posts/" + postId + "/votesYes", {
				method: "PUT",
				credentials: "include",
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
			fetch(SERVER_URL + "/posts/" + postId + "/votesNo", {
				method: "PUT",
				credentials: "include",
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
			fetch(SERVER_URL + "/posts/following", {
				method: "GET",
				credentials: "include",
			}).then((res) => {
				if (res.status == 200) {
					res.json().then((data) => {
						this.surveys = data;
					});
				}
			});
		},
	},
	computed: {},
	created: function () {
		this.showMain();
		this.getUser();
		console.log(`App is ready.`);
	},
});
