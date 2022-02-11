var app = new Vue({
	el: "#app",
	vuetify: new Vuetify(),
	data: () => ({
		valid: false,
		firstname: "",
		lastname: "",
		nameRules: [(v) => !!v || "Name is required"],
		date: null,
		menu: false,
	}),
	methods: {
		save(date) {
			this.$refs.menu.save(date);
		},
	},
});
