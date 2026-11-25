var button = document.getElementById("switch");
var themeInStorage = localStorage.getItem('theme');

if (themeInStorage === 'dark') {
	document.documentElement.setAttribute("data-theme", 'dark');
}

document.documentElement.setAttribute("data-theme", 'light');
localStorage.setItem('theme', 'light');

function changeMode(event)  {
	var existingDataTheme = document.documentElement.getAttribute('data-theme');
	if (existingDataTheme === 'light') {
		document.documentElement.setAttribute("data-theme", 'dark');
		localStorage.setItem('theme', 'dark');
	}
	else {
		document.documentElement.setAttribute("data-theme", 'light');
		localStorage.setItem('theme', 'light');
	}
};

button.addEventListener('change', changeMode, false);