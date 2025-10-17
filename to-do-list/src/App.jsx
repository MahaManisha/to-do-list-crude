import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('todos') || '[]')
    } catch {
      return []
    }
  })
  const [text, setText] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState('')

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  function addTodo() {
    const value = text.trim()
    if (!value) return
    setTodos(prev => [{ id: Date.now(), text: value, done: false }, ...prev])
    setText('')
  }

  function toggle(id) {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  function remove(id) {
    if (editingId === id) {
      setEditingId(null)
      setEditingText('')
    }
    setTodos(prev => prev.filter(t => t.id !== id))
  }
  function startEdit(todo) {
    setEditingId(todo.id)
    setEditingText(todo.text)
  }
  function cancelEdit() {
    setEditingId(null)
    setEditingText('')
  }
  function saveEdit(id) {
    const value = editingText.trim()
    if (!value) {
      cancelEdit()
      return
    }
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, text: value } : t)))
    cancelEdit()
  }

  return (
    <div className="app">
      <h1>Simple To‑Do List</h1>

      <div className="new-todo">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') addTodo()
          }}
          placeholder="Add a task and press Enter or click Add"
          aria-label="New task"
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <ul className="todos">
        {todos.length === 0 && <li className="empty">No tasks — add one above.</li>}
        {todos.map(todo => (
          <li key={todo.id} className={todo.done ? 'done' : ''}>
            {editingId === todo.id ? (
              // edit mode
              <div className="editing">
                <input
                  className="todo-edit-input"
                  value={editingText}
                  onChange={e => setEditingText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') saveEdit(todo.id)
                    if (e.key === 'Escape') cancelEdit()
                  }}
                  aria-label={`Edit ${todo.text}`}
                  autoFocus
                />
                <div className="edit-actions">
                  <button onClick={() => saveEdit(todo.id)}>Save</button>
                  <button onClick={cancelEdit}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <label>
                  <input type="checkbox" checked={todo.done} onChange={() => toggle(todo.id)} />
                  <span>{todo.text}</span>
                </label>
                <div className="item-actions">
                  <button className="edit" onClick={() => startEdit(todo)} aria-label={`Edit ${todo.text}`}>
                    Edit
                  </button>
                  <button className="remove" onClick={() => remove(todo.id)} aria-label={`Remove ${todo.text}`}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App