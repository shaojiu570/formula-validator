<template>
  <div class="search-formula">
    <!-- 参数设置 -->
    <div class="params-section">
      <h4>⚙️ 参数设置（独立于主界面设置）</h4>
      <div class="params-row">
        <div class="param-item">
          <label>补偿值:</label>
          <el-input-number v-model="params.compensation" :min="-999" :max="999" size="small" />
        </div>
        <div class="param-item">
          <label>期数:</label>
          <el-input-number v-model="params.periods" :min="1" :max="100" size="small" />
        </div>
        <div class="param-item">
          <label>左:</label>
          <el-input-number v-model="params.leftExtend" :min="0" :max="20" size="small" />
        </div>
        <div class="param-item">
          <label>右:</label>
          <el-input-number v-model="params.rightExtend" :min="0" :max="20" size="small" />
        </div>
      </div>
    </div>

    <!-- 选择结果类型 -->
    <div class="result-types-section">
      <h4>📊 选择结果类型（7种可选）</h4>
      <div class="result-types">
        <el-checkbox-group v-model="selectedTypes">
          <el-checkbox label="tail">🔢尾数类</el-checkbox>
          <el-checkbox label="head">🎯头数类</el-checkbox>
          <el-checkbox label="sum">➕合数类</el-checkbox>
          <el-checkbox label="wave">🌈波色类</el-checkbox>
          <el-checkbox label="element">🔥五行类</el-checkbox>
          <el-checkbox label="zodiac">🐲肖位类</el-checkbox>
          <el-checkbox label="code">🎲码类</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>

    <!-- 智能搜索设置 -->
    <div class="intelligent-section">
      <h4>🎯 智能搜索设置</h4>
      
      <div class="intelligent-params">
        <div class="param-item">
          <label>目标命中率:</label>
          <el-slider 
            v-model="intelligentParams.targetHitRate" 
            :min="60" 
            :max="100" 
            :step="5"
            show-stops
          />
          <span class="value-display">{{ intelligentParams.targetHitRate }}%</span>
        </div>
        
        <div class="param-item">
          <label>最大结果数:</label>
          <el-input-number 
            v-model="intelligentParams.maxResults" 
            :min="10" 
            :max="500" 
            :step="10"
            size="small" 
          />
        </div>
        
        <div class="param-item">
          <label>搜索策略:</label>
          <el-radio-group v-model="intelligentParams.searchMode" size="small">
            <el-radio label="fast">⚡快速模式（10-30秒）</el-radio>
            <el-radio label="standard">🎯标准模式（30-60秒）</el-radio>
            <el-radio label="deep">🔍深度模式（1-3分钟）</el-radio>
          </el-radio-group>
        </div>
      </div>
      
      <div class="search-actions">
        <el-button 
          type="primary" 
          size="large"
          @click="startIntelligentSearch" 
          :loading="isSearching"
          :disabled="selectedTypes.length === 0"
        >
          🚀 开始智能搜索
        </el-button>
        <el-button 
          v-if="isSearching"
          size="large"
          @click="stopSearch"
        >
          ⏸️ 停止搜索
        </el-button>
      </div>
      
      <!-- 搜索进度 -->
      <div v-if="isSearching" class="search-progress">
        <el-progress :percentage="searchProgress.percentage" :status="searchProgress.status" />
        <div class="progress-info">
          <span>已搜索: {{ searchProgress.searched }}/{{ searchProgress.total }}</span>
          <span>已找到: {{ searchProgress.found }} 个高命中公式</span>
          <span v-if="searchProgress.bestHitRate > 0">当前最高: {{ searchProgress.bestHitRate }}%</span>
        </div>
      </div>
      
      <!-- 搜索结果 -->
      <div v-if="searchResults.length > 0" class="search-results">
        <h4>🎯 搜索结果（找到 {{ searchResults.length }} 个高命中公式）</h4>
        <div class="results-actions">
          <el-button size="small" @click="selectAllResults">全选</el-button>
          <el-button size="small" @click="clearSelection">清空选择</el-button>
          <el-button 
            type="primary" 
            size="small" 
            @click="addSelectedResults"
            :disabled="selectedResults.length === 0"
          >
            添加选中 ({{ selectedResults.length }})
          </el-button>
        </div>
        <div class="results-list">
          <div 
            v-for="(result, index) in searchResults" 
            :key="index"
            class="result-item"
            :class="{ selected: selectedResults.includes(index) }"
            @click="toggleResultSelection(index)"
          >
            <el-checkbox :model-value="selectedResults.includes(index)" />
            <div class="result-content">
              <div class="result-header">
                <span class="hit-rate">✅ 命中率: {{ result.hitRate }}%</span>
                <span class="hit-count">({{ params.periods }}期中{{ result.hitCount }}次)</span>
              </div>
              <div class="result-formula">{{ result.formula }}</div>
              <div class="result-prediction">预测: {{ result.predictedResults.join(',') }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useFormulaStore } from '../stores/formula'

