<template>
  <el-dialog
    v-model="visible"
    title="⚙️ 修改设置"
    width="500px"
    :before-close="handleClose"
  >
    <div class="settings-content">
      <!-- 补偿值设置 -->
      <div class="setting-item">
        <label class="setting-label">补偿值</label>
        <div class="setting-control">
          <el-button @click="decreaseValue('compensation')" :icon="Minus" />
          <el-input-number 
            v-model="settings.compensation" 
            :min="-999" 
            :max="999"
            controls-position="right"
            class="setting-input"
          />
          <el-button @click="increaseValue('compensation')" :icon="Plus" />
        </div>
      </div>

      <!-- 验证期数设置 -->
      <div class="setting-item">
        <label class="setting-label">验证期数</label>
        <div class="setting-control">
          <el-button @click="decreaseValue('periods')" :icon="Minus" />
          <el-input-number 
            v-model="settings.periods" 
            :min="1" 
            :max="100"
            controls-position="right"
            class="setting-input"
          />
          <el-button @click="increaseValue('periods')" :icon="Plus" />
        </div>
      </div>

      <!-- 左右扩展值设置 -->
      <div class="setting-item">
        <label class="setting-label">左右扩展值</label>
        <div class="extend-controls">
          <div class="extend-item">
            <span>左扩展</span>
            <el-button @click="decreaseValue('leftExtend')" :icon="Minus" size="small" />
            <el-input-number 
              v-model="settings.leftExtend" 
              :min="0" 
              :max="20"
              size="small"
              controls-position="right"
            />
            <el-button @click="increaseValue('leftExtend')" :icon="Plus" size="small" />
          </div>
          <div class="extend-item">
            <span>右扩展</span>
            <el-button @click="decreaseValue('rightExtend')" :icon="Minus" size="small" />
            <el-input-number 
              v-model="settings.rightExtend" 
              :min="0" 
              :max="20"
              size="small"
              controls-position="right"
            />
            <el-button @click="increaseValue('rightExtend')" :icon="Plus" size="small" />
          </div>
        </div>
      </div>

      <!-- 关键词替换 -->
      <div class="setting-item">
        <label class="setting-label">关键词替换</label>
        <div class="keyword-replace">
          <el-input 
            v-model="keywordReplace.from" 
            placeholder="原关键词"
            class="keyword-input"
          />
          <span>→</span>
          <el-input 
            v-model="keywordReplace.to" 
            placeholder="新关键词"
            class="keyword-input"
          />
          <el-button type="primary" @click="applyKeywordReplace">应用</el-button>
        </div>
      </div>

      <!-- 设置说明 -->
      <div class="setting-note">
        <el-alert
          title="设置说明"
          type="info"
          :closable="false"
        >
          <ul>
            <li>所有参数都可以修改，包括设置为0</li>
            <li>点击"应用到所有公式"后会更新输入区的公式</li>
            <li>修改后的参数会应用到验证过程中</li>
          </ul>
        </el-alert>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button @click="resetSettings">重置</el-button>
        <el-button type="primary" @click="applySettings">应用到所有公式</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { Plus, Minus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue', 'apply-settings', 'keyword-replace'])

// 响应式数据
const settings = reactive({
  compensation: 0,
  periods: 0,
  leftExtend: 0,
  rightExtend: 0
})

const keywordReplace = reactive({
  from: '',
  to: ''
})

// 计算属性
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 方法
const handleClose = () => {
  visible.value = false
}

const increaseValue = (key) => {
  const maxValues = {
    compensation: 999,
    periods: 100,
    leftExtend: 20,
    rightExtend: 20
  }
  
  if (settings[key] < maxValues[key]) {
    settings[key]++
  }
}

const decreaseValue = (key) => {
  const minValues = {
    compensation: -999,
    periods: 1, // 期数最小值为1，不能为0
    leftExtend: 0,
    rightExtend: 0
  }
  
  if (settings[key] > minValues[key]) {
    settings[key]--
  }
}

const resetSettings = () => {
  Object.assign(settings, {
    compensation: 0,
    periods: 15, // 默认期数为15
    leftExtend: 0,
    rightExtend: 0
  })
  
  Object.assign(keywordReplace, {
    from: '',
    to: ''
  })
  
  ElMessage.success('设置已重置')
}

const applyKeywordReplace = () => {
  if (!keywordReplace.from.trim()) {
    ElMessage.warning('请输入原关键词')
    return
  }
  
  if (!keywordReplace.to.trim()) {
    ElMessage.warning('请输入新关键词')
    return
  }
  
  // 发送关键词替换事件到父组件
  emit('keyword-replace', {
    from: keywordReplace.from.trim(),
    to: keywordReplace.to.trim()
  })
  
  ElMessage.success(`已将"${keywordReplace.from}"替换为"${keywordReplace.to}"`)
  
  // 清空输入
  Object.assign(keywordReplace, {
    from: '',
    to: ''
  })
}

const applySettings = () => {
  // 验证设置 - 允许0值，但期数必须≥1
  if (settings.periods < 1) {
    ElMessage.warning('验证期数必须大于等于1')
    return
  }
  
  // 发送设置到父组件
  emit('apply-settings', { ...settings })
  
  // 关闭弹窗
  visible.value = false
}

// 监听弹窗打开，重置设置
watch(visible, (newVal) => {
  if (newVal) {
    resetSettings()
  }
})
</script>

<style scoped>
.settings-content {
  padding: 20px 0;
}

.setting-item {
  margin-bottom: 24px;
}

.setting-label {
  display: block;
  margin-bottom: 12px;
  font-weight: 500;
  color: #333;
}

.setting-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.setting-input {
  flex: 1;
  max-width: 150px;
}

.extend-controls {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.extend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.extend-item span {
  min-width: 60px;
  font-size: 14px;
  color: #666;
}

.keyword-replace {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.keyword-input {
  flex: 1;
  min-width: 120px;
}

.setting-note {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.setting-note ul {
  margin: 8px 0 0 0;
  padding-left: 20px;
}

.setting-note li {
  margin-bottom: 4px;
  font-size: 14px;
  color: #666;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .setting-control {
    flex-wrap: wrap;
  }
  
  .extend-controls {
    flex-direction: column;
    gap: 12px;
  }
  
  .keyword-replace {
    flex-direction: column;
    align-items: stretch;
  }
  
  .keyword-input {
    min-width: auto;
  }
  
  .dialog-footer {
    justify-content: center;
  }
}
</style>