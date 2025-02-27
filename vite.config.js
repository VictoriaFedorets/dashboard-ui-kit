import { defineConfig } from 'vite';
import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import glob from 'fast-glob';
import path from 'path';
import { fileURLToPath } from 'url';

export default defineConfig({
  base: './', // ваш базовий шлях для продакшн
  plugins: [
    ViteImageOptimizer({
      png: {
        quality: 86,
      },
      jpeg: {
        quality: 86,
      },
      jpg: {
        quality: 86,
      },
    }),
    {
      name: 'imagemin-webp',
      buildStart() {
        // Переміщено оптимізацію зображень до етапу build
        imagemin(['./src/img/**/*.{jpg,png,jpeg}'], {
          destination: './src/img/webp/',
          plugins: [imageminWebp({ quality: 86 })],
        });
      },
      apply: 'build', // змінили 'serve' на 'build'
    },
  ],
  build: {
    minify: false,
    rollupOptions: {
      input: Object.fromEntries(
        glob
          .sync(['./*.html', './pages/**/*.html'])
          .map(file => [
            path.relative(
              __dirname,
              file.slice(0, file.length - path.extname(file).length)
            ),
            fileURLToPath(new URL(file, import.meta.url)),
          ])
      ),
      output: {
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
});
