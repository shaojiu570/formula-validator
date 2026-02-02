<template>
  <div class="test-panel">
    <h3>功能测试面板</h3>
    
    <div class="test-section">
      <h4>示例公式</h4>
      <div class="formula-examples">
        <div 
          v-for="(formula, index) in exampleFormulas" 
          :key="index"
          class="formula-example"
          @click="useFormula(formula)"
        >
          {{ formula }}
        </div>
      </div>
    </div>
    
    <div class="test-section">
      <h4>快速测试</h4>
      <el-button @click="testValidation">测试验证功能</el-button>
      <el-button @click="testElements">测试元素计算</el-button>
      <el-button @click="testParsing">测试公式解析</el-button>
    </div>
    
    <div class="test-section" v-if="testResults.length">
      <h4>测试结果</h4>
      <div class="test-results">
        <div 
          v-for="(result, index) in testResults" 
          :key="index"
          class="test-result"
        >
          {{ result }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useFormulaStore } from '../stores/formula'

const emit = defineEmits(['use-formula'])

const formulaStore = useFormulaStore()
const testResults = ref([])

const exampleFormulas = [
  '[D尾数类]期数合+总分合=15',
  '[L头数类]期数尾+总分尾=15',
  '[D肖位类]平1号+平2号=15左1右1',
  '[L波色类]特号+平6号=15',
  '[D合数类]期数合+总分合+5=15',
  '[L五行类]平1尾+平2尾-3=15',
  '[D码类]平1号+特号=15左1右3'
]

const useFormula = (formula) => {
  emit('use-formula', formula)
  ElMessage.success('已添加公式到输入区')
}

const testValidation = () => {
  testResults.value = []
  
  const testFormula = '[D尾数类]期数合+总分合=15'
  const result = formulaStore.validateFormula(testFormula, 5)
  
  if (result.success) {
    testResults.value.push(`验证成功: 命中率 ${result.hitRate}%`)
    testResults.value.push(`命中模式: ${result.hitPattern}`)
    testResults.value.push(`预测结果: ${result.predictedResults.join(', ')}`)
  } else {
    testResults.value.push(`验证失败: ${result.error}`)
  }
}

const testElements = () => {
  testResults.value = []
  
  const testData = {
    period: 20260124,
    numbers: [1, 13, 25, 37, 49, 2, 14],
    totalSum: 141
  }
  
  const elements = ['期数', '期数尾', '期数合', '总分', '总分尾', '平1号', '平1尾', '特号', '特尾']
  
  elements.forEach(element => {
    const value = formulaStore.getElementValue(element, testData)
    testResults.value.push(`${element}: ${value}`)
  })
}

const testParsing = () => {
  testResults.value = []
  
  const testFormulas = [
    '[D尾数类]期数合+总分合=15',
    '[L头数类]期数尾+总分尾+5=20左2右3',
    '[D肖位类]平一号+平二号=十五'
  ]
  
  testFormulas.forEach(formula => {
    try {
      const parsed = formulaStore.parseFormula(formula)
      testResults.value.push(`解析成功: ${formula}`)
      testResults.value.push(`  规则: ${parsed.rule}, 类型: ${parsed.resultType}`)
      testResults.value.push(`  表达式: ${parsed.expression}, 期数: ${parsed.period}`)
      testResults.value.push(`  补偿: ${parsed.compensation}, 扩展: ${parsed.leftExtend}-${parsed.rightExtend}`)
    } catch (error) {
      testResults.value.push(`解析失败: ${formula} - ${error.message}`)
    }
  })
}
</script>

<style scoped>
.test-panel {
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin: 20px 0;
}

.test-section {
  margin-bottom: 20px;
}

.test-section h4 {
  margin-bottom: 12px;
  color: #333;
}

.formula-examples {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.formula-example {
  padding: 8px 12px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  cursor: pointer;
  font-family: monospace;
  font-size: 14px;
  transition: all 0.3s ease;
}

.formula-example:hover {
  background: #e9ecef;
  border-color: var(--primary-color);
}

.test-results {
  max-height: 300px;
  overflow-y: auto;
  background: #f8f9fa;
  padding: 12px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 14px;
}

.test-result {
  margin-bottom: 4px;
  color: #666;
}
</style>