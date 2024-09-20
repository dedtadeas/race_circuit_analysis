import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { fileURLToPath, URL } from 'url';
import yaml from 'js-yaml';
import fs from 'fs';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Load YAML configuration
  let yamlConfig;
  try {
    const configFile = fs.readFileSync('src/config.yaml', 'utf8');
    yamlConfig = yaml.load(configFile);
  } catch (e) {
    console.error('Error loading YAML configuration file:', e);
    yamlConfig = {};
  }

  return {
    plugins: [
      vue(),
      commonjs(),
      nodeResolve({
        browser: true,
        preferBuiltins: false,
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
      preserveSymlinks: true,
    },
    optimizeDeps: {
      include: ['google-protobuf', 'grpc-web', 'grpc' ],
      exclude: ['vue-demi'],
      
    },
    define: {
      'process.env': env,
      '__YAML_CONFIG__': JSON.stringify(yamlConfig), // Inject YAML config as a global variable
    },
    server: {
      host: '0.0.0.0',
      port: 8088,
    },
    build: {
      sourcemap: true,
    },
  };
});
