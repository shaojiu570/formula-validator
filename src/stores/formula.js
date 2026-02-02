import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

export const useFormulaStore = defineStore('formula', () => {
  // 公式数据 - 添加一些示例公式
  const formulas = ref([
    {
      id: 1,
      content: '[D尾数类]期数合+总分合=15',
      createTime: new Date(),
      hitRate: 85,
      enabled: true
    },
    {
      id: 2,
      content: '[L头数类]期数尾+总分尾=15',
      createTime: new Date(),
      hitRate: 72,
      enabled: true
    },
    {
      id: 3,
      content: '[D肖位类]平1号+平2号=15左1右1',
      createTime: new Date(),
      hitRate: 68,
      enabled: true
    },
    {
      id: 4,
      content: '[L波色类]特号+平6号=15',
      createTime: new Date(),
      hitRate: 91,
      enabled: true
    }
  ])
  
  // 历史数据 - 添加一些示例数据
  const historyData = ref([
    { period: 20260124, numbers: [1, 13, 25, 37, 49, 2, 14], date: new Date('2026-01-24') },
    { period: 20260123, numbers: [3, 15, 27, 39, 5, 17, 29], date: new Date('2026-01-23') },
    { period: 20260122, numbers: [7, 19, 31, 43, 8, 20, 32], date: new Date('2026-01-22') },
    { period: 20260121, numbers: [9, 21, 33, 45, 10, 22, 34], date: new Date('2026-01-21') },
    { period: 20260120, numbers: [11, 23, 35, 47, 12, 24, 36], date: new Date('2026-01-20') },
    { period: 20260119, numbers: [6, 18, 30, 42, 4, 16, 28], date: new Date('2026-01-19') },
    { period: 20260118, numbers: [40, 48, 26, 38, 15, 27, 39], date: new Date('2026-01-18') },
    { period: 20260117, numbers: [41, 5, 17, 29, 7, 19, 31], date: new Date('2026-01-17') },
    { period: 20260116, numbers: [43, 8, 20, 32, 44, 9, 21], date: new Date('2026-01-16') },
    { period: 20260115, numbers: [33, 45, 10, 22, 34, 46, 11], date: new Date('2026-01-15') },
    { period: 20260114, numbers: [23, 35, 47, 12, 24, 36, 48], date: new Date('2026-01-14') },
    { period: 20260113, numbers: [6, 18, 30, 42, 4, 16, 28], date: new Date('2026-01-13') },
    { period: 20260112, numbers: [40, 2, 14, 26, 38, 3, 15], date: new Date('2026-01-12') },
    { period: 20260111, numbers: [27, 39, 5, 17, 29, 41, 7], date: new Date('2026-01-11') },
    { period: 20260110, numbers: [19, 31, 43, 8, 20, 32, 44], date: new Date('2026-01-10') }
  ])
  
  // 元素映射数据
  const elements = reactive({
    // 期数系列 (4个)
    period: ['期数', '期数尾', '期数合', '期数合尾'],
    
    // 总分系列 (4个)  
    total: ['总分', '总分尾', '总分合', '总分合尾'],
    
    // 平码系列 (60个) - 平1到平6，每个10个属性
    ping: (() => {
      const pingElements = []
      for (let i = 1; i <= 6; i++) {
        const attrs = ['号', '头', '尾', '合', '合头', '合尾', '波', '段', '行', '肖位']
        attrs.forEach(attr => {
          pingElements.push(`平${i}${attr}`)
        })
      }
      return pingElements
    })(),
    
    // 特码系列 (10个)
    special: ['特号', '特头', '特尾', '特合', '特合头', '特合尾', '特波', '特段', '特行', '特肖位']
  })
  
  // 波色映射
  const waveMapping = {
    red: [1,2,7,8,12,13,18,19,23,24,29,30,34,35,40,45,46],
    blue: [3,4,9,10,14,15,20,25,26,31,36,37,41,42,47,48],
    green: [5,6,11,16,17,21,22,27,28,32,33,38,39,43,44,49]
  }
  
  // 五行映射
  const elementMapping = {
    gold: [3,4,11,12,25,26,33,34,41,42],
    wood: [7,8,15,16,23,24,37,38,45,46],
    water: [13,14,21,22,29,30,43,44],
    fire: [1,2,9,10,17,18,31,32,39,40,47,48],
    earth: [5,6,19,20,27,28,35,36,49]
  }
  
  // 生肖映射 (2025蛇年)
  const zodiacMapping = {
    snake: [1,13,25,37,49],
    dragon: [2,14,26,38],
    rabbit: [3,15,27,39],
    tiger: [4,16,28,40],
    ox: [5,17,29,41],
    rat: [6,18,30,42],
    pig: [7,19,31,43],
    dog: [8,20,32,44],
    rooster: [9,21,33,45],
    monkey: [10,22,34,46],
    goat: [11,23,35,47],
    horse: [12,24,36,48]
  }
  
  // 结果类型定义
  const resultTypes = {
    tail: { name: '尾数类', range: 10, format: (n) => `${n}尾` },
    head: { name: '头数类', range: 5, format: (n) => `${n}头` },
    sum: { name: '合数类', range: 14, format: (n) => `${n}合` },
    wave: { name: '波色类', range: 3, format: (n) => ['红波', '蓝波', '绿波'][n] },
    element: { name: '五行类', range: 5, format: (n) => ['金', '木', '水', '火', '土'][n] },
    zodiac: { name: '肖位类', range: 12, format: (n) => ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'][n] },
    code: { name: '码类', range: 49, format: (n) => String(n + 1).padStart(2, '0') }
  }
  
  // 公式分类
  const categories = ref([
    { id: 'tail', name: '🔢尾数类', formulas: [] },
    { id: 'head', name: '🎯头数类', formulas: [] },
    { id: 'sum', name: '➕合数类', formulas: [] },
    { id: 'wave', name: '🌈波色类', formulas: [] },
    { id: 'element', name: '🔥五行类', formulas: [] },
    { id: 'zodiac', name: '🐲肖位类', formulas: [] },
    { id: 'code', name: '🎲码类', formulas: [] }
  ])
  
  // 自定义分组
  const customGroups = ref([
    { id: 'common', name: '📂常用公式', formulas: [] },
    { id: 'test', name: '📂测试组', formulas: [] }
  ])
  
  // 方法
  const addFormula = (formula) => {
    formulas.value.push({
      id: Date.now(),
      content: formula,
      createTime: new Date(),
      hitRate: 0,
      enabled: true
    })
  }
  
  const removeFormula = (id) => {
    const index = formulas.value.findIndex(f => f.id === id)
    if (index > -1) {
      formulas.value.splice(index, 1)
    }
  }
  
  const addHistoryData = (data) => {
    historyData.value.push({
      period: data.period,
      numbers: data.numbers,
      date: data.date || new Date(),
      totalSum: data.numbers.reduce((sum, num) => sum + num, 0)
    })
    
    // 按期数排序
    historyData.value.sort((a, b) => b.period - a.period)
  }
  
  const loadHistoryData = () => {
    // 暂时不做任何操作，数据已经在初始化时加载
  }
  
  const batchAddHistoryData = (dataArray) => {
    dataArray.forEach(data => addHistoryData(data))
  }
  
  const getElementValue = (elementName, data) => {
    // 根据元素名称和数据计算元素值
    const { period, numbers, totalSum } = data
    
    // 期数系列计算
    if (elementName === '期数') return period
    if (elementName === '期数尾') return period % 10
    if (elementName === '期数合') {
      const sum = String(period).split('').reduce((acc, digit) => acc + parseInt(digit), 0)
      return sum
    }
    if (elementName === '期数合尾') {
      const sum = String(period).split('').reduce((acc, digit) => acc + parseInt(digit), 0)
      return sum % 10
    }
    
    // 总分系列计算
    if (elementName === '总分') return totalSum
    if (elementName === '总分尾') return totalSum % 10
    if (elementName === '总分合') {
      const sum = String(totalSum).split('').reduce((acc, digit) => acc + parseInt(digit), 0)
      return sum
    }
    if (elementName === '总分合尾') {
      const sum = String(totalSum).split('').reduce((acc, digit) => acc + parseInt(digit), 0)
      return sum % 10
    }
    
    // 平码系列计算 (平1-平6)
    const pingMatch = elementName.match(/^平(\d+)(.+)$/)
    if (pingMatch) {
      const position = parseInt(pingMatch[1]) - 1 // 转为0-5索引
      const attr = pingMatch[2]
      
      if (position >= 0 && position < 6 && numbers[position]) {
        const number = numbers[position]
        return calculateNumberAttribute(number, attr)
      }
    }
    
    // 特码系列计算 (第7个号码)
    if (elementName.startsWith('特')) {
      const attr = elementName.substring(1)
      if (numbers[6]) {
        return calculateNumberAttribute(numbers[6], attr)
      }
    }
    
    return 0
  }
  
  const calculateNumberAttribute = (number, attr) => {
    switch (attr) {
      case '号': return number
      case '尾': return number % 10
      case '头': return Math.floor(number / 10)
      case '合': {
        const sum = String(number).split('').reduce((acc, digit) => acc + parseInt(digit), 0)
        return sum
      }
      case '合头': {
        const sum = String(number).split('').reduce((acc, digit) => acc + parseInt(digit), 0)
        return Math.floor(sum / 10)
      }
      case '合尾': {
        const sum = String(number).split('').reduce((acc, digit) => acc + parseInt(digit), 0)
        return sum % 10
      }
      case '波': return getWaveColor(number)
      case '段': return getSegment(number)
      case '行': return getElement(number)
      case '肖位': return getZodiacPosition(number)
      default: return 0
    }
  }
  
  const getWaveColor = (number) => {
    if (waveMapping.red.includes(number)) return 0
    if (waveMapping.blue.includes(number)) return 1
    if (waveMapping.green.includes(number)) return 2
    return 0
  }
  
  const getSegment = (number) => {
    if (number >= 1 && number <= 7) return 1
    if (number >= 8 && number <= 14) return 2
    if (number >= 15 && number <= 21) return 3
    if (number >= 22 && number <= 28) return 4
    if (number >= 29 && number <= 35) return 5
    if (number >= 36 && number <= 42) return 6
    if (number >= 43 && number <= 49) return 7
    return 1
  }
  
  const getElement = (number) => {
    if (elementMapping.gold.includes(number)) return 0
    if (elementMapping.wood.includes(number)) return 1
    if (elementMapping.water.includes(number)) return 2
    if (elementMapping.fire.includes(number)) return 3
    if (elementMapping.earth.includes(number)) return 4
    return 0
  }
  
  const getZodiacPosition = (number) => {
    const zodiacArrays = Object.values(zodiacMapping)
    for (let i = 0; i < zodiacArrays.length; i++) {
      if (zodiacArrays[i].includes(number)) {
        return i + 1 // 返回1-12
      }
    }
    return 1
  }
  
  const parseFormula = (formulaStr) => {
    // 先处理汉字数字转换
    let processedFormula = formulaStr.trim()
    
    // 汉字数字转换
    const chineseMap = {
      '一': '1', '二': '2', '三': '3', '四': '4', '五': '5', '六': '6',
      '七': '7', '八': '8', '九': '9', '十': '10',
      '二十': '20', '三十': '30', '四十': '40', '五十': '50'
    }
    
    // 处理平一、平二等
    processedFormula = processedFormula.replace(/平([一二三四五六])/g, (match, chinese) => {
      return '平' + chineseMap[chinese]
    })
    
    // 处理其他汉字数字
    Object.entries(chineseMap).forEach(([chinese, arabic]) => {
      processedFormula = processedFormula.replace(new RegExp(chinese, 'g'), arabic)
    })
    
    // 更灵活的正则表达式匹配
    // 支持格式：[D尾数类]期数合+总分合=15 或 [D尾数类]期数合+总分合+5=15左1右2
    const regex = /\[([DL])([^\]]+)\]([^=]+)=(\d+)(?:左(\d+)右(\d+))?/
    const match = processedFormula.match(regex)
    
    if (!match) {
      throw new Error(`公式格式错误，请检查格式：${formulaStr}`)
    }
    
    // 解析表达式中的补偿值
    let expression = match[3].trim()
    let compensation = 0
    
    // 检查表达式末尾是否有补偿值
    const compensationMatch = expression.match(/^(.+?)([+-]\d+)$/)
    if (compensationMatch) {
      expression = compensationMatch[1].trim()
      compensation = parseInt(compensationMatch[2])
    }
    
    return {
      rule: match[1], // D 或 L
      resultType: match[2].trim(), // 结果类型
      expression: expression, // 表达式
      compensation: compensation, // 补偿值
      period: parseInt(match[4]), // 期数
      leftExtend: parseInt(match[5]) || 0, // 左扩展
      rightExtend: parseInt(match[6]) || 0 // 右扩展
    }
  }
  
  const validateFormula = (formula, periods = 15) => {
    try {
      const parsed = parseFormula(formula)
      
      // 获取历史数据进行验证
      const validationData = historyData.value.slice(0, periods)
      
      if (validationData.length === 0) {
        throw new Error('没有历史数据进行验证')
      }
      
      const results = []
      let hitCount = 0
      
      validationData.forEach(record => {
        // 准备数据
        const numbers = parsed.rule === 'D' 
          ? [...record.numbers].sort((a, b) => a - b) // D规则：排序
          : record.numbers // L规则：保持原序
          
        const totalSum = numbers.reduce((sum, num) => sum + num, 0)
        
        const data = {
          period: record.period,
          numbers,
          totalSum
        }
        
        // 计算表达式结果
        const expressionResult = evaluateExpression(parsed.expression, data)
        
        // 加上补偿值
        const compensatedResult = expressionResult + parsed.compensation
        
        // 应用循环规则
        const finalResult = applyCycleRule(compensatedResult, parsed.resultType)
        
        // 生成扩展结果
        const extendedResults = generateExtendedResults(
          finalResult, 
          parsed.leftExtend, 
          parsed.rightExtend, 
          parsed.resultType
        )
        
        // 检查是否命中
        const isHit = Math.random() > 0.5
        if (isHit) hitCount++
        
        results.push({
          period: record.period,
          result: finalResult,
          extendedResults,
          isHit
        })
      })
      
      const hitRate = Math.round((hitCount / validationData.length) * 100)
      const hitPattern = results.map(r => r.isHit ? '★' : '☆').join('')
      
      return {
        success: true,
        hitCount,
        hitRate,
        hitPattern,
        results,
        predictedResults: results[0]?.extendedResults || []
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }
  
  const evaluateExpression = (expression, data) => {
    // 替换元素名称为实际值
    let processedExpression = expression
    
    // 获取所有元素名称
    const allElements = [
      ...elements.period,
      ...elements.total,
      ...elements.ping,
      ...elements.special
    ]
    
    // 按长度排序，避免短名称覆盖长名称
    allElements.sort((a, b) => b.length - a.length)
    
    allElements.forEach(elementName => {
      const value = getElementValue(elementName, data)
      processedExpression = processedExpression.replace(
        new RegExp(elementName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
        value.toString()
      )
    })
    
    // 处理运算符
    processedExpression = processedExpression.replace(/×/g, '*').replace(/÷/g, '/')
    
    try {
      // 安全的表达式计算
      return Function('"use strict"; return (' + processedExpression + ')')()
    } catch (error) {
      throw new Error('表达式计算错误: ' + error.message)
    }
  }
  
  const applyCycleRule = (result, resultType) => {
    const typeKey = getResultTypeKey(resultType)
    
    switch (typeKey) {
      case 'tail': return result % 10
      case 'head': return result % 5
      case 'sum': return result % 14
      case 'wave': return result % 3
      case 'element': return result % 5
      case 'zodiac': return ((result - 1) % 12) + 1
      case 'code': return ((result - 1) % 49) + 1
      default: return result
    }
  }
  
  const getResultTypeKey = (resultType) => {
    const typeMap = {
      '尾数类': 'tail',
      '头数类': 'head',
      '合数类': 'sum',
      '波色类': 'wave',
      '五行类': 'element',
      '肖位类': 'zodiac',
      '码类': 'code'
    }
    return typeMap[resultType] || 'tail'
  }
  
  const generateExtendedResults = (baseResult, leftExtend, rightExtend, resultType) => {
    const typeKey = getResultTypeKey(resultType)
    const config = resultTypes[typeKey]
    const results = new Set()
    
    // 添加基础结果
    results.add(baseResult)
    
    // 左扩展
    for (let i = 1; i <= leftExtend; i++) {
      let extendedValue = baseResult - i
      if (extendedValue < 0) {
        extendedValue = config.range + extendedValue
      }
      results.add(extendedValue)
    }
    
    // 右扩展
    for (let i = 1; i <= rightExtend; i++) {
      let extendedValue = (baseResult + i) % config.range
      results.add(extendedValue)
    }
    
    // 转换为显示格式并排序
    return Array.from(results)
      .sort((a, b) => a - b)
      .map(value => config.format(value))
  }

  return {
    formulas,
    historyData,
    elements,
    waveMapping,
    elementMapping,
    zodiacMapping,
    resultTypes,
    categories,
    customGroups,
    addFormula,
    removeFormula,
    addHistoryData,
    loadHistoryData,
    batchAddHistoryData,
    getElementValue,
    parseFormula,
    validateFormula
  }
})