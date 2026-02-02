<template>
  <el-dialog
    v-model="visible"
    :title="dialogTitle"
    width="80%"
    :before-close="handleClose"
    class="formula-list-dialog"
  >
    <!-- 操作栏 -->
    <div class="action-bar">
      <div class="selection-info">
        <el-checkbox 
          v-model="selectAll" 
          @change="handleSelectAll"
          :indeterminate="isIndeterminate"
        >
          全选
        </el-checkbox>
        <span class="selected-count">已选{{ selectedFormulas.length }}个</span>
      </div>
      
      <div class="action-buttons">
        <el-button 
          type="primary" 
          @click="addToInput"
          :disabled="selectedFormulas.length === 0"
        >
          添加到输入区
        </el-button>
        <el-button 
          type="danger" 
          @click="deleteSelected"
          :disabled="selectedFormulas.length === 0"
        >
          删除
        </el-button>
        <el-button @click="showAddFormula = true">+添加</el-button>
      </div>
    </div>

    <!-- 公式列表 -->
    <div class="formula-list">
      <div 
        v-for="formula in displayFormulas" 
        :key="formula.id"
        class="formula-item"
        :class="{ selected: selectedFormulas.includes(formula.id) }"
      >
        <div class="formula-content">
          <el-checkbox 
            :model-value="selectedFormulas.includes(formula.id)"
            @change="toggleSelection(formula.id)"
          />
          <div class="formula-text">{{ formula.content }}</div>
          <div class="formula-meta">
            <span class="create-time">{{ formatDate(formula.createTime) }}</span>
            <span class="hit-rate" v-if="formula.hitRate > 0">命中率: {{ formula.hitRate }}%</span>
          </div>
        </div>
        <div class="formula-actions">
          <el-button size="small" @click="editFormula(formula)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteFormula(formula.id)">删除</el-button>
        </div>
      </div>
      
      <div v-if="displayFormulas.length === 0" class="empty-list">
        <el-empty description="暂无公式" />
      </div>
    </div>

    <!-- 添加公式弹窗 -->
    <el-dialog
      v-model="showAddFormula"
      title="添加公式"
      width="500px"
      append-to-body
    >
      <el-form>
        <el-form-item label="公式内容">
          <el-input 
            v-model="newFormulaContent" 
            placeholder="请输入公式，如：[D肖位类]期数合+总分合=15"
            @keyup.enter="addFormula"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddFormula = false">取消</el-button>
        <el-button type="primary" @click="addFormula">确定</el-button>
      </template>
    </el-dialog>

    <!-- 编辑公式弹窗 -->
    <el-dialog
      v-model="showEditFormula"
      title="编辑公式"
      width="500px"
      append-to-body
    >
      <el-form>
        <el-form-item label="公式内容">
          <el-input 
            v-model="editingFormula.content" 
            placeholder="请输入公式"
            @keyup.enter="updateFormula"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditFormula = false">取消</el-button>
        <el-button type="primary" @click="updateFormula">确定</el-button>
      </template>
    </el-dialog>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useFormulaStore } from '../stores/formula'

const props = defineProps({
  modelValue: Boolean,
  category: Object,
  group: Object
})

const emit = defineEmits(['update:modelValue', 'add-formulas'])

const formulaStore = useFormulaStore()

// 响应式数据
const selectedFormulas = ref([])
const showAddFormula = ref(false)
const showEditFormula = ref(false)
const newFormulaContent = ref('')
const editingFormula = ref({ id: null, content: '' })

// 计算属性
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const dialogTitle = computed(() => {
  if (props.category) return `← ${props.category.name}公式`
  if (props.group) return `← ${props.group.name}公式`
  return '公式列表'
})

const displayFormulas = computed(() => {
  if (props.category) {
    // 根据分类筛选公式
    return formulaStore.formulas.filter(f => {
      // 简单的分类匹配逻辑
      const categoryType = props.category.id
      if (f.content.includes(categoryType)) return true
      
      // 根据公式内容判断类型
      if (categoryType === 'tail' && f.content.includes('尾数类')) return true
      if (categoryType === 'head' && f.content.includes('头数类')) return true
      if (categoryType === 'sum' && f.content.includes('合数类')) return true
      if (categoryType === 'wave' && f.content.includes('波色类')) return true
      if (categoryType === 'element' && f.content.includes('五行类')) return true
      if (categoryType === 'zodiac' && f.content.includes('肖位类')) return true
      if (categoryType === 'code' && f.content.includes('码类')) return true
      
      return false
    })
  }
  
  if (props.group) {
    // 根据分组筛选公式（暂时返回所有）
    return formulaStore.formulas
  }
  
  return formulaStore.formulas
})

