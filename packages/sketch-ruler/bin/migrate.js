#!/usr/bin/env node
/**
 * vue3-sketch-ruler 2.x → 3.x 自动化迁移脚本
 *
 * 用法：
 *   npx vue3-sketch-ruler-migrate <path>        # 直接替换
 *   npx vue3-sketch-ruler-migrate <path> --dry  # 仅预览，不写入文件
 */

import fs from 'node:fs'
import path from 'node:path'

const args = process.argv.slice(2)
const dryRun = args.includes('--dry')
const targetDir = args.find((a) => !a.startsWith('-')) || process.cwd()

const stats = {
  filesScanned: 0,
  filesModified: 0,
  replacements: 0,
  warnings: []
}

const REPLACEMENTS = [
  // 1. 默认导入 → 命名导入
  {
    pattern: /import\s+(\w+)\s+from\s+['"]vue3-sketch-ruler['"]\s*;?/g,
    replacement: "import { SketchRuler } from 'vue3-sketch-ruler'",
    desc: '默认导入 → 命名导入 SketchRuler'
  },
  // 2. 组件名（标签开头）
  {
    pattern: /<(SketchRule|sketch-rule)\b/g,
    replacement: '<SketchRuler',
    desc: '组件名 SketchRule → SketchRuler'
  },
  // 3. 组件结束标签
  {
    pattern: /<\/(SketchRule|sketch-rule)>/g,
    replacement: '</SketchRuler>',
    desc: '结束标签 SketchRule → SketchRuler'
  },
  // 4. 旧 3.x 预览版组件名
  {
    pattern: /SketchRulerV3/g,
    replacement: 'SketchRuler',
    desc: '组件名 SketchRulerV3 → SketchRuler'
  },
  // 5. #btn 插槽 → #toolbar 插槽（无作用域参数或简单参数）
  {
    pattern: /<template\s+#btn(\s*=[^>]*)?>/g,
    replacement: '<template #toolbar="{ tools, state }">',
    desc: '#btn 插槽 → #toolbar 插槽'
  },
  // 6. zoomStart → update:scale
  {
    pattern: /@zoomStart\b/g,
    replacement: '@update:scale',
    desc: 'zoomStart → update:scale'
  },
  // 7. handleLine → update:lines
  {
    pattern: /@handleLine\b/g,
    replacement: '@update:lines',
    desc: 'handleLine → update:lines'
  },
  // 8. palette 旧属性：lineType → guideLineStyle
  {
    pattern: /\blineType\b/g,
    replacement: 'guideLineStyle',
    desc: 'palette.lineType → guideLineStyle'
  },
  // 9. palette 旧属性：lineColor → guideLineColor
  {
    pattern: /\blineColor\b/g,
    replacement: 'guideLineColor',
    desc: 'palette.lineColor → guideLineColor'
  },
  // 10. palette 旧属性：longfgColor → tickColor
  {
    pattern: /\blongfgColor\b/g,
    replacement: 'tickColor',
    desc: 'palette.longfgColor → tickColor'
  },
  // 11. palette 旧属性：fontColor → labelColor
  {
    pattern: /\bfontColor\b/g,
    replacement: 'labelColor',
    desc: 'palette.fontColor → labelColor'
  }
  // 12. shadowColor（2.x 可能指 ruler shadow）→ shadowColor（3.x 保留，但语义变化，这里只做名称兼容）
  // 不做替换，因为 3.x 也有 shadowColor，只是从 palette 移到 palette
]

function addWarning(filePath, msg) {
  stats.warnings.push({ file: filePath, msg })
}

function scanFile(filePath) {
  const ext = path.extname(filePath)
  if (!['.vue', '.ts', '.js', '.tsx', '.jsx', '.mjs', '.cjs'].includes(ext)) return

  let content = fs.readFileSync(filePath, 'utf-8')
  const original = content
  let fileModified = false
  const fileRel = path.relative(targetDir, filePath)

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
    addWarning(
      filePath,
      '检测到 simple-panzoom 引用，v3 已内置 TransformEngine，需手动移除并替换相关调用（如 panzoomInstance.zoom() → sketchRef.value.setTransform()）'
    )
  }
  if (/useLine\b/.test(content)) {
    addWarning(
      filePath,
      '检测到 useLine 引用，v3 已重构为内部状态管理，请改用 v-model:lines 或 ref 访问 guideLines'
    )
  }
  if (/\bpanzoomOption\b/.test(content)) {
    addWarning(
      filePath,
      '检测到 panzoomOption，v3 已移除该属性，请改用 zoomMode / zoomStep / minZoom / maxZoom / enableAnimation / animationMode / autoCenter / initialOffset'
    )
  }
  if (/\bshowShadowText\b/.test(content)) {
    addWarning(filePath, '检测到 showShadowText，v3 已移除该属性，请直接移除')
  }
  if (
    /\blockLine\b/.test(content) &&
    !/update:lockLine/.test(content) &&
    !/v-model:lockLine/.test(content)
  ) {
    addWarning(
      filePath,
      '检测到 lockLine 使用方式可能已变更，v3 支持 v-model:lockLine 和 @update:lockLine'
    )
  }
  if (/#btn\b/.test(original)) {
    addWarning(
      filePath,
      '#btn 插槽参数结构已变更：原 { reset, zoomIn, zoomOut } → 现 { tools: { reset, zoomIn, zoomOut, zoomToPreset, setZoomMode, toggleReferLine }, state: { scale, offset, zoomMode, showReferLine } }，请手动调整模板内调用'
    )
  }
  if (/\bpanzoomInstance\b/.test(content)) {
    addWarning(
      filePath,
      'panzoomInstance 已移除，请改用 sketchRef.value.engine（TransformEngine 实例）'
    )
  }
  if (/@zoomchange\b/.test(original)) {
    addWarning(
      filePath,
      'zoomchange 事件参数已变更：原 PanzoomEventDetail → 现 { scale: number, x: number, y: number }，请检查回调签名'
    )
  }

  if (fileModified) {
    if (dryRun) {
      console.log(`  (dry-run) 将修改: ${fileRel}`)
    } else {
      fs.writeFileSync(filePath, content, 'utf-8')
      stats.filesModified++
    }
  }

  stats.filesScanned++
}

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (
        entry.name === 'node_modules' ||
        entry.name === '.git' ||
        entry.name === 'dist' ||
        entry.name === 'lib'
      )
        continue
      scanDir(fullPath)
    } else {
      scanFile(fullPath)
    }
  }
}

function printReport() {
  const mode = dryRun ? '【预览模式】' : ''
  console.log(`\n========== 迁移报告 ${mode}==========`)
  console.log(`扫描文件: ${stats.filesScanned}`)
  console.log(`修改文件: ${dryRun ? '(dry-run 未实际写入)' : stats.filesModified}`)
  console.log(`自动替换: ${stats.replacements} 处`)

  if (stats.warnings.length > 0) {
    console.log(`\n⚠️  需要手动处理的警告 (${stats.warnings.length} 条):`)
    for (const w of stats.warnings) {
      console.log(`  - ${path.relative(targetDir, w.file)}: ${w.msg}`)
    }
  }

  if (dryRun) {
    console.log('\n🏃 本次为预览模式，未实际修改任何文件。去掉 --dry 参数即可执行真实替换。')
  }
  console.log('\n✅ 迁移扫描完成！请检查变更并运行测试。')
  console.log(
    '📖 详细迁移指南: https://github.com/kakajun/vue3-sketch-ruler/blob/main/README.md#2x--3x-迁移指南'
  )
}

console.log(`🔍 扫描目录: ${targetDir}${dryRun ? ' (dry-run)' : ''}\n`)
scanDir(targetDir)
printReport()
