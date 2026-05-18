#!/usr/bin/env node
/**
 * vue3-sketch-ruler 2.x → 3.x 自动化迁移脚本
 * M5 W23：扫描源码并自动替换 Breaking Changes
 *
 * 用法：npx vue3-sketch-ruler-migrate <path>
 */

const fs = require('fs')
const path = require('path')

const args = process.argv.slice(2)
const targetDir = args[0] || process.cwd()

const stats = {
  filesScanned: 0,
  filesModified: 0,
  replacements: 0,
  warnings: []
}

const REPLACEMENTS = [
  // 导入路径
  {
    pattern: /from ['"]vue3-sketch-ruler['"]\s*;?/g,
    replacement: "from 'vue3-sketch-ruler'",
    desc: '更新导入路径'
  },
  // 组件名（2.x → 3.x）
  {
    pattern: /<(SketchRule|sketch-rule)\b/g,
    replacement: '<SketchRuler',
    desc: '组件名 SketchRule → SketchRuler'
  },
  {
    pattern: /<\/(SketchRule|sketch-rule)>/g,
    replacement: '</SketchRuler>',
    desc: '组件结束标签 SketchRule → SketchRuler'
  },
  // 组件名（旧 3.x 预览版 SketchRulerV3 → SketchRuler）
  {
    pattern: /SketchRulerV3/g,
    replacement: 'SketchRuler',
    desc: '组件名 SketchRulerV3 → SketchRuler'
  },
  // palette 嵌套配置 → 扁平化
  {
    pattern: /:palette="\{\s*bgColor:\s*['"]([^'"]+)['"]\s*\}"/g,
    replacement: ':palette="{ bgColor: \'$1\' }"',
    desc: 'palette 保持兼容'
  },
  // btn 插槽 → toolbar 插槽
  {
    pattern: /<template\s+#btn\s*>/g,
    replacement: '<template #toolbar="{ tools, state }">',
    desc: '#btn 插槽 → #toolbar 插槽'
  },
  // zoomStart → update:scale
  {
    pattern: /@zoomStart/g,
    replacement: '@update:scale',
    desc: 'zoomStart → update:scale'
  },
  // handleLine 事件
  {
    pattern: /@handleLine\s*=\s*["']([^"']+)["']/g,
    replacement: '@update:lines="$1"',
    desc: 'handleLine → update:lines'
  }
  // v-model:scale 已兼容，无需替换
  // canvasWidth/canvasHeight 已兼容
  // isShowReferLine 已兼容
]

function scanFile(filePath) {
  const ext = path.extname(filePath)
  if (!['.vue', '.ts', '.js', '.tsx', '.jsx'].includes(ext)) return

  let content = fs.readFileSync(filePath, 'utf-8')
  const original = content
  let fileModified = false

  for (const { pattern, replacement, desc } of REPLACEMENTS) {
    const matches = content.match(pattern)
    if (matches) {
      content = content.replace(pattern, replacement)
      stats.replacements += matches.length
      fileModified = true
      console.log(`  [${desc}] ×${matches.length}`)
    }
  }

  // 检测不可自动迁移的模式
  if (/simple-panzoom/.test(content)) {
    stats.warnings.push({
      file: filePath,
      msg: '检测到 simple-panzoom 引用，v3 已内置 TransformEngine，需手动移除'
    })
  }
  if (/useLine\b/.test(content)) {
    stats.warnings.push({
      file: filePath,
      msg: '检测到 useLine 引用，v3 已重构为 StateManager 和 composables'
    })
  }
  if (/lockLine\b/.test(content) && !/update:lockLine/.test(content)) {
    stats.warnings.push({ file: filePath, msg: 'lockLine API 已变更，请查阅迁移指南' })
  }

  if (fileModified) {
    fs.writeFileSync(filePath, content, 'utf-8')
    stats.filesModified++
  }

  stats.filesScanned++
}

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') continue
      scanDir(fullPath)
    } else {
      scanFile(fullPath)
    }
  }
}

function printReport() {
  console.log('\n========== 迁移报告 ==========')
  console.log(`扫描文件: ${stats.filesScanned}`)
  console.log(`修改文件: ${stats.filesModified}`)
  console.log(`自动替换: ${stats.replacements} 处`)

  if (stats.warnings.length > 0) {
    console.log(`\n⚠️  需要手动处理的警告 (${stats.warnings.length} 条):`)
    for (const w of stats.warnings) {
      console.log(`  - ${path.relative(targetDir, w.file)}: ${w.msg}`)
    }
  }

  console.log('\n✅ 迁移完成！请检查变更并运行测试。')
  console.log(
    '📖 详细迁移指南: https://github.com/kakajun/vue3-sketch-ruler/blob/main/MIGRATION.md'
  )
}

console.log(`🔍 扫描目录: ${targetDir}\n`)
scanDir(targetDir)
printReport()
