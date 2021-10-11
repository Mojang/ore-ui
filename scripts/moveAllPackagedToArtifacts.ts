import fs from 'fs-extra'
import path from 'path'
import glob from 'glob'
import { green } from 'chalk'

const artifactsFolderPath = path.resolve(__dirname, '..', 'artifacts')
const packagesFolderPath = path.resolve(__dirname, '..', 'packages')
const tgzsGlob = path.join(packagesFolderPath, '*', '*', '*.tgz')

try {
  fs.removeSync(artifactsFolderPath)
} catch (e) {}

const allTgzs = glob.sync(tgzsGlob)

fs.mkdirSync(artifactsFolderPath)

allTgzs.forEach((filePath) => {
  const fileName = path.basename(filePath)
  fs.moveSync(path.resolve(__dirname, filePath), path.resolve(artifactsFolderPath, fileName))
})

console.log(green('All .tgz packages placed in the artifacts/ folder'))