const emit = defineEmits(['add-formulas'])

const formulaStore = useFormulaStore()

// 响应式数据
const params = reactive({
  compensation: 0,
  periods: 15,
  leftExtend: 0,
  rightExtend: 0
})

// 智能搜索参数
const intelligentParams = reactive({
  targetHitRate: 80,
  maxResults: 100,
  searchMode: 'standard'
})

// 搜索状态
const isSearching = ref(false)
const searchProgress = reactive({
  percentage: 0,
  searched: 0,
  total: 0,
  found: 0,
  bestHitRate: 0,
  status: ''
})

// 搜索结果
const searchResults = ref([])
const selectedResults = ref([])

const selectedTypes = ref(['tail'])

// 计算属性
const elements = computed(() => formulaStore.elements)

// 智能搜索相关方法
const startIntelligentSearch = async () => {
  if (selectedTypes.value.length === 0) {
    ElMessage.warning('请至少选择1种结果类型')
    return
  }
  
  isSearching.value = true
  searchResults.value = []
  selectedResults.value = []
  
  Object.assign(searchProgress, {
    percentage: 0,
    searched: 0,
    total: 0,
    found: 0,
    bestHitRate: 0,
    status: ''
  })
  
  try {
    const searchLimits = {
      fast: 1000,
      standard: 3000,
      deep: 10000
    }
    
    const maxSearch = searchLimits[intelligentParams.searchMode]
    searchProgress.total = maxSearch
    
    const allElements = [
      ...elements.value.period,
      ...elements.value.total,
      ...elements.value.ping.slice(0, 30),
      ...elements.value.special
    ]
    
    const results = []
    let searchCount = 0
    
    const typeMap = {
      tail: '尾数类',
      head: '头数类',
      sum: '合数类',
      wave: '波色类',
      element: '五行类',
      zodiac: '肖位类',
      code: '码类'
    }
    
    while (searchCount < maxSearch && results.length < intelligentParams.maxResults) {
      const elementCount = Math.floor(Math.random() * 3) + 2
      const shuffled = [...allElements].sort(() => 0.5 - Math.random())
      const selectedEls = shuffled.slice(0, elementCount)
      
      const randomType = selectedTypes.value[Math.floor(Math.random() * selectedTypes.value.length)]
      const rule = Math.random() > 0.5 ? 'D' : 'L'
      const expression = selectedEls.join('+')
      
      let formula = `[${rule}${typeMap[randomType]}]${expression}=${params.periods}`
      
      if (params.compensation !== 0) {
        const sign = params.compensation > 0 ? '+' : ''
        formula = `[${rule}${typeMap[randomType]}]${expression}${sign}${params.compensation}=${params.periods}`
      }
      
      if (params.leftExtend > 0 || params.rightExtend > 0) {
        formula += `左${params.leftExtend}右${params.rightExtend}`
      }
      
      try {
        const validation = formulaStore.validateFormula(formula, params.periods)
        
        if (validation.success && validation.hitRate >= intelligentParams.targetHitRate) {
          results.push({
            formula,
            hitRate: validation.hitRate,
            hitCount: validation.hitCount,
            predictedResults: validation.predictedResults
          })
          
          if (validation.hitRate > searchProgress.bestHitRate) {
            searchProgress.bestHitRate = validation.hitRate
          }
        }
      } catch (error) {
        // 忽略验证错误
      }
      
      searchCount++
      
      if (searchCount % 50 === 0 || results.length >= intelligentParams.maxResults) {
        searchProgress.searched = searchCount
        searchProgress.found = results.length
        searchProgress.percentage = Math.min(Math.round((searchCount / maxSearch) * 100), 100)
        await new Promise(resolve => setTimeout(resolve, 0))
      }
      
      if (!isSearching.value) {
        break
      }
    }
    
    results.sort((a, b) => b.hitRate - a.hitRate)
    
    searchResults.value = results
    searchProgress.status = 'success'
    
    if (results.length > 0) {
      ElMessage.success(`搜索完成！找到 ${results.length} 个高命中公式`)
    } else {
      ElMessage.warning(`搜索完成，但未找到命中率 ≥ ${intelligentParams.targetHitRate}% 的公式，请降低目标命中率`)
    }
    
  } catch (error) {
    ElMessage.error('搜索失败：' + error.message)
    searchProgress.status = 'exception'
  } finally {
    isSearching.value = false
  }
}

