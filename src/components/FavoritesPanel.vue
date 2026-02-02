<template>
  <el-dialog
    v-model="visible"
    title="⭐ 选择保存位置"
    width="500px"
    :before-close="handleClose"
  >
    <div class="favorites-content">
      <!-- 系统分类 -->
      <div class="category-section">
        <h4>📁 系统分类</h4>
        <div class="category-grid">
          <div 
            v-for="category in categories" 
            :key="category.id"
            class="category-item"
            :class="{ active: selectedCategory === category.id }"
            @click="selectCategory(category.id)"
          >
            {{ category.name }}
          </div>
        </div>
      </div>

      <!-- 自定义编组 -->
      <div class="group-section">
        <div class="section-header">
          <h4>📂 自定义编组</h4>
          <el-button size="small" @click="showCreateGroup = true">+新建编组</el-button>
        </div>
        <div class="group-grid">
          <div 
            v-for="group in customGroups" 
            :key="group.id"
            class="group-item"
            :class="{ active: selectedGroup === group.id }"
            @click="selectGroup(group.id)"
          >
            {{ group.name }}
          </div>
        </div>
      </div>

      <!-- 预览公式 -->
      <div class="preview-section" v-if="formulas">
        <h4>待收藏的公式</h4>
        <div class="formula-preview">
          <div 
            v-for="(formula, index) in formulaList" 
            :key="index"
            class="formula-item"
          >
            {{ formula }}
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button 
          type="primary" 
          @click="saveToFavorites"
          :disabled="!selectedCategory && !selectedGroup"
        >
          保存到收藏
        </el-button>
      </div>
    </template>

    <!-- 新建编组弹窗 -->
    <el-dialog
      v-model="showCreateGroup"
      title="新建编组"
      width="400px"
      append-to-body
    >
      <el-form>
        <el-form-item label="编组名称">
          <el-input 
            v-model="newGroupName" 
            placeholder="请输入编组名称"
            @keyup.enter="createGroup"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateGroup = false">取消</el-button>
        <el-button type="primary" @click="createGroup">确定</el-button>
      </template>
    </el-dialog>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useFormulaStore } from '../stores/formula'

const props = defineProps({
  modelValue: Boolean,
  formulas: String
})

const emit = defineEmits(['update:modelValue'])

const formulaStore = useFormulaStore()

// 响应式数据
const selectedCategory = ref('')
const selectedGroup = ref('')
const showCreateGroup = ref(false)
const newGroupName = ref('')

// 计算属性
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const categories = computed(() => formulaStore.categories)
const customGroups = computed(() => formulaStore.customGroups)

const formulaList = computed(() => {
  if (!props.formulas) return []
  return props.formulas
    .split('\n')
    .filter(line => line.trim())
    .slice(0, 5) // 只显示前5个公式
})

// 方法
const handleClose = () => {
  visible.value = false
  resetSelection()
}

const resetSelection = () => {
  selectedCategory.value = ''
  selectedGroup.value = ''
}

const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId
  selectedGroup.value = '' // 清除分组选择
}

const selectGroup = (groupId) => {
  selectedGroup.value = groupId
  selectedCategory.value = '' // 清除分类选择
}

const createGroup = () => {
  if (!newGroupName.value.trim()) {
    ElMessage.warning('请输入编组名称')
    return
  }
  
  const newGroup = {
    id: Date.now().toString(),
    name: `📂${newGroupName.value}`,
    formulas: []
  }
  
  formulaStore.customGroups.push(newGroup)
  
  ElMessage.success('编组创建成功')
  showCreateGroup.value = false
  newGroupName.value = ''
  
  // 自动选择新创建的编组
  selectGroup(newGroup.id)
}

const saveToFavorites = () => {
  if (!props.formulas || !props.formulas.trim()) {
    ElMessage.warning('没有可收藏的公式')
    return
  }
  
  const formulas = props.formulas
    .split('\n')
    .filter(line => line.trim())
  
  if (formulas.length === 0) {
    ElMessage.warning('没有有效的公式')
    return
  }
  
  let targetCollection = null
  let targetName = ''
  
  if (selectedCategory.value) {
    targetCollection = formulaStore.categories.find(c => c.id === selectedCategory.value)
    targetName = targetCollection?.name || ''
  } else if (selectedGroup.value) {
    targetCollection = formulaStore.customGroups.find(g => g.id === selectedGroup.value)
    targetName = targetCollection?.name || ''
  }
  
  if (!targetCollection) {
    ElMessage.warning('请选择保存位置')
    return
  }
  
  // 添加公式到store
  formulas.forEach(formula => {
    formulaStore.addFormula(formula)
  })
  
  ElMessage.success(`已将 ${formulas.length} 个公式保存到 ${targetName}`)
  
  // 关闭弹窗并重置
  visible.value = false
  resetSelection()
}
</script>

<style scoped>
.favorites-content {
  padding: 20px 0;
}

.category-section,
.group-section,
.preview-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.category-grid,
.group-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 8px;
}

.category-item,
.group-item {
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  background: white;
}

.category-item:hover,
.group-item:hover {
  border-color: var(--primary-color);
  background-color: #f0fdf4;
}

.category-item.active,
.group-item.active {
  border-color: var(--primary-color);
  background-color: var(--primary-color);
  color: white;
}

.formula-preview {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 12px;
  background: #f8f9fa;
}

.formula-item {
  font-family: monospace;
  font-size: 12px;
  margin-bottom: 4px;
  color: #666;
  word-break: break-all;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .category-grid,
  .group-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .section-header {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }
  
  .dialog-footer {
    justify-content: center;
  }
}
</style>