/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
            colors: {
                accent: '#ff4d00',
                bg: 'var(--bg)',
                fg: 'var(--fg)',
            }
        },
	},
	plugins: [],
}