const selectAll = computed({
  get: () => selectedFormulas.value.length === displayFormulas.value.length && displayFormulas.value.length > 0,
  set: (value) => {
    if (value) {
      selectedFormulas.value = displayFormulas.value.map(f => f.id)
    } else {
      selectedFormulas.value = []
    }
  }
})

const isIndeterminate = computed(() => {
  return selectedFormulas.value.length > 0 && selectedFormulas.value.length < displayFormulas.value.length
})

// 方法
const handleClose = () => {
  visible.value = false
  selectedFormulas.value = []
}

const handleSelectAll = (value) => {
  selectAll.value = value
}

const toggleSelection = (id) => {
  const index = selectedFormulas.value.indexOf(id)
  if (index > -1) {
    selectedFormulas.value.splice(index, 1)
  } else {
    selectedFormulas.value.push(id)
  }
}

const addToInput = () => {
  const selectedFormulaContents = displayFormulas.value
    .filter(f => selectedFormulas.value.includes(f.id))
    .map(f => f.content)
  
  if (selectedFormulaContents.length > 0) {
    emit('add-formulas', selectedFormulaContents)
    ElMessage.success(`已添加 ${selectedFormulaContents.length} 个公式到输入区`)
    visible.value = false
  }
}

const deleteSelected = async () => {
  if (selectedFormulas.value.length === 0) return
  
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedFormulas.value.length} 个公式吗？`,
      '确认删除',
      { type: 'warning' }
    )
    
    for (const id of selectedFormulas.value) {
      formulaStore.removeFormula(id)
    }
    
    ElMessage.success('删除成功')
    selectedFormulas.value = []
  } catch {
    // 用户取消删除
  }
}

const addFormula = () => {
  if (!newFormulaContent.value.trim()) {
    ElMessage.warning('请输入公式内容')
    return
  }
  
  try {
    formulaStore.addFormula(newFormulaContent.value.trim())
    ElMessage.success('添加成功')
    
    newFormulaContent.value = ''
    showAddFormula.value = false
  } catch (error) {
    ElMessage.error('添加失败：' + error.message)
  }
}

const editFormula = (formula) => {
  editingFormula.value = { ...formula }
  showEditFormula.value = true
}

const updateFormula = () => {
  if (!editingFormula.value.content.trim()) {
    ElMessage.warning('请输入公式内容')
    return
  }
  
  try {
    // 找到对应的公式并更新
    const formula = formulaStore.formulas.find(f => f.id === editingFormula.value.id)
    if (formula) {
      formula.content = editingFormula.value.content.trim()
      formula.updateTime = new Date()
      ElMessage.success('更新成功')
    } else {
      ElMessage.error('找不到要更新的公式')
    }
    
    showEditFormula.value = false
  } catch (error) {
    ElMessage.error('更新失败：' + error.message)
  }
}

const deleteFormula = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这个公式吗？', '确认删除', {
      type: 'warning'
    })
    
    formulaStore.removeFormula(id)
    ElMessage.success('删除成功')
  } catch {
    // 用户取消删除
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

// 监听弹窗关闭，重置选择
watch(visible, (newVal) => {
  if (!newVal) {
    selectedFormulas.value = []
  }
})
</script>

<style scoped>
.formula-list-dialog {
  --el-dialog-padding-primary: 20px;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 16px;
}

.selection-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.selected-count {
  color: #666;
  font-size: 14px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.formula-list {
  max-height: 500px;
  overflow-y: auto;
}

.formula-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 8px;
  background: white;
  transition: all 0.3s ease;
}

.formula-item:hover {
  border-color: var(--primary-color);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.15);
}

.formula-item.selected {
  border-color: var(--primary-color);
  background-color: #f0fdf4;
}

.formula-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.formula-text {
  font-family: monospace;
  font-size: 14px;
  color: #333;
  flex: 1;
}

.formula-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: #666;
}

.formula-actions {
  display: flex;
  gap: 8px;
}

.empty-list {
  text-align: center;
  padding: 40px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .action-bar {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .action-buttons {
    justify-content: center;
  }
  
  .formula-item {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .formula-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .formula-actions {
    justify-content: center;
  }
}
</style>