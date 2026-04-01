import { useState, useEffect } from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

function App() {
  const [tarefas, setTarefas] = useState([])
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [editando, setEditando] = useState(null)

  const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || '/api'
  })

  const carregarTarefas = async () => {
    const res = await api.get('/tarefas')
    setTarefas(res.data)
  }

  useEffect(() => {
    carregarTarefas()
  }, [])

  const criarTarefa = async (e) => {
    e.preventDefault()
    if (!titulo) return

    await api.post('/tarefas', { titulo, descricao })
    setTitulo('')
    setDescricao('')
    carregarTarefas()
  }

  const atualizarTarefa = async (e) => {
    e.preventDefault()
    if (!titulo || !editando) return

    await api.put(`/tarefas/${editando.id}`, { titulo, descricao })
    setEditando(null)
    setTitulo('')
    setDescricao('')
    carregarTarefas()
  }

  const excluirTarefa = async (id) => {
    if (!confirm('Excluir esta tarefa?')) return
    await api.delete(`/tarefas/${id}`)
    carregarTarefas()
  }

  const toggleConcluida = async (id) => {
    await api.patch(`/tarefas/${id}/toggle`)
    carregarTarefas()
  }

  const editar = (tarefa) => {
    setEditando(tarefa)
    setTitulo(tarefa.titulo)
    setDescricao(tarefa.descricao || '')
  }

  const cancelarEdicao = () => {
    setEditando(null)
    setTitulo('')
    setDescricao('')
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">📋 Lista de Tarefas (React + Flask)</h1>

      {/* Formulário */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>{editando ? 'Editar Tarefa' : 'Nova Tarefa'}</h5>
          <form onSubmit={editando ? atualizarTarefa : criarTarefa}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Título da tarefa *"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <textarea
                className="form-control"
                rows="2"
                placeholder="Descrição (opcional)"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary me-2">
              {editando ? 'Atualizar' : 'Criar Tarefa'}
            </button>
            {editando && (
              <button type="button" className="btn btn-secondary" onClick={cancelarEdicao}>
                Cancelar
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Lista de Tarefas */}
      <h4>Tarefas ({tarefas.length})</h4>
      {tarefas.length === 0 ? (
        <p className="text-muted">Nenhuma tarefa ainda...</p>
      ) : (
        <div className="row">
          {tarefas.map(t => (
            <div key={t.id} className="col-md-6 mb-3">
              <div className={`card ${t.concluida ? 'border-success' : ''}`}>
                <div className="card-body">
                  <h5 className={`card-title ${t.concluida ? 'text-decoration-line-through text-success' : ''}`}>
                    {t.titulo}
                  </h5>
                  {t.descricao && <p className="card-text">{t.descricao}</p>}
                  <small className="text-muted">{t.data_criacao}</small>

                  <div className="mt-3">
                    <button
                      onClick={() => toggleConcluida(t.id)}
                      className={`btn btn-sm me-2 ${t.concluida ? 'btn-secondary' : 'btn-success'}`}
                    >
                      {t.concluida ? '↩️ Desfazer' : '✅ Concluir'}
                    </button>
                    <button onClick={() => editar(t)} className="btn btn-sm btn-warning me-2">
                      ✏️ Editar
                    </button>
                    <button onClick={() => excluirTarefa(t.id)} className="btn btn-sm btn-danger">
                      🗑️ Excluir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App