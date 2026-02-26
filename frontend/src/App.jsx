import { useState, useEffect } from "react";
import axios from "axios";

const API = "https://SEU-BACKEND.onrender.com";

function App() {
  const [items, setItems] = useState([]);
  const [nome, setNome] = useState("");

  useEffect(() => {
    carregar();
  }, []);

  const carregar = async () => {
    const res = await axios.get(`${API}/items`);
    setItems(res.data);
  };

  const criar = async () => {
    await axios.post(`${API}/items`, { nome });
    setNome("");
    carregar();
  };

  const deletar = async (id) => {
    await axios.delete(`${API}/items/${id}`);
    carregar();
  };

  return (
    <div>
      <h1>CRUD Teste</h1>

      <input 
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <button onClick={criar}>Adicionar</button>

      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.nome}
            <button onClick={() => deletar(item.id)}>
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;