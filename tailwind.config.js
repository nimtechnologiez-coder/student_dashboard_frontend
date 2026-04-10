/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#02040a",
                foreground: "#ffffff",
                "primary-green": "#A3D861",
                "primary-blue": "#0395B2",
                glass: "rgba(255, 255, 255, 0.02)",
                "glass-border": "rgba(255, 255, 255, 0.06)",
            },
        },
    },
    plugins: [],
}




