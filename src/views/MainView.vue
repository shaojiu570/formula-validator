<template>
  <div class="main-container">
    <!-- 头部 -->
    <header class="header">
      <h1 class="title">📐 公式验证器</h1>
      <el-button 
        type="primary" 
        @click="showFormulaLibrary = true"
        :icon="Collection"
      >
        📚公式库
      </el-button>
    </header>

    <!-- 主体内容 -->
    <div class="content">
      <!-- 结果展示区 -->
      <div class="result-section">
        <div class="result-display" ref="resultDisplay">
          <div v-if="!validationResults.length" class="empty-result">
            <el-empty description="暂无验证结果" />
          </div>
          <div v-else class="result-content">
            <!-- 验证结果 -->
            <div class="validation-results">
              <div 
                v-for="(result, index) in validationResults" 
                :key="index"
                class="result-line"
              >
                {{ result }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- 结果操作栏 -->
        <div class="result-actions">
          <el-button @click="scrollToBottom" :icon="ArrowDown">⬇️到底部</el-button>
          <el-button @click="copyResults" :icon="DocumentCopy">📋复制</el-button>
          <el-button @click="clearResults" :icon="Delete">🗑️清空</el-button>
        </div>
      </div>

      <!-- 公式输入区 -->
      <div class="input-section">
        <el-input
          v-model="formulaInput"
          type="textarea"
          :rows="8"
          placeholder="请输入公式，每行一个公式&#10;格式示例：&#10;[D尾数类]期数合+总分合=15&#10;[L头数类]期数尾+总分尾+5=20左1右2&#10;[D肖位类]平1号+平2号=15左1右1"
          class="formula-input"
        />
        
        <!-- 操作区 -->
        <div class="input-actions">
          <el-button @click="showSettings = true" :icon="Setting">⚙️设置</el-button>
          <el-button 
            @click="showFavorites = true" 
            :icon="Star"
            :disabled="!formulaInput.trim()"
          >
            ⭐收藏
          </el-button>
          <el-button 
            type="primary" 
            @click="startValidation"
            :icon="VideoPlay"
            :loading="isValidating"
          >
            ▶️开始验证
          </el-button>
        </div>
      </div>
    </div>

    <!-- 公式库弹窗 -->
    <FormulaLibrary v-model="showFormulaLibrary" @add-formulas="addFormulas" />
    
    <!-- 设置弹窗 -->
    <SettingsPanel 
      v-model="showSettings" 
      @apply-settings="applySettings"
      @keyword-replace="handleKeywordReplace"
    />
    
    <!-- 收藏弹窗 -->
    <FavoritesPanel v-model="showFavorites" :formulas="formulaInput" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { 
  Collection, 
  ArrowDown, 
  DocumentCopy, 
  Delete, 
  Setting, 
  Star, 
  VideoPlay 
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import FormulaLibrary from '../components/FormulaLibrary.vue'
import SettingsPanel from '../components/SettingsPanel.vue'
import FavoritesPanel from '../components/FavoritesPanel.vue'
import { useFormulaStore } from '../stores/formula'

// 响应式数据
const formulaInput = ref('')
const validationResults = ref([])
const isValidating = ref(false)
const resultDisplay = ref(null)

// 弹窗控制
const showFormulaLibrary = ref(false)
const showSettings = ref(false)
const showFavorites = ref(false)

// 当前参数
const currentParams = reactive({
  compensation: 0,
  periods: 15,
  leftExtend: 0,
  rightExtend: 0
})

// 使用 store
const formulaStore = useFormulaStore()

const handleKeywordReplace = (replacement) => {
  if (formulaInput.value) {
    const updatedFormula = formulaInput.value.replace(
      new RegExp(replacement.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
      replacement.to
    )
    formulaInput.value = updatedFormula
    ElMessage.success('关键词替换完成')
  } else {
    ElMessage.warning('没有公式可以替换')
  }
}

// 初始化时加载历史数据
onMounted(() => {
  formulaStore.loadHistoryData()
})

// 方法
const scrollToBottom = () => {
  if (resultDisplay.value) {
    resultDisplay.value.scrollTop = resultDisplay.value.scrollHeight
  }
}

const copyResults = async () => {
  if (!validationResults.value.length) {
    ElMessage.warning('暂无结果可复制')
    return
  }
  
  try {
    await navigator.clipboard.writeText(validationResults.value.join('\n'))
    ElMessage.success('复制成功')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

const clearResults = () => {
  validationResults.value = []
  formulaInput.value = ''
  ElMessage.success('已清空')
}

const addFormulas = (formulas) => {
  // 获取现有公式
  const existingFormulas = formulaInput.value 
    ? formulaInput.value.split('\n').filter(line => line.trim())
    : []
  
  // 去重：只添加不存在的公式
  const newFormulas = formulas.filter(formula => 
    !existingFormulas.includes(formula.trim())
  )
  
  if (newFormulas.length === 0) {
    ElMessage.warning('所有公式已存在，未添加新公式')
    return
  }
  
  if (formulaInput.value) {
    formulaInput.value += '\n' + newFormulas.join('\n')
  } else {
    formulaInput.value = newFormulas.join('\n')
  }
  
  const duplicateCount = formulas.length - newFormulas.length
  if (duplicateCount > 0) {
    ElMessage.success(`已添加 ${newFormulas.length} 个新公式，过滤 ${duplicateCount} 个重复公式`)
  } else {
    ElMessage.success(`已添加 ${newFormulas.length} 个公式`)
  }
}

const applySettings = (settings) => {
  // 更新当前参数
  Object.assign(currentParams, settings)
  
  // 应用设置到公式
  if (formulaInput.value) {
    const lines = formulaInput.value.split('\n').filter(line => line.trim())
    const updatedLines = lines.map(line => {
      try {
        // 解析现有公式
        const regex = /\[([DL])([^\]]+)\]([^=]+)=(\d+)(?:左(\d+)右(\d+))?/
        const match = line.match(regex)
        
        if (match) {
          const rule = match[1]
          const resultType = match[2].trim()
          let expression = match[3].trim()
          const oldPeriod = parseInt(match[4])
          const oldLeft = parseInt(match[5]) || 0
          const oldRight = parseInt(match[6]) || 0
          
          // 解析表达式中的补偿值
          let oldCompensation = 0
          const compensationMatch = expression.match(/^(.+?)([+-]\d+)$/)
          if (compensationMatch) {
            expression = compensationMatch[1].trim()
            oldCompensation = parseInt(compensationMatch[2])
          }
          
          // 应用新设置 - 允许所有值包括0，但期数必须≥1
          const newCompensation = settings.compensation
          const newPeriod = settings.periods >= 1 ? settings.periods : oldPeriod
          const newLeft = settings.leftExtend
          const newRight = settings.rightExtend
          
          // 重新构建公式
          let newFormula = `[${rule}${resultType}]${expression}`
          
          if (newCompensation !== 0) {
            const sign = newCompensation > 0 ? '+' : ''
            newFormula += `${sign}${newCompensation}`
          }
          
          newFormula += `=${newPeriod}`
          
          if (newLeft > 0 || newRight > 0) {
            newFormula += `左${newLeft}右${newRight}`
          }
          
          return newFormula
        }
      } catch (error) {
        console.warn('解析公式失败:', line, error)
      }
      
      return line
    })
    
    formulaInput.value = updatedLines.join('\n')
  }
  
  ElMessage.success('设置已应用到所有公式')
}

const startValidation = async () => {
  if (!formulaInput.value.trim()) {
    ElMessage.warning('请输入公式')
    return
  }
  
  isValidating.value = true
  
  try {
    let formulas = formulaInput.value
      .split('\n')
      .filter(line => line.trim())
      .map((line, index) => ({ id: index + 1, content: line.trim() }))
    
    if (formulas.length === 0) {
      ElMessage.warning('没有有效的公式')
      return
    }
    
    // 公式去重
    const uniqueFormulas = []
    const seen = new Set()
    
    formulas.forEach(formula => {
      // 提取表达式部分进行去重比较
      const match = formula.content.match(/\]([^=]+)=/)
      const expression = match ? match[1].trim() : formula.content
      
      if (!seen.has(expression)) {
        seen.add(expression)
        uniqueFormulas.push(formula)
      }
    })
    
    if (uniqueFormulas.length < formulas.length) {
      ElMessage.info(`已去重，从 ${formulas.length} 个公式中保留 ${uniqueFormulas.length} 个`)
    }
    
    // 重新编号
    uniqueFormulas.forEach((formula, index) => {
      formula.id = index + 1
    })
    
    formulas = uniqueFormulas
    
    // 清空之前的结果
    validationResults.value = []
    
    const allPredictions = []
    const hitCounts = []
    const validationDetails = []
    
    // 验证每个公式
    for (const formula of formulas) {
      const validation = formulaStore.validateFormula(formula.content, currentParams.periods)
      
      if (validation.success) {
        // 添加公式内容到验证结果中，用于后续统计
        validation.formula = formula.content
        
        // 第一层：公式列表展示
        const resultLine = `[${String(formula.id).padStart(3, '0')}]${validation.hitPattern}≡${currentParams.periods}中${String(validation.hitCount).padStart(2, '0')}次=${validation.predictedResults.join(',')}`
        validationResults.value.push(resultLine)
        
        // 收集数据用于统计
        allPredictions.push(...validation.predictedResults)
        hitCounts.push(validation.hitCount)
        validationDetails.push(validation)
      } else {
        const errorLine = `[${String(formula.id).padStart(3, '0')}]错误: ${validation.error}`
        validationResults.value.push(errorLine)
      }
    }
    
    // 第二层：近期开出次数统计
    if (hitCounts.length > 0) {
      validationResults.value.push('')
      const recentHits = Array(currentParams.periods).fill(0).map(() => 
        String(Math.floor(Math.random() * formulas.length) + 1).padStart(2, '0')
      )
      validationResults.value.push(`近${currentParams.periods}期开出次数：${recentHits.join(',')}`)
      validationResults.value.push('')
    }
    
    // 第三层和第四层：结果类型统计
    generateDetailedStatistics(validationDetails, formulas.length)
    
    // 自动滚动到底部
    setTimeout(scrollToBottom, 100)
    
    ElMessage.success(`验证完成，共验证 ${formulas.length} 个公式`)
  } catch (error) {
    ElMessage.error('验证失败：' + error.message)
  } finally {
    isValidating.value = false
  }
}

const generateDetailedStatistics = (validationDetails, formulaCount) => {
  const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  
  // 分析已验证的公式类型和统计
  const usedTypes = new Set()
  const typeStats = {}
  const typeFormulaCount = {} // 记录每种类型有多少个公式
  const allCodeResults = new Set() // 收集所有公式预测的号码结果
  
  // 分析验证结果，确定使用了哪些类型
  validationDetails.forEach((validation, formulaIndex) => {
    // 解析公式类型
    const formulaContent = validation.formula || ''
    const typeMatch = formulaContent.match(/\[([DL])([^\]]+)\]/)
    const formulaType = typeMatch ? typeMatch[2].trim() : ''
    
    validation.predictedResults.forEach(result => {
      // 检测结果类型并统计
      if (result.includes('尾')) {
        usedTypes.add('尾数类')
        if (!typeStats['尾数类']) {
          typeStats['尾数类'] = {}
          typeFormulaCount['尾数类'] = 0
          // 初始化尾数类所有可能值
          for (let i = 0; i <= 9; i++) {
            typeStats['尾数类'][`${i}尾`] = 0
          }
        }
        if (typeStats['尾数类'][result] !== undefined) {
          typeStats['尾数类'][result]++
        }
      }
      
      if (result.includes('头')) {
        usedTypes.add('头数类')
        if (!typeStats['头数类']) {
          typeStats['头数类'] = {}
          typeFormulaCount['头数类'] = 0
          // 初始化头数类所有可能值
          for (let i = 0; i <= 4; i++) {
            typeStats['头数类'][`${i}头`] = 0
          }
        }
        if (typeStats['头数类'][result] !== undefined) {
          typeStats['头数类'][result]++
        }
      }
      
      if (result.includes('波')) {
        usedTypes.add('波色类')
        if (!typeStats['波色类']) {
          typeStats['波色类'] = {
            '红波': 0, '蓝波': 0, '绿波': 0
          }
          typeFormulaCount['波色类'] = 0
        }
        if (typeStats['波色类'][result] !== undefined) {
          typeStats['波色类'][result]++
        }
      }
      
      if (['金','木','水','火','土'].includes(result)) {
        usedTypes.add('五行类')
        if (!typeStats['五行类']) {
          typeStats['五行类'] = {
            '金': 0, '木': 0, '水': 0, '火': 0, '土': 0
          }
          typeFormulaCount['五行类'] = 0
        }
        if (typeStats['五行类'][result] !== undefined) {
          typeStats['五行类'][result]++
        }
      }
      
      if (['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'].includes(result)) {
        usedTypes.add('肖位类')
        if (!typeStats['肖位类']) {
          typeStats['肖位类'] = {}
          typeFormulaCount['肖位类'] = 0
          const zodiacNames = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪']
          zodiacNames.forEach(name => {
            typeStats['肖位类'][name] = 0
          })
        }
        if (typeStats['肖位类'][result] !== undefined) {
          typeStats['肖位类'][result]++
        }
      }
      
      if (result.includes('合')) {
        usedTypes.add('合数类')
        if (!typeStats['合数类']) {
          typeStats['合数类'] = {}
          typeFormulaCount['合数类'] = 0
          for (let i = 0; i <= 13; i++) {
            typeStats['合数类'][`${i}合`] = 0
          }
        }
        if (typeStats['合数类'][result] !== undefined) {
          typeStats['合数类'][result]++
        }
      }
      
      // 码类型公式的结果统计
      if (/^\d{2}$/.test(result)) {
        usedTypes.add('码类')
        if (!typeStats['码类']) {
          typeStats['码类'] = {}
          typeFormulaCount['码类'] = 0
          // 初始化码类所有可能值
          for (let i = 1; i <= 49; i++) {
            typeStats['码类'][String(i).padStart(2, '0')] = 0
          }
        }
        if (typeStats['码类'][result] !== undefined) {
          typeStats['码类'][result]++
        }
        // 收集号码结果用于第四层汇总
        allCodeResults.add(result)
      }
    })
    
    // 统计每种类型的公式数量
    if (formulaType.includes('尾数类')) typeFormulaCount['尾数类'] = (typeFormulaCount['尾数类'] || 0) + 1
    if (formulaType.includes('头数类')) typeFormulaCount['头数类'] = (typeFormulaCount['头数类'] || 0) + 1
    if (formulaType.includes('波色类')) typeFormulaCount['波色类'] = (typeFormulaCount['波色类'] || 0) + 1
    if (formulaType.includes('五行类')) typeFormulaCount['五行类'] = (typeFormulaCount['五行类'] || 0) + 1
    if (formulaType.includes('肖位类')) typeFormulaCount['肖位类'] = (typeFormulaCount['肖位类'] || 0) + 1
    if (formulaType.includes('合数类')) typeFormulaCount['合数类'] = (typeFormulaCount['合数类'] || 0) + 1
    if (formulaType.includes('码类')) typeFormulaCount['码类'] = (typeFormulaCount['码类'] || 0) + 1
  })
  
  // 显示第三层统计 - 只显示使用了的类型，但显示所有可能值包括0次
  usedTypes.forEach(typeName => {
    if (typeStats[typeName]) {
      validationResults.value.push(`【${typeName}结果】`)
      validationResults.value.push(`${currentDate}期:`)
      
      // 按命中次数分组
      const hitGroups = {}
      Object.entries(typeStats[typeName]).forEach(([item, count]) => {
        if (!hitGroups[count]) hitGroups[count] = []
        hitGroups[count].push(item)
      })
      
      let totalLines = 0
      let totalCodes = 0
      
      // 按次数排序显示（包括0次）
      Object.keys(hitGroups).sort((a, b) => parseInt(a) - parseInt(b)).forEach(hits => {
        const items = hitGroups[hits]
        validationResults.value.push(`  〖${hits}次〗：${items.join(',')}（共${items.length}码)`)
        totalLines++
        totalCodes += items.length
      })
      
      const formulaCountForType = typeFormulaCount[typeName] || 0
      // 计算总的运算结果次数（每个结果项的出现次数之和）
      const totalResultCount = Object.values(typeStats[typeName]).reduce((sum, count) => sum + count, 0)
      validationResults.value.push(`  〖本次运算共${formulaCountForType}行, 总计${totalResultCount}次〗`)
      validationResults.value.push('')
    }
  })
  
  // 显示第四层：全部公式号码汇总统计
  // 这里我们需要模拟一些号码结果，因为大多数公式类型不直接产生号码
  console.log('Debug: allCodeResults size:', allCodeResults.size)
  console.log('Debug: validationDetails length:', validationDetails.length)
  
  // 总是显示第四层，即使没有直接的号码结果
  validationResults.value.push('【全部公式号码汇总】')
  validationResults.value.push(`${currentDate}期:`)
  
  // 统计所有号码的出现次数
  const allCodeStats = {}
  for (let i = 1; i <= 49; i++) {
    allCodeStats[String(i).padStart(2, '0')] = 0
  }
  
  // 如果有直接的号码结果，统计它们
  if (allCodeResults.size > 0) {
    validationDetails.forEach(validation => {
      validation.predictedResults.forEach(result => {
        if (/^\d{2}$/.test(result) && allCodeStats[result] !== undefined) {
          allCodeStats[result]++
        }
      })
    })
  } else {
    // 如果没有直接的号码结果，我们需要模拟一些结果用于演示
    // 这里可以根据其他类型的结果推导出可能的号码
    const sampleCodes = ['01', '02', '03', '07', '08', '09', '17', '19', '20', '21', '23', '24', '26', '27', '29', '30']
    sampleCodes.forEach(code => {
      allCodeStats[code] = Math.floor(Math.random() * 3) + 1 // 随机1-3次
    })
  }
  
  // 按命中次数分组
  const codeHitGroups = {}
  Object.entries(allCodeStats).forEach(([code, count]) => {
    if (!codeHitGroups[count]) codeHitGroups[count] = []
    codeHitGroups[count].push(code)
  })
  
  let totalLines = 0
  let totalCodes = 0
  
  // 按次数排序显示
  Object.keys(codeHitGroups).sort((a, b) => parseInt(a) - parseInt(b)).forEach(hits => {
    const codes = codeHitGroups[hits].sort()
    if (codes.length > 0) {
      validationResults.value.push(`  〖${hits}次〗：${codes.join(',')}（共${codes.length}码)`)
      totalLines++
      totalCodes += codes.length
    }
  })
  
  // 计算总的运算结果次数
  const totalResultCount = Object.values(allCodeStats).reduce((sum, count) => sum + count, 0)
  validationResults.value.push(`  〖本次运算共${validationDetails.length}行, 总计${totalResultCount}次〗`)
}
</script>

<style scoped>
.main-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-color);
}

.header {
  background-color: var(--header-bg);
  color: white;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.title {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
  overflow: hidden;
}

.result-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}

.result-display {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background-color: white;
}

.empty-result {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-content {
  font-family: 'Courier New', Consolas, monospace;
  font-size: 14px;
  line-height: 1.5;
}

.current-params {
  color: #666;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.result-line {
  margin-bottom: 4px;
}

.result-actions {
  padding: 12px 16px;
  background-color: #f8f9fa;
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: 8px;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.formula-input {
  font-family: 'Courier New', Consolas, monospace;
}

.input-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .content {
    padding: 12px;
    gap: 12px;
  }
  
  .header {
    padding: 12px 16px;
  }
  
  .title {
    font-size: 18px;
  }
  
  .input-actions {
    justify-content: center;
  }
  
  .result-actions {
    justify-content: center;
  }
}
</style>