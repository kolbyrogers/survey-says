var app = new Vue({
	el: "#app",
	data: {
		surveys: [],
		name: "",
		userId: "",

		showSignIn: true,
		signInEmail: "",
		signInPass: "",

		showRegistrationPage: false,
		registerName: "",
		registerEmail: "",
		registerPass: "",

		showMakeSurvey: false,
		inputPrompt: "",
		inputTitle: "",

		showUpdateSurvey: false,
		updatePrompt: "",
		updateTitle: "",

		showMainPage: false,
	},
	methods: {
		// DISPLAY /////////////////////////////////////////////////////////
		hideAll: function () {
			this.showSignIn = false;
			this.showRegistrationPage = false;
			this.showMakeSurvey = false;
			this.showMainPage = false;
		},
		showSign: function () {
			this.hideAll();
			this.showSignIn = true;
		},
		showMain: function () {
			this.hideAll();
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
		////////////////////////////////////////////////////////////////////
		// USERS ///////////////////////////////////////////////////////////
		// register user
		addUser: function () {
			var data = "username=" + encodeURIComponent(this.registerName);
			data += "&email=" + encodeURIComponent(this.registerEmail);
			data += "&password=" + encodeURIComponent(this.registerPass);
			console.log("Data being sent to server:", data);
			fetch("http://localhost:8080/users", {
				method: "POST",
				body: data,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}).then((res) => {
				this.registerName = "";
				this.registerEmail = "";
				this.registerPass = "";
				this.getAllPosts();
				this.showMain();
			});
		},
		loginUser: function () {
			var data = "email=" + encodeURIComponent(this.signInEmail);
			data += "&password=" + encodeURIComponent(this.signInPass);
			console.log("Data being sent to server:", data);
			fetch("http://localhost:8080/users/login", {
				method: "POST",
				body: data,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}).then((res) => {
				if (res.status == 200) {
					res.json().then((data) => {
						this.name = data.username;
						this.userId = data._id;
						console.log("Name:", this.name, "ID:", this.userId);
						this.getAllPosts();
						this.showMain();
					});
				} else if (res.status == 400) {
					alert("Check your password.");
					return;
				} else if (res.status == 404) {
					alert("Email not found.");
				} else {
					alert("Server Error. Try again.");
				}
				this.signInEmail = "";
				this.signInPass = "";
			});
		},
		registerUser: function () {
			if (this.registerName && this.registerEmail && this.registerPass) {
				var data = "username=" + encodeURIComponent(this.registerName);
				data += "&email=" + encodeURIComponent(this.registerEmail);
				data += "&password=" + encodeURIComponent(this.registerPass);
				console.log("date being sent to server:", data);
				fetch("http://localhost:8080/users", {
					method: "POST",
					body: data,
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
				}).then((res) => {
					console.log(res.status);
					if (res.status == 201) {
						this.getAllPosts();
						this.showMain();
					} else {
						alert("Server Error. Verify information and try again.");
					}
					this.registerName = "";
					this.registerEmail = "";
					this.registerPass = "";
				});
			} else {
				alert("Fill in the form entirely.");
				return;
			}
		},
		///////////////////////////////////////////////////////////////////
		// SURVEYS ///////////////////////////////////////////////////////
		getAllPosts: function () {
			fetch("http://localhost:8080/posts").then((res) => {
				res.json().then((data) => {
					console.log("Data from server:", data);
					this.surveys = data;
				});
			});
		},
		addPost: function () {
			var data = "userId=" + encodeURIComponent(this.userId);
			data += "&prompt=" + encodeURIComponent(this.inputPrompt);
			data += "&title=" + encodeURIComponent(this.inputTitle);
			console.log("Data being sent to server:", data);
			fetch("http://localhost:8080/posts", {
				method: "POST",
				body: data,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}).then((res) => {
				this.getAllPosts();
				this.showMain();
			});
		},
		updatePost: function () {
			var data = "userId=" + encodeURIComponent(this.userId);
			data += "&title=" + encodeURIComponent(this.updateTitle);
			data += "&prompt=" + encodeURIComponent(this.updatePrompt);
			console.log("Data being sent to server:", data);
			fetch("http://localhost:8080/posts/" + this.postId, {
				method: "PUT",
				body: data,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}).then((res) => {
				this.updateTitle = "";
				this.updatePrompt = "";
				this.getAllPosts();
				this.showMain();
			});
		},
		deletePost: function () {
			var data = "userId=" + encodeURIComponent(this.userId);
			console.log("Data being sent to server:", data);
			fetch("http://localhost:8080/posts/" + this.postId, {
				method: "DELETE",
				body: data,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}).then((res) => {
				this.getAllPosts();
				this.showMain();
			});
		},
		voteYes: function () {
			var data = "userId=" + encodeURIComponent(this.userId);
			console.log("Data being sent to server:", data);
			fetch("http://localhost:8080/posts/" + this.postId + "/voteYes", {
				method: "PUT",
				body: data,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}).then((res) => {
				this.getAllPosts();
				this.showMain();
			});
		},
		voteNo: function () {
			var data = "userId=" + encodeURIComponent(this.userId);
			console.log("Data being sent to server:", data);
			fetch("http://localhost:8080/posts/" + this.postId + "/voteNo", {
				method: "PUT",
				body: data,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}).then((res) => {
				this.getAllPosts();
				this.showMain();
			});
		},
		getOnePost: function () {},
		getAllFollowingPosts: function () {
			var data = "userId=" + encodeURIComponent(this.userId);
			console.log("Data being sent to server:", data);
			fetch("http://localhost:8080/posts/following/all/", {
				method: "GET",
				body: data,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}).then((res) => {
				this.getAllPosts();
				this.showMain();
			});
		},
		/////////////////////////////////////////////////////////////////////
	},
	created: function () {
		console.log(`App is ready.`);
		this.getAllPosts();
	},
});
