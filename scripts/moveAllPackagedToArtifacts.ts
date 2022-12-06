import { removeSync, mkdirSync, moveSync } from 'fs-extra'
import path from 'path'
import { sync as globSync } from 'glob'
import { green } from 'chalk'

const artifactsFolderPath = path.resolve(__dirname, '..', 'artifacts')
const packagesFolderPath = path.resolve(__dirname, '..', 'packages')
const tgzsGlob = path.join(packagesFolderPath, '*', '*', '*.tgz')

try {
  removeSync(artifactsFolderPath)
} catch (e) {}

const allTgzs = globSync(tgzsGlob)

mkdirSync(artifactsFolderPath)

allTgzs.forEach((filePath) => {
  const fileName = path.basename(filePath)
  moveSync(path.resolve(__dirname, filePath), path.resolve(artifactsFolderPath, fileName))
})

console.log(green('All .tgz packages placed in the artifacts/ folder'))
