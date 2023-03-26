let darkMode = localStorage.getItem("darkMode");
const toggleSwitch = document.getElementById("toggle-switch");
const toggleText = document.getElementById("toggle-result");
toggleText.innerText = "Light Mode";

const enableDarkMode = () => {
	document.body.classList.remove("lightmode");
	document.body.classList.add("darkmode");
	localStorage.setItem("darkMode", "enabled");
	toggleText.innerText = "Night Mode";
};

const enableLightMode = () => {
	document.body.classList.remove("darkmode");
	document.body.classList.add("lightmode");
	localStorage.setItem("darkMode", "disabled");
	toggleText.innerText = "Light Mode";
};

if (darkMode === "enabled") {
	enableDarkMode();
} else if (darkMode === null) {
	enableLightMode();
} else if (darkMode === "disabled") {
	enableLightMode();
}

toggleSwitch.addEventListener("click", () => {
	darkMode = localStorage.getItem("darkMode");
	if (darkMode !== "enabled") {
		enableDarkMode();
	} else {
		enableLightMode();
	}
});
