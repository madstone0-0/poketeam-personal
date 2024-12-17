/** @type {import('tailwindcss').Config} */
//import daisyui from "daisyui";
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [require("daisyui")],
    daisyui: {
        themes: [
            {
                dark: {
                    primary: "#FF6347", // Inspired by fiery Pokémon like Charizard
                    secondary: "#FFDD57", // Reflects the yellow of Pikachu
                    accent: "#4FC1A6", // Reflects water-type Pokémon like Squirtle
                    neutral: "#2C2E3E", // A subtle gray for a balanced tone
                    "base-100": "#1e1e1e", // A dark base color reflecting nighttime Pokémon vibes
                },
                light: {
                    primary: "#FF6347", // Matches dark mode for consistency
                    secondary: "#FFDD57", // A cheerful yellow for Pikachu's vibrancy
                    accent: "#4FC1A6", // Matches water Pokémon aesthetic
                    neutral: "#F5F5F5", // A soft gray for a friendly feel
                    "base-100": "#FFFFFF", // Bright white for a clean, daytime theme
                },
            },
        ],
    },
};
