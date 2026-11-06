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
                // Pomocný text: ≥ 4,5:1 na pozadí stránky i na kartách
                muted: '#aab7c9',
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
                // Neutrální hloubka (stín s posunem); barevnou záři má jen hlavní tlačítko (shadow-cta)
                glow: '0 10px 28px -14px rgba(0, 0, 0, 0.6)',
                'glow-lg': '0 20px 48px -20px rgba(0, 0, 0, 0.65)',
                cta: '0 12px 30px -14px rgba(12, 146, 233, 0.6)',
                'cta-lg': '0 18px 44px -16px rgba(12, 146, 233, 0.7)',
            },
        },
    },
};
