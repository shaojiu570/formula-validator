<template>
  <div class="search-formula">
    <!-- 参数设置 -->
    <div class="params-section">
      <h4>参数设置（独立于主界面设置）</h4>
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

    <!-- 随机选择元素 -->
    <div class="random-section">
      <h4>🎲 随机选择元素</h4>
      <div class="random-controls">
        <span>随机</span>
        <el-button size="small" @click="decreaseCount">-</el-button>
        <span class="count">{{ randomCount }}</span>
        <el-button size="small" @click="increaseCount">+</el-button>
        <span>个</span>
        <el-button type="primary" size="small" @click="randomSelect">🎯随机</el-button>
        <el-button size="small" @click="clearSelected">清空</el-button>
        <el-button type="success" size="small" @click="generateFormulas" :loading="isGenerating">验证</el-button>
      </div>
      <div class="random-note">
        (支持2-78个，生成所有可能组合)
      </div>
    </div>

    <!-- 元素选择区域 -->
    <div class="elements-section">
      <div class="element-group">
        <h5>📅 期数系列(4个)</h5>
        <div class="element-tags">
          <el-tag
            v-for="element in elements.period"
            :key="element"
            :type="selectedElements.includes(element) ? 'success' : ''"
            @click="toggleElement(element)"
            class="element-tag"
          >
            {{ element }}
          </el-tag>
        </div>
      </div>

      <div class="element-group">
        <h5>📊 总分系列(4个)</h5>
        <div class="element-tags">
          <el-tag
            v-for="element in elements.total"
            :key="element"
            :type="selectedElements.includes(element) ? 'success' : ''"
            @click="toggleElement(element)"
            class="element-tag"
          >
            {{ element }}
          </el-tag>
        </div>
      </div>

      <div class="element-group">
        <h5>🔢 平码系列(60个)</h5>
        <div class="element-tags">
          <el-tag
            v-for="element in elements.ping"
            :key="element"
            :type="selectedElements.includes(element) ? 'success' : ''"
            @click="toggleElement(element)"
            class="element-tag"
          >
            {{ element }}
          </el-tag>
        </div>
      </div>

      <div class="element-group">
        <h5>⭐ 特码系列(10个)</h5>
        <div class="element-tags">
          <el-tag
            v-for="element in elements.special"
            :key="element"
            :type="selectedElements.includes(element) ? 'success' : ''"
            @click="toggleElement(element)"
            class="element-tag"
          >
            {{ element }}
          </el-tag>
        </div>
      </div>
    </div>

    <!-- 已选择元素 -->
    <div class="selected-section">
      <h4>已选择元素 ({{ selectedElements.length }})</h4>
      <div class="selected-elements">
        <el-tag
          v-for="element in selectedElements"
          :key="element"
          type="success"
          closable
          @close="removeElement(element)"
          class="selected-tag"
        >
          {{ element }}
        </el-tag>
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

const selectedTypes = ref(['tail']) // 默认选择尾数类
const selectedElements = ref([])
const randomCount = ref(3)
const isGenerating = ref(false)

// 计算属性
const elements = computed(() => formulaStore.elements)

// 方法
const increaseCount = () => {
  if (randomCount.value < 78) {
    randomCount.value++
  }
}

const decreaseCount = () => {
  if (randomCount.value > 2) {
    randomCount.value--
  }
}

const toggleElement = (element) => {
  const index = selectedElements.value.indexOf(element)
  if (index > -1) {
    selectedElements.value.splice(index, 1)
  } else {
    selectedElements.value.push(element)
  }
}

const removeElement = (element) => {
  const index = selectedElements.value.indexOf(element)
  if (index > -1) {
    selectedElements.value.splice(index, 1)
  }
}

const clearSelected = () => {
  selectedElements.value = []
}

const randomSelect = () => {
  // 获取所有可用元素
  const allElements = [
    ...elements.value.period,
    ...elements.value.total,
    ...elements.value.ping.slice(0, 20), // 只取前20个平码元素，避免太多
    ...elements.value.special
  ]
  
  // 随机选择指定数量的元素
  const shuffled = [...allElements].sort(() => 0.5 - Math.random())
  selectedElements.value = shuffled.slice(0, Math.min(randomCount.value, allElements.length))
  
  ElMessage.success(`已随机选择 ${selectedElements.value.length} 个元素`)
}

const generateFormulas = async () => {
  if (selectedElements.value.length < 2) {
    ElMessage.warning('请至少选择2个元素')
    return
  }
  
  if (selectedTypes.value.length === 0) {
    ElMessage.warning('请至少选择1种结果类型')
    return
  }
  
  isGenerating.value = true
  
  try {
    const formulas = []
    
    // 生成所有可能的组合：2元素、3元素、...、N元素
    for (let size = 2; size <= selectedElements.value.length; size++) {
      const combinations = getCombinations(selectedElements.value, size)
      
      combinations.forEach(combo => {
        selectedTypes.value.forEach(type => {
          ['D', 'L'].forEach(rule => {
            const expression = combo.join('+')
            const typeMap = {
              tail: '尾数类',
              head: '头数类', 
              sum: '合数类',
              wave: '波色类',
              element: '五行类',
              zodiac: '肖位类',
              code: '码类'
            }
            
            let formula = `[${rule}${typeMap[type]}]${expression}=${params.periods}`
            
            if (params.compensation !== 0) {
              const sign = params.compensation > 0 ? '+' : ''
              formula = `[${rule}${typeMap[type]}]${expression}${sign}${params.compensation}=${params.periods}`
            }
            
            if (params.leftExtend > 0 || params.rightExtend > 0) {
              formula += `左${params.leftExtend}右${params.rightExtend}`
            }
            
            formulas.push(formula)
          })
        })
      })
      
      // 限制生成数量，防止过多
      if (formulas.length >= 800) {
        break
      }
    }
    
    // 限制最终数量
    const limitedFormulas = formulas.slice(0, 800)
    
    ElMessage.success(`生成了 ${limitedFormulas.length} 个公式组合`)
    emit('add-formulas', limitedFormulas)
    
  } catch (error) {
    ElMessage.error('生成公式失败：' + error.message)
  } finally {
    isGenerating.value = false
  }
}

// 生成组合的辅助函数
const getCombinations = (arr, size) => {
  if (size === 1) return arr.map(el => [el])
  if (size === arr.length) return [arr]
  
  const combinations = []
  for (let i = 0; i <= arr.length - size; i++) {
    const head = arr[i]
    const tailCombos = getCombinations(arr.slice(i + 1), size - 1)
    tailCombos.forEach(combo => combinations.push([head, ...combo]))
  }
  
  return combinations
}
</script>

<style scoped>
.search-formula {
  padding: 20px 0;
}

.params-section,
.result-types-section,
.random-section,
.elements-section,
.selected-section {
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

.random-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.count {
  font-weight: bold;
  min-width: 20px;
  text-align: center;
}

.random-note {
  font-size: 12px;
  color: #666;
}

.element-group {
  margin-bottom: 16px;
}

.element-group h5 {
  margin-bottom: 8px;
  color: #333;
}

.element-tags,
.selected-elements {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.element-tag,
.selected-tag {
  cursor: pointer;
  user-select: none;
}

.element-tag:hover {
  opacity: 0.8;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .params-row {
    flex-direction: column;
    gap: 12px;
  }
  
  .result-types {
    flex-direction: column;
  }
  
  .random-controls {
    flex-wrap: wrap;
  }
}
</style>