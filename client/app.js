var app = new Vue({
	el: "#app",
	data: {
		surveys: [],
		name: "Kolb",

		signInEmail: "",
		signInPass: "",
		registerName: "",
		registerEmail: "",
		registerPass: "",
		inputTitle: "",
		inputPrompt: "",

		showSignIn: true,
		showRegistrationPage: false,
		showMainPage: false,
		showMakeSurvey: false,
	},
	methods: {
		hideAll: function () {
			this.showSignIn = false;
			this.showRegistrationPage = false;
			this.showMainPage = false;
			this.showMakeSurvey = false;
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
		voteYes: function () {},
		voteNo: function () {},
		addUser: function () {
			var data = "username=" + encodeURIComponent(this.userName);
			data += "&email=" + encodeURIComponent(this.email);
			data += "&password=" + encodeURIComponent(this.password);
			console.log("Data being sent to server:", data);
			fetch("http://localhost:8080/users", {
				method: "POST",
				body: data,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}).then((res) => {
				this.getSurveys();
				this.showMain();
			});
		},
		addSurvey: function () {
			var data = "author=" + encodeURIComponent(this.name);
			data += "&title=" + encodeURIComponent(this.inputTitle);
			data += "&prompt=" + encodeURIComponent(this.inputPrompt);
			data += "&votesYes=" + encodeURIComponent(0);
			data += "&votesNo=" + encodeURIComponent(0);
			console.log("Data being sent to server:", data);
			fetch("http://localhost:8080/surveys", {
				method: "POST",
				body: data,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}).then((res) => {
				this.getSurveys();
				this.showMain();
			});
		},
		getSurveys: function () {
			fetch("http://localhost:8080/surveys").then((res) => {
				res.json().then((data) => {
					console.log("Data from server:", data);
					this.surveys = data;
				});
			});
		},
	},
	created: function () {
		console.log(`App is ready.`);
		this.getSurveys();
	},
});
