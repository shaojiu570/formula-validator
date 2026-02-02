<template>
  <div class="history-record">
    <!-- 操作区 -->
    <div class="actions-section">
      <div class="section-header">
        <h4>历史记录</h4>
        <div class="action-buttons">
          <el-button type="primary" @click="showBatchImport = true">📥批量导入</el-button>
          <el-button @click="showAddRecord = true">+添加</el-button>
        </div>
      </div>
      
      <!-- 批量导入说明 -->
      <div class="import-info">
        <h5>智能批量导入：</h5>
        <ul>
          <li>自动识别分隔符(逗号/空格/制表符)</li>
          <li>自动按新期数排序</li>
          <li>自动去重</li>
        </ul>
      </div>
    </div>

    <!-- 历史记录列表 -->
    <div class="records-list">
      <div 
        v-for="record in historyData" 
        :key="record.period"
        class="record-item"
      >
        <div class="record-header">
          <span class="period">{{ record.period }}期</span>
          <span class="date">{{ formatDate(record.date) }}</span>
          <el-button 
            type="danger" 
            size="small" 
            text
            @click="deleteRecord(record.period)"
          >
            删
          </el-button>
        </div>
        <div class="record-numbers">
          <span 
            v-for="(number, index) in record.numbers" 
            :key="index"
            :class="['number-ball', getNumberClass(number), { 'special': index === 6 }]"
          >
            {{ String(number).padStart(2, '0') }}
          </span>
        </div>
      </div>
      
      <div v-if="!historyData.length" class="empty-records">
        <el-empty description="暂无历史记录" />
      </div>
    </div>

    <!-- 批量导入弹窗 -->
    <el-dialog
      v-model="showBatchImport"
      title="批量导入历史记录"
      width="600px"
    >
      <div class="import-dialog">
        <el-form>
          <el-form-item label="导入数据">
            <el-input
              v-model="importData"
              type="textarea"
              :rows="10"
              placeholder="请粘贴历史数据，支持多种格式：&#10;格式1: 20260124,01,03,05,12,18,25,37&#10;格式2: 20260124期 01 03 05 12 18 25 37&#10;格式3: 2026-01-24	01	03	05	12	18	25	37"
            />
          </el-form-item>
        </el-form>
        <div class="import-preview" v-if="previewData.length">
          <h5>预览数据 ({{ previewData.length }}条):</h5>
          <div class="preview-list">
            <div v-for="item in previewData.slice(0, 3)" :key="item.period" class="preview-item">
              {{ item.period }}期: {{ item.numbers.map(n => String(n).padStart(2, '0')).join(' ') }}
            </div>
            <div v-if="previewData.length > 3">
              ... 还有 {{ previewData.length - 3 }} 条
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="showBatchImport = false">取消</el-button>
        <el-button @click="previewImport">预览</el-button>
        <el-button type="primary" @click="confirmImport" :disabled="!previewData.length">导入数据</el-button>
      </template>
    </el-dialog>

    <!-- 添加记录弹窗 -->
    <el-dialog
      v-model="showAddRecord"
      title="添加历史记录"
      width="500px"
    >
      <el-form :model="newRecord" label-width="80px">
        <el-form-item label="期数">
          <el-input v-model="newRecord.period" placeholder="如：20260124" />
        </el-form-item>
        <el-form-item label="开奖号码">
          <el-input 
            v-model="newRecord.numbersStr" 
            placeholder="请输入7个号码，用空格或逗号分隔"
          />
        </el-form-item>
        <el-form-item label="开奖日期">
          <el-date-picker
            v-model="newRecord.date"
            type="date"
            placeholder="选择日期"
            format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddRecord = false">取消</el-button>
        <el-button type="primary" @click="addRecord">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useFormulaStore } from '../stores/formula'

const formulaStore = useFormulaStore()

// 响应式数据
const showBatchImport = ref(false)
const showAddRecord = ref(false)
const importData = ref('')
const previewData = ref([])

const newRecord = reactive({
  period: '',
  numbersStr: '',
  date: new Date()
})

// 计算属性
const historyData = computed(() => formulaStore.historyData)

// 方法
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const getNumberClass = (number) => {
  // 根据波色映射返回对应的样式类
  if (formulaStore.waveMapping.red.includes(number)) return 'red-ball'
  if (formulaStore.waveMapping.blue.includes(number)) return 'blue-ball'
  if (formulaStore.waveMapping.green.includes(number)) return 'green-ball'
  return 'red-ball' // 默认
}

const deleteRecord = async (period) => {
  try {
    await ElMessageBox.confirm('确定要删除这条记录吗？', '确认删除', {
      type: 'warning'
    })
    
    const index = formulaStore.historyData.findIndex(r => r.period === period)
    if (index > -1) {
      formulaStore.historyData.splice(index, 1)
      ElMessage.success('删除成功')
    }
  } catch {
    // 用户取消删除
  }
}

