import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#1a1f23',
        foreground: '#E9E9E9',
        primary: '#003CF3',
        secondary: '#E9E9E9',
        dark: '#0E0E0E',
        bgDark: '#1a1f23',
        success: '#00D98E',
        error: '#FF0000',
        info: '#0066FF',
        status: {
          unprocessed: '#E9E9E9', // Non traité → gris
          pending: '#0066FF',      // En cours → bleu
          dispute: '#FF9500',      // Litige → orange
          validated: '#00D98E',    // Validée → vert
          canceled: '#FF0000',     // Annulée → rouge
        },
      },
      fontFamily: {
        heading: ['Archivo Expanded', 'sans-serif'],
        body: ['Inter Tight', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
