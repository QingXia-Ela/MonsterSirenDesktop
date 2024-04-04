/**
 * @file
 * 
 * Move `src-tauri/bindings` to `packages/types`
 */

const fs = require('fs')
const path = require('path')

const srcDir = path.resolve(__dirname, '../src-tauri/bindings')
const destDir = path.resolve(__dirname, '../packages/types/bindings')

fs.cpSync(srcDir, destDir, { recursive: true })