import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    // Disable source maps in production
    sourcemap: false,
    // Target modern browsers for smaller output
    target: 'es2020',
    // CSS code splitting per chunk
    cssCodeSplit: true,
    // Use terser for advanced minification
    minify: 'terser',
    terserOptions: {
      compress: {
        // Always strip debugger statements
        drop_debugger: true,
        // Strip console.log/debug/info — keep console.error for real error tracking
        pure_funcs: ['console.log', 'console.debug', 'console.info', 'console.warn'],
        // Additional dead code removal
        passes: 2,
      },
      format: {
        // Remove comments in production
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        // Split vendor code into separate cacheable chunks
        manualChunks(id) {
          // React core — tiny chunk, loads first
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'chunk-react';
          }
          // React Router
          if (id.includes('node_modules/react-router')) {
            return 'chunk-router';
          }
          // GSAP + ScrollTrigger — large, animation-specific
          if (id.includes('node_modules/gsap')) {
            return 'chunk-gsap';
          }
          // Framer Motion — used in booking/admin pages
          if (id.includes('node_modules/framer-motion')) {
            return 'chunk-framer';
          }
          // Supabase client — admin + data fetching
          if (id.includes('node_modules/@supabase')) {
            return 'chunk-supabase';
          }
          // Lucide icons — tree-shaken but still sizeable
          if (id.includes('node_modules/lucide-react')) {
            return 'chunk-lucide';
          }
          // Admin-specific pages — only loaded when accessing /admin
          if (
            id.includes('/pages/admin/') ||
            id.includes('/components/dashboard/')
          ) {
            return 'chunk-admin';
          }
        },
        // Consistent asset file naming with content hash for long-term caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Raise chunk size warning threshold to 600KB (we're splitting so individual chunks will be fine)
    chunkSizeWarningLimit: 600,
  },
})
