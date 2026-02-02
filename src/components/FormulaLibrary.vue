<template>
  <el-dialog
    v-model="visible"
    title="📚 公式库"
    width="80%"
    :before-close="handleClose"
    class="formula-library-dialog"
  >
    <!-- 选项卡 -->
    <el-tabs v-model="activeTab" class="library-tabs">
      <!-- 公式库选项卡 -->
      <el-tab-pane label="公式库" name="library">
        <div class="library-content">
          <!-- 系统分类 -->
          <div class="category-section">
            <h3>📁 系统分类（7种）</h3>
            <div class="category-grid">
              <div 
                v-for="category in categories" 
                :key="category.id"
                class="category-card"
                @click="selectCategory(category)"
              >
                <div class="category-icon">{{ category.name }}</div>
                <div class="category-count">{{ getCategoryCount(category.id) }}个</div>
              </div>
            </div>
          </div>
          
          <!-- 自定义编组 -->
          <div class="group-section">
            <div class="section-header">
              <h3>📂 自定义编组</h3>
              <el-button size="small" @click="showCreateGroup = true">+ 新建</el-button>
            </div>
            <div class="group-grid">
              <div 
                v-for="group in customGroups" 
                :key="group.id"
                class="group-card"
                @click="selectGroup(group)"
              >
                <div class="group-name">{{ group.name }}</div>
                <div class="group-count">{{ group.formulas.length }}个</div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      
      <!-- 搜索新公式选项卡 -->
      <el-tab-pane label="搜索新公式" name="search">
        <SearchFormula @add-formulas="handleAddFormulas" />
      </el-tab-pane>
      
      <!-- 历史记录选项卡 -->
      <el-tab-pane label="历史记录" name="history">
        <HistoryRecord />
      </el-tab-pane>
    </el-tabs>
    
    <!-- 创建分组弹窗 -->
    <el-dialog
      v-model="showCreateGroup"
      title="新建编组"
      width="400px"
      append-to-body
    >
      <el-form>
        <el-form-item label="编组名称">
          <el-input v-model="newGroupName" placeholder="请输入编组名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateGroup = false">取消</el-button>
        <el-button type="primary" @click="createGroup">确定</el-button>
      </template>
    </el-dialog>
    
    <!-- 公式列表弹窗 -->
    <FormulaList 
      v-model="showFormulaList"
      :category="selectedCategory"
      :group="selectedGroup"
      @add-formulas="handleAddFormulas"
    />
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useFormulaStore } from '../stores/formula'
import SearchFormula from './SearchFormula.vue'
import HistoryRecord from './HistoryRecord.vue'
import FormulaList from './FormulaList.vue'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue', 'add-formulas'])

const formulaStore = useFormulaStore()

// 响应式数据
const activeTab = ref('library')
const showCreateGroup = ref(false)
const newGroupName = ref('')
const showFormulaList = ref(false)
const selectedCategory = ref(null)
const selectedGroup = ref(null)

// 计算属性
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const categories = computed(() => formulaStore.categories)
const customGroups = computed(() => formulaStore.customGroups)

// 方法
const handleClose = () => {
  visible.value = false
}

const selectCategory = (category) => {
  selectedCategory.value = category
  selectedGroup.value = null
  showFormulaList.value = true
}

const selectGroup = (group) => {
  selectedGroup.value = group
  selectedCategory.value = null
  showFormulaList.value = true
}

const createGroup = () => {
  if (!newGroupName.value.trim()) {
    ElMessage.warning('请输入编组名称')
    return
  }
  
  formulaStore.customGroups.push({
    id: Date.now().toString(),
    name: `📂${newGroupName.value}`,
    formulas: []
  })
  
  ElMessage.success('编组创建成功')
  showCreateGroup.value = false
  newGroupName.value = ''
}

const handleAddFormulas = (formulas) => {
  emit('add-formulas', formulas)
  visible.value = false
}

const getCategoryCount = (categoryId) => {
  // 根据分类ID统计对应的公式数量
  const typeMap = {
    'tail': '尾数类',
    'head': '头数类',
    'sum': '合数类',
    'wave': '波色类',
    'element': '五行类',
    'zodiac': '肖位类',
    'code': '码类'
  }
  
  const typeName = typeMap[categoryId]
  if (!typeName) return 0
  
  return formulaStore.formulas.filter(f => f.content.includes(typeName)).length
}
</script>

<style scoped>
.formula-library-dialog {
  --el-dialog-padding-primary: 20px;
}

.library-content {
  padding: 20px 0;
}

.category-section,
.group-section {
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.category-grid,
.group-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

.category-card,
.group-card {
  padding: 20px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.category-card:hover,
.group-card:hover {
  border-color: var(--primary-color);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.15);
}

.category-icon {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
}

.category-count,
.group-count {
  font-size: 12px;
  color: #666;
}

.group-name {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .category-grid,
  .group-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .category-card,
  .group-card {
    padding: 16px;
  }
}
</style>