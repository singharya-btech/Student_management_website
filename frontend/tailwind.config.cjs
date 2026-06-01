module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      colors: {
        primaryStart: '#7C3AED',
        primaryEnd: '#4338CA',
        secondary: '#0EA5E9',
        neon: {
          purple: '#A855F7',
          pink: '#EC4899',
          cyan: '#06B6D4',
          lime: '#CDDC39'
        }
      },
      boxShadow: {
        glow: '0 20px 80px rgba(124,58,237,0.14)',
        'neon-glow': '0 0 20px rgba(168,85,247,0.5)',
        'cyan-glow': '0 0 20px rgba(6,182,212,0.3)'
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at top, rgba(99,102,241,0.18), transparent 36%), radial-gradient(circle at bottom right, rgba(79,70,229,0.12), transparent 20%)',
        'neon-gradient': 'linear-gradient(135deg, #A855F7 0%, #EC4899 50%, #06B6D4 100%)',
        'dark-neon': 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(6,182,212,0.15))'
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite'
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.8' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    }
  },
  plugins: []
}
