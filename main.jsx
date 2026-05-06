import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'

const inicial = [
  { id: 1, nome: 'Técnico Exemplo', funcao: 'Áudio', rg: '00.000.000-0', cpf: '000.000.000-00' }
]

function App() {
  const [logo, setLogo] = useState('')
  const [cliente, setCliente] = useState('')
  const [evento, setEvento] = useState('')
  const [data, setData] = useState('')
  const [tecnicos, setTecnicos] = useState(() => JSON.parse(localStorage.getItem('tecnicos') || 'null') || inicial)
  const [selecionados, setSelecionados] = useState([])
  const [form, setForm] = useState({ nome: '', funcao: '', rg: '', cpf: '' })

  function salvar(lista) {
    setTecnicos(lista)
    localStorage.setItem('tecnicos', JSON.stringify(lista))
  }

  function adicionar() {
    if (!form.nome.trim()) return alert('Digite o nome do técnico')
    salvar([...tecnicos, { ...form, id: Date.now() }])
    setForm({ nome: '', funcao: '', rg: '', cpf: '' })
  }

  function remover(id) {
    salvar(tecnicos.filter(t => t.id !== id))
    setSelecionados(selecionados.filter(x => x !== id))
  }

  const listaFinal = useMemo(() => tecnicos.filter(t => selecionados.includes(t.id)), [tecnicos, selecionados])

  function imprimir() { window.print() }

  function compartilhar() {
    const texto = `IMMERSION EVENTOS\nCliente: ${cliente}\nEvento: ${evento}\nData: ${data}\n\nEquipe:\n` + listaFinal.map((t, i) => `${i+1}. ${t.nome} - ${t.funcao} - RG: ${t.rg} - CPF: ${t.cpf}`).join('\n')
    navigator.clipboard.writeText(texto)
    alert('Lista copiada. Agora cole no WhatsApp ou e-mail.')
  }

  return <main>
    <section className="card topo">
      {logo ? <img src={logo} className="logo"/> : <div className="logo vazio">IE</div>}
      <div><h1>Immersion Eventos</h1><p>Lista de equipe para eventos</p></div>
    </section>

    <section className="card sem-impressao">
      <h2>Dados do evento</h2>
      <label>Logo da empresa<input type="file" accept="image/*" onChange={e => { const f=e.target.files[0]; if(f){ const r=new FileReader(); r.onload=()=>setLogo(r.result); r.readAsDataURL(f) }}} /></label>
      <input placeholder="Cliente" value={cliente} onChange={e=>setCliente(e.target.value)} />
      <input placeholder="Nome do evento" value={evento} onChange={e=>setEvento(e.target.value)} />
      <input type="date" value={data} onChange={e=>setData(e.target.value)} />
    </section>

    <section className="card sem-impressao">
      <h2>Cadastrar técnico</h2>
      <input placeholder="Nome completo" value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})}/>
      <input placeholder="Função" value={form.funcao} onChange={e=>setForm({...form,funcao:e.target.value})}/>
      <input placeholder="RG" value={form.rg} onChange={e=>setForm({...form,rg:e.target.value})}/>
      <input placeholder="CPF" value={form.cpf} onChange={e=>setForm({...form,cpf:e.target.value})}/>
      <button onClick={adicionar}>Adicionar técnico</button>
    </section>

    <section className="card sem-impressao">
      <h2>Selecionar equipe</h2>
      {tecnicos.map(t => <div className="linha" key={t.id}>
        <label className="check"><input type="checkbox" checked={selecionados.includes(t.id)} onChange={e => setSelecionados(e.target.checked ? [...selecionados, t.id] : selecionados.filter(x => x !== t.id))}/><span>{t.nome}<small>{t.funcao} • RG {t.rg} • CPF {t.cpf}</small></span></label>
        <button className="perigo" onClick={()=>remover(t.id)}>Excluir</button>
      </div>)}
    </section>

    <section className="card lista">
      <div className="cabecalho">{logo && <img src={logo}/>}<div><h2>Lista de Equipe</h2><p><b>Cliente:</b> {cliente || '---'} | <b>Evento:</b> {evento || '---'} | <b>Data:</b> {data || '---'}</p></div></div>
      <table><thead><tr><th>Nome</th><th>Função</th><th>RG</th><th>CPF</th></tr></thead><tbody>{listaFinal.map(t => <tr key={t.id}><td>{t.nome}</td><td>{t.funcao}</td><td>{t.rg}</td><td>{t.cpf}</td></tr>)}</tbody></table>
      {listaFinal.length === 0 && <p className="vazioTexto">Selecione os técnicos para gerar a lista.</p>}
      <div className="acoes sem-impressao"><button onClick={imprimir}>Salvar / imprimir PDF</button><button onClick={compartilhar}>Copiar lista</button></div>
    </section>
  </main>
}

createRoot(document.getElementById('root')).render(<App />)
