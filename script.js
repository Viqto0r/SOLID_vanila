// Принцип единственной ответственности (S):
// Класс отвечает только за общие свойства фигур
class Shape {
  constructor(size, color) {
    this.size = size
    this.color = color
  }

  calculateArea() {
    throw new Error('Это абстрактный метод')
  }

  getInfo() {
    throw new Error('Это абстрактный метод')
  }

  render() {
    throw new Error('Это абстрактный метод')
  }
}

class Circle extends Shape {
  constructor(size) {
    super(size, '#3498db')
  }

  calculateArea() {
    return Math.PI * this.size * this.size
  }

  getInfo() {
    return `Круг (R=${this.size})`
  }

  render() {
    const div = document.createElement('div')
    div.className = 'circle-shape'
    div.style.backgroundColor = this.color
    div.style.width = `${this.size * 2}px`
    div.style.height = `${this.size * 2}px`
    return div
  }
}

class Square extends Shape {
  constructor(size) {
    super(size, '#e74c3c')
  }

  calculateArea() {
    return this.size * this.size
  }

  getInfo() {
    return `Квадрат (${this.size}×${this.size})`
  }

  render() {
    const div = document.createElement('div')
    div.className = 'square-shape'
    div.style.backgroundColor = this.color
    div.style.width = `${this.size}px`
    div.style.height = `${this.size}px`
    return div
  }
}

// Принцип открытости/закрытости (O):
// Добавляем новую фигуру без изменения существующего кода
class Triangle extends Shape {
  constructor(size) {
    super(size, '#2ecc71')
  }

  calculateArea() {
    return (this.size * this.size * Math.sqrt(3)) / 4
  }

  getInfo() {
    return `Треугольник (${this.size})`
  }

  render() {
    const div = document.createElement('div')
    div.className = 'triangle-shape'
    div.style.borderBottomColor = this.color
    div.style.borderLeftWidth = `${this.size}px`
    div.style.borderRightWidth = `${this.size}px`
    div.style.borderBottomWidth = `${this.size * 1.732}px`
    return div
  }
}

// Принцип единственной ответственности (S):
// Класс отвечает только за вычисление общей площади
class AreaCalculator {
  constructor(shapes = []) {
    this.shapes = shapes
  }

  calculateTotal() {
    return this.shapes.reduce(
      (total, shape) => total + shape.calculateArea(),
      0
    )
  }

  addShape(shape) {
    this.shapes.push(shape)
  }

  removeShape(index) {
    if (index >= 0 && index < this.shapes.length) {
      this.shapes.splice(index, 1)
      return true
    }
    return false
  }

  getShapes() {
    return this.shapes
  }

  getCount() {
    return this.shapes.length
  }
}

// Принцип единственной ответственности (S):
// Класс отвечает только за отображение фигур
class ShapeRenderer {
  constructor(containerId) {
    this.container = document.getElementById(containerId)
  }

  render(shapes) {
    this.container.innerHTML = ''

    if (shapes.length === 0) {
      this.container.innerHTML =
        '<div style="text-align:center;color:#777;grid-column:1/-1">Нет фигур</div>'
      return
    }

    shapes.forEach((shape, index) => {
      const shapeElement = this.createShapeElement(shape, index)
      this.container.appendChild(shapeElement)
    })
  }

  createShapeElement(shape, index) {
    const div = document.createElement('div')
    div.className = 'shape-item'

    const visualContainer = document.createElement('div')
    visualContainer.className = 'shape-visual'
    visualContainer.appendChild(shape.render())

    const infoDiv = document.createElement('div')
    infoDiv.className = 'shape-info'
    infoDiv.innerHTML = `
            <div class="shape-name">${shape.getInfo()}</div>
            <div class="shape-area">Площадь: ${shape
              .calculateArea()
              .toFixed(2)}</div>
        `

    const deleteBtn = document.createElement('button')
    deleteBtn.className = 'delete-btn'
    deleteBtn.textContent = 'Удалить'
    deleteBtn.dataset.index = index

    div.appendChild(visualContainer)
    div.appendChild(infoDiv)
    div.appendChild(deleteBtn)

    return div
  }

  updateStats(count, area) {
    document.getElementById('count').textContent = count
    document.getElementById('area').textContent = area.toFixed(2)
  }
}

class App {
  constructor() {
    // Принцип инверсии зависимостей (D):
    // Зависим от абстракций (Shape), а не от конкретных классов
    this.shapes = []
    this.calculator = new AreaCalculator(this.shapes)
    this.renderer = new ShapeRenderer('shapesList')

    this.init()
  }

  init() {
    document
      .getElementById('addBtn')
      .addEventListener('click', () => this.addShape())
    this.container = document.getElementById('shapesList')

    this.container.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-btn')) {
        const index = parseInt(e.target.dataset.index)
        this.deleteShape(index)
      }
    })

    this.addDemoShapes()
    this.updateUI()
  }

  addDemoShapes() {
    // Принцип подстановки Лисков (L):
    // Разные типы фигур в одном массиве
    this.shapes.push(new Circle(30))
    this.shapes.push(new Square(40))
    this.shapes.push(new Triangle(35))
  }

  addShape() {
    const type = document.getElementById('shapeType').value
    const size = parseInt(document.getElementById('shapeSize').value)

    let shape
    switch (type) {
      case 'circle':
        shape = new Circle(size)
        break
      case 'square':
        shape = new Square(size)
        break
      case 'triangle':
        shape = new Triangle(size)
        break
    }

    this.shapes.push(shape)
    this.updateUI()
  }

  deleteShape(index) {
    this.shapes.splice(index, 1)
    this.updateUI()
  }

  updateUI() {
    this.renderer.render(this.shapes)
    this.updateStats()
  }

  updateStats() {
    const total = this.calculator.calculateTotal()
    const count = this.shapes.length
    this.renderer.updateStats(count, total)
  }
}

const app = new App()