const stopSearch = () => {
  isSearching.value = false
  ElMessage.info('已停止搜索')
}

const toggleResultSelection = (index) => {
  const idx = selectedResults.value.indexOf(index)
  if (idx > -1) {
    selectedResults.value.splice(idx, 1)
  } else {
    selectedResults.value.push(index)
  }
}

const selectAllResults = () => {
  selectedResults.value = searchResults.value.map((_, index) => index)
}

const clearSelection = () => {
  selectedResults.value = []
}

const addSelectedResults = () => {
  if (selectedResults.value.length === 0) {
    ElMessage.warning('请先选择要添加的公式')
    return
  }
  
  const formulas = selectedResults.value.map(index => searchResults.value[index].formula)
  emit('add-formulas', formulas)
  
  ElMessage.success(`已添加 ${formulas.length} 个公式到输入区`)
  selectedResults.value = []
}
</script>

<style scoped>
.search-formula {
  padding: 20px 0;
}

.params-section,
.result-types-section {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.params-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.param-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.param-item label {
  font-size: 14px;
  color: #666;
  min-width: 50px;
}

.result-types {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.intelligent-section {
  margin-top: 24px;
}

.intelligent-params {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.intelligent-params .param-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.intelligent-params .param-item label {
  font-weight: 500;
  color: #333;
}

.value-display {
  font-weight: bold;
  color: #409eff;
  margin-left: 12px;
}

.search-actions {
  display: flex;
  gap: 12px;
  margin: 20px 0;
}

.search-progress {
  margin: 20px 0;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  font-size: 14px;
  color: #666;
}

.search-results {
  margin-top: 24px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.search-results h4 {
  margin-bottom: 12px;
  color: #333;
}

.results-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.results-list {
  max-height: 500px;
  overflow-y: auto;
}

.result-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  margin-bottom: 8px;
  background-color: white;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.result-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

.result-item.selected {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.result-content {
  flex: 1;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.hit-rate {
  font-weight: bold;
  color: #67c23a;
  font-size: 15px;
}

.hit-count {
  color: #909399;
  font-size: 13px;
}

.result-formula {
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: #333;
  margin-bottom: 6px;
  font-weight: 500;
}

.result-prediction {
  font-size: 13px;
  color: #606266;
}

@media (max-width: 768px) {
  .params-row {
    flex-direction: column;
    gap: 12px;
  }
  
  .result-types {
    flex-direction: column;
  }
}
</style>
