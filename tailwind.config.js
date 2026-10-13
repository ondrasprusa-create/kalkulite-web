/**
 * KALKULite – Tailwind theme extension.
 * Tailwind v4 načítá tento soubor přes `@config` v resources/css/site.css.
 *
 * @type {import('tailwindcss').Config}
 */
export default {
    content: ['./resources/views/**/*.antlers.html', './content/**/*.md'],
    theme: {
        extend: {
            colors: {
                brand: {
                    dark: '#323044',
                    darker: '#26243a',
                    deep: '#1c1a2b',
                    blue: '#0c92e9',
                    teal: '#1fb8aa',
                },
            },
            fontFamily: {
                chakra: ['"Chakra Petch"', 'sans-serif'],
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            backgroundImage: {
                'brand-gradient': 'linear-gradient(90deg, #0c92e9 0%, #1fb8aa 100%)',
                'brand-gradient-diagonal': 'linear-gradient(135deg, #0c92e9 0%, #1fb8aa 100%)',
            },
            boxShadow: {
                glow: '0 0 0 1px rgba(31, 184, 170, 0.35), 0 10px 40px -10px rgba(12, 146, 233, 0.55)',
                'glow-lg': '0 0 0 1px rgba(31, 184, 170, 0.5), 0 20px 70px -15px rgba(31, 184, 170, 0.6)',
            },
        },
    },
};