const parseImportData = (data) => {
  const lines = data.trim().split('\n').filter(line => line.trim())
  const parsed = []
  
  lines.forEach(line => {
    try {
      // 清理数据，移除多余空格和特殊字符
      let cleanLine = line.trim().replace(/[期\t]/g, ' ')
      
      // 尝试不同的分隔符
      let parts = []
      if (cleanLine.includes(',')) {
        parts = cleanLine.split(',')
      } else if (cleanLine.includes('\t')) {
        parts = cleanLine.split('\t')
      } else {
        parts = cleanLine.split(/\s+/)
      }
      
      parts = parts.filter(p => p.trim()).map(p => p.trim())
      
      if (parts.length >= 8) { // 期数 + 7个号码
        const period = parts[0].replace(/[^0-9]/g, '') // 只保留数字
        const numbers = parts.slice(1, 8).map(n => parseInt(n))
        
        // 验证数据有效性
        if (period.length >= 6 && numbers.every(n => n >= 1 && n <= 49)) {
          parsed.push({
            period: parseInt(period),
            numbers,
            date: new Date()
          })
        }
      }
    } catch (error) {
      console.warn('解析行数据失败:', line, error)
    }
  })
  
  // 按期数排序并去重
  const unique = parsed.reduce((acc, current) => {
    const exists = acc.find(item => item.period === current.period)
    if (!exists) {
      acc.push(current)
    }
    return acc
  }, [])
  
  return unique.sort((a, b) => b.period - a.period)
}

const previewImport = () => {
  if (!importData.value.trim()) {
    ElMessage.warning('请输入要导入的数据')
    return
  }
  
  try {
    previewData.value = parseImportData(importData.value)
    
    if (previewData.value.length === 0) {
      ElMessage.warning('未识别到有效数据，请检查格式')
    } else {
      ElMessage.success(`识别到 ${previewData.value.length} 条有效数据`)
    }
  } catch (error) {
    ElMessage.error('数据解析失败：' + error.message)
  }
}

const confirmImport = () => {
  if (!previewData.value.length) {
    ElMessage.warning('没有可导入的数据')
    return
  }
  
  try {
    formulaStore.batchAddHistoryData(previewData.value)
    
    ElMessage.success(`成功导入 ${previewData.value.length} 条记录`)
    
    // 重置状态
    showBatchImport.value = false
    importData.value = ''
    previewData.value = []
  } catch (error) {
    ElMessage.error('导入失败：' + error.message)
  }
}

const addRecord = () => {
  if (!newRecord.period || !newRecord.numbersStr) {
    ElMessage.warning('请填写完整信息')
    return
  }
  
  try {
    // 解析号码
    const numbers = newRecord.numbersStr
      .split(/[,\s]+/)
      .filter(n => n.trim())
      .map(n => parseInt(n.trim()))
    
    if (numbers.length !== 7) {
      ElMessage.warning('请输入7个号码')
      return
    }
    
    if (numbers.some(n => n < 1 || n > 49)) {
      ElMessage.warning('号码必须在1-49之间')
      return
    }
    
    // 添加记录
    formulaStore.addHistoryData({
      period: parseInt(newRecord.period),
      numbers,
      date: newRecord.date
    })
    
    ElMessage.success('添加成功')
    
    // 重置表单
    Object.assign(newRecord, {
      period: '',
      numbersStr: '',
      date: new Date()
    })
    
    showAddRecord.value = false
    
  } catch (error) {
    ElMessage.error('添加失败：' + error.message)
  }
}
</script>

<style scoped>
.history-record {
  padding: 20px 0;
}

.actions-section {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.import-info {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  border-left: 4px solid var(--primary-color);
}

.import-info h5 {
  margin-bottom: 8px;
  color: #333;
}

.import-info ul {
  margin: 0;
  padding-left: 20px;
  color: #666;
  font-size: 14px;
}

.records-list {
  max-height: 400px;
  overflow-y: auto;
}

.record-item {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  background: white;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.period {
  font-weight: bold;
  font-size: 16px;
}

.date {
  color: #666;
  font-size: 14px;
}

.record-numbers {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.empty-records {
  text-align: center;
  padding: 40px;
}

.import-dialog {
  padding: 0;
}

.import-preview {
  margin-top: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
}

.import-preview h5 {
  margin-bottom: 8px;
  color: #333;
}

.preview-list {
  font-family: monospace;
  font-size: 14px;
}

.preview-item {
  margin-bottom: 4px;
  color: #666;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .action-buttons {
    justify-content: center;
  }
  
  .record-header {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
  
  .record-numbers {
    justify-content: center;
  }
}
</style>