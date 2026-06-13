import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isEditorMode = mode === 'editor'
  const isAgentMode = mode === 'agent'
  const isAdmin = isEditorMode || isAgentMode

  return {
    plugins: [
      react({
        jsxRuntime: 'automatic',
        babel: {
          plugins: [
            ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
          ]
        }
      }),
      tsconfigPaths()
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@core': resolve(__dirname, './src/core'),
        '@components': resolve(__dirname, './src/components'),
        '@admin': resolve(__dirname, './src/admin'),
        '@systems': resolve(__dirname, './src/systems'),
        '@utils': resolve(__dirname, './src/utils'),
        '@assets': resolve(__dirname, './public/assets'),
        '@etherworld': resolve(__dirname, './src/etherworld'),
        '@route138': resolve(__dirname, './src/route-138-quebec'),
        '@editor': resolve(__dirname, './src/admin/EtherWorld-Editor'),
        '@agent': resolve(__dirname, './src/admin/EtherWorld-Agent'),
        '@weather': resolve(__dirname, './src/admin/Weather-System-Complex'),
        'three': resolve(__dirname, './node_modules/three')
      }
    },
    server: {
      port: 5173,
      host: true,
      cors: true,
      hmr: {
        overlay: true
      },
      // Admin-specific server options
      ...(isAdmin && {
        port: isEditorMode ? 5174 : 5175,
        open: true
      })
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          ...(isEditorMode && { editor: resolve(__dirname, 'admin/editor.html') }),
          ...(isAgentMode && { agent: resolve(__dirname, 'admin/agent.html') })
        },
        output: {
          manualChunks: {
            'three-core': ['three', '@react-three/fiber', '@react-three/drei'],
            'admin-tools': ['@admin/EtherWorld-Editor', '@admin/EtherWorld-Agent'],
            'weather': ['@admin/Weather-System-Complex'],
            'physics': ['cannon-es', '@react-three/cannon'],
            'ui': ['react', 'react-dom', 'framer-motion', 'lucide-react'],
            'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore']
          }
        }
      },
      target: 'esnext',
      minify: 'esbuild'
    },
    optimizeDeps: {
      include: [
        'three',
        '@react-three/fiber',
        '@react-three/drei',
        'cannon-es',
        'simplex-noise',
        'gsap',
        'framer-motion'
      ],
      exclude: ['three-mesh-bvh']
    },
    define: {
      __VERSION__: JSON.stringify('2.0.0-fusion'),
      __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
      __ADMIN_ENABLED__: isAdmin,
      __EDITOR_MODE__: isEditorMode,
      __AGENT_MODE__: isAgentMode
    },
    css: {
      postcss: './postcss.config.js',
      devSourcemap: true
    },
    // Experimental features for performance
    experimental: {
      renderBuiltUrl: (filename, { hostType }) => {
        if (hostType === 'js') {
          return `https://cdn.etherworld.dev/assets/${filename}`
        }
        return filename
      }
    }
  }
})