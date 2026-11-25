class ThemeManager {
    constructor() {
        this.html = document.documentElement
        this.init()
    }

    init() {
        document.addEventListener("DOMContentLoaded", () => this.updateIcons())
    }

    toggle() {
        const isDark = this.html.classList.contains("dark")
        const newTheme = isDark ? "light" : "dark"

        this.html.classList.toggle("dark", newTheme === "dark")
        localStorage.setItem("theme", newTheme)
        this.updateIcons()
    }

    updateIcons() {
        const isDark = this.html.classList.contains("dark")
        const sunIcon = document.getElementById("sun-icon")
        const moonIcon = document.getElementById("moon-icon")

        if (sunIcon && moonIcon) {
            sunIcon.classList.toggle("hidden", !isDark)
            moonIcon.classList.toggle("hidden", isDark)
        }
    }
}

const themeManager = new ThemeManager()

// Global function for theme toggle button
function toggleTheme() {
    themeManager.toggle()
}