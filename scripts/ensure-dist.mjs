import fs from 'node:fs'
import path from 'node:path'

const dist = path.resolve('dist')
const index = path.join(dist, 'index.html')

if (!fs.existsSync(index)) {
  console.error('Missing dist/index.html — run: npm run build')
  process.exit(1)
}

const assetDirs = ['bundle', 'assets'].map((d) => path.join(dist, d))
const assetDir = assetDirs.find((d) => fs.existsSync(d))

if (!assetDir) {
  console.error('Missing dist/bundle or dist/assets — run: npm run build')
  process.exit(1)
}

const files = fs.readdirSync(assetDir)
const js = files.filter((f) => f.endsWith('.js'))
const css = files.filter((f) => f.endsWith('.css'))

if (js.length === 0 || css.length === 0) {
  console.error(`No JS/CSS in ${assetDir}:`, files)
  process.exit(1)
}

console.log(`OK: ${js.length} JS, ${css.length} CSS in ${path.relative(process.cwd(), assetDir)}`)
