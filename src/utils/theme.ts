export function updateThemeClass(theme: string) {
    const htmlElement = document.documentElement;

    // Remove existing theme classes
    htmlElement.classList.remove("light", "dark");

    // Add the new theme class
    if (theme === "dark") {
        htmlElement.classList.add("dark");
    } else {
        htmlElement.classList.add("light");
    }
}
