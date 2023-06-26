import { ConfigEnv, UserConfig } from 'vite'
import { resolve } from 'path'

function pathResolve (dir: string) {
  return resolve(process.cwd(), '.', dir)
}

export default ({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()

  return {
    root,
    build: {
      rollupOptions: {
        input: {
          app: resolve(__dirname, 'src/main-app.ts')
        },
        output: {
          entryFileNames: '[name].js',
          chunkFileNames: 'chunks/[name].js',
          assetFileNames: 'assets/[name].[ext]'
        }
      }
    },
    resolve: {
      alias: [
        {
          find: '@',
          replacement: pathResolve('examples') + '/'
        }
      ]
    }
  }
}
