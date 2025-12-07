import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState('')

  // ローカルストレージからTODOを読み込む
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
  }, [])

  // TODOが変更されたらローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  // TODO追加
  const handleAddTodo = (e) => {
    e.preventDefault()
    if (inputValue.trim() === '') return

    const newTodo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
      createdAt: new Date().toISOString()
    }

    setTodos([...todos, newTodo])
    setInputValue('')
  }

  // TODO削除
  const handleDeleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  // TODO完了/未完了の切り替え
  const handleToggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  // 編集モード開始
  const handleStartEdit = (id, text) => {
    setEditingId(id)
    setEditingText(text)
  }

  // 編集キャンセル
  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingText('')
  }

  // 編集保存
  const handleSaveEdit = (id) => {
    if (editingText.trim() === '') return

    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: editingText } : todo
    ))
    setEditingId(null)
    setEditingText('')
  }

  return (
    <div className="app">
      <h1>TODO アプリ</h1>

      {/* TODO追加フォーム */}
      <form onSubmit={handleAddTodo} className="add-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="新しいTODOを入力..."
          className="input"
        />
        <button type="submit" className="button button-add">
          追加
        </button>
      </form>

      {/* TODO一覧 */}
      <div className="todo-list">
        {todos.length === 0 ? (
          <p className="empty-message">TODOはありません</p>
        ) : (
          todos.map(todo => (
            <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              {editingId === todo.id ? (
                // 編集モード
                <div className="edit-mode">
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="input edit-input"
                    autoFocus
                  />
                  <div className="button-group">
                    <button
                      onClick={() => handleSaveEdit(todo.id)}
                      className="button button-save"
                    >
                      保存
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="button button-cancel"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              ) : (
                // 表示モード
                <>
                  <div className="todo-content">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggleTodo(todo.id)}
                      className="checkbox"
                    />
                    <span className="todo-text">{todo.text}</span>
                  </div>
                  <div className="button-group">
                    <button
                      onClick={() => handleStartEdit(todo.id, todo.text)}
                      className="button button-edit"
                      disabled={todo.completed}
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="button button-delete"
                    >
                      削除
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* 統計情報 */}
      {todos.length > 0 && (
        <div className="stats">
          <p>
            全体: {todos.length} 件 |
            完了: {todos.filter(t => t.completed).length} 件 |
            未完了: {todos.filter(t => !t.completed).length} 件
          </p>
        </div>
      )}
    </div>
  )
}

export default App
