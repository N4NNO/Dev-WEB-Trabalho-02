const { useState, useEffect } = React;
const API_URL = 'http://localhost:3001/api';

function App() {
    const [jogadores, setJogadores] = useState([]);
    const [pagamentos, setPagamentos] = useState([]);
    const [jogadorForm, setJogadorForm] = useState({ nome: '', email: '', datanasc: '' });
    const [pagamentoForm, setPagamentoForm] = useState({ ano: '', mes: '', valor: '', cod_jogador: '' });
    const [editandoJogador, setEditandoJogador] = useState(null);
    const [filtroJogador, setFiltroJogador] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [loading, setLoading] = useState(true);

    // Carregar dados iniciais
    useEffect(() => {
        const carregar = async () => {
            try {
                await Promise.all([carregarJogadores(), carregarPagamentos()]);
            } catch (err) {
                setMensagem('Erro ao carregar dados. Verifique se a API está rodando.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        carregar();
    }, []);

    const carregarJogadores = async () => {
        try {
            const res = await fetch(`${API_URL}/jogadores`);
            if (!res.ok) throw new Error('Erro ao buscar jogadores');
            const data = await res.json();
            setJogadores(data);
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const carregarPagamentos = async (jogadorId = '') => {
        try {
            const url = jogadorId ? `${API_URL}/pagamentos?jogadorId=${jogadorId}` : `${API_URL}/pagamentos`;
            const res = await fetch(url);
            if (!res.ok) throw new Error('Erro ao buscar pagamentos');
            const data = await res.json();
            setPagamentos(data);
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const handleJogadorSubmit = async (e) => {
        e.preventDefault();
        setMensagem('');
        try {
            let res;
            if (editandoJogador) {
                res = await fetch(`${API_URL}/jogadores/${editandoJogador.cod_jogador}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(jogadorForm)
                });
            } else {
                res = await fetch(`${API_URL}/jogadores`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(jogadorForm)
                });
            }

            if (!res.ok) {
                const erro = await res.json();
                setMensagem(`Erro: ${erro.erro || res.statusText}`);
                return;
            }

            setMensagem(editandoJogador ? 'Jogador atualizado!' : 'Jogador cadastrado!');
            setJogadorForm({ nome: '', email: '', datanasc: '' });
            setEditandoJogador(null);
            await carregarJogadores();
            await carregarPagamentos(filtroJogador);
        } catch (err) {
            setMensagem('Erro de conexão com a API');
            console.error(err);
        }
    };

    const handlePagamentoSubmit = async (e) => {
        e.preventDefault();
        setMensagem('');
        try {
            const res = await fetch(`${API_URL}/pagamentos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pagamentoForm)
            });
            if (!res.ok) {
                const erro = await res.json();
                setMensagem(`Erro: ${erro.erro || res.statusText}`);
                return;
            }
            setMensagem('Pagamento registrado!');
            setPagamentoForm({ ano: '', mes: '', valor: '', cod_jogador: '' });
            await carregarPagamentos(filtroJogador);
        } catch (err) {
            setMensagem('Erro de conexão');
            console.error(err);
        }
    };

    const deletarJogador = async (id) => {
        if (!window.confirm('Deseja excluir este jogador e todos os seus pagamentos?')) return;
        try {
            const res = await fetch(`${API_URL}/jogadores/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Erro ao remover');
            setMensagem('Jogador removido');
            await carregarJogadores();
            await carregarPagamentos(filtroJogador);
        } catch (err) {
            setMensagem('Erro ao remover jogador');
            console.error(err);
        }
    };

    const deletarPagamento = async (id) => {
        if (!window.confirm('Excluir pagamento?')) return;
        try {
            const res = await fetch(`${API_URL}/pagamentos/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Erro ao remover');
            setMensagem('Pagamento removido');
            await carregarPagamentos(filtroJogador);
        } catch (err) {
            setMensagem('Erro ao remover pagamento');
            console.error(err);
        }
    };

    const editarJogador = (jogador) => {
        setEditandoJogador(jogador);
        setJogadorForm({
            nome: jogador.nome,
            email: jogador.email,
            datanasc: jogador.datanasc
        });
    };

    const handleFiltroJogador = async (e) => {
        const id = e.target.value;
        setFiltroJogador(id);
        await carregarPagamentos(id);
    };

    if (loading) {
        return <div className="App"><div className="loading">Carregando...</div></div>;
    }

    return (
        <div className="App">
            <h1>⚽ Futebol API - Gestão de Mensalistas</h1>

            {mensagem && <div className="mensagem">{mensagem}</div>}

            <div className="container">
                {/* Card Jogador */}
                <div className="card">
                    <h2>{editandoJogador ? 'Editar Jogador' : 'Cadastrar Jogador'}</h2>
                    <form onSubmit={handleJogadorSubmit}>
                        <input
                            type="text"
                            placeholder="Nome"
                            value={jogadorForm.nome}
                            onChange={e => setJogadorForm({ ...jogadorForm, nome: e.target.value })}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={jogadorForm.email}
                            onChange={e => setJogadorForm({ ...jogadorForm, email: e.target.value })}
                            required
                        />
                        <input
                            type="date"
                            placeholder="Data Nascimento"
                            value={jogadorForm.datanasc}
                            onChange={e => setJogadorForm({ ...jogadorForm, datanasc: e.target.value })}
                            required
                        />
                        <button type="submit">{editandoJogador ? 'Atualizar' : 'Salvar'}</button>
                        {editandoJogador && (
                            <button type="button" onClick={() => {
                                setEditandoJogador(null);
                                setJogadorForm({ nome: '', email: '', datanasc: '' });
                            }}>Cancelar</button>
                        )}
                    </form>
                </div>

                {/* Lista Jogadores */}
                <div className="card">
                    <h2>Jogadores</h2>
                    <table>
                        <thead>
                            <tr><th>ID</th><th>Nome</th><th>Email</th><th>Nasc.</th><th>Ações</th></tr>
                        </thead>
                        <tbody>
                            {jogadores.map(j => (
                                <tr key={j.cod_jogador}>
                                    <td>{j.cod_jogador}</td>
                                    <td>{j.nome}</td>
                                    <td>{j.email}</td>
                                    <td>{j.datanasc}</td>
                                    <td>
                                        <button onClick={() => editarJogador(j)}>Editar</button>
                                        <button onClick={() => deletarJogador(j.cod_jogador)}>Excluir</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Card Pagamento */}
                <div className="card">
                    <h2>Registrar Pagamento</h2>
                    <form onSubmit={handlePagamentoSubmit}>
                        <select
                            value={pagamentoForm.cod_jogador}
                            onChange={e => setPagamentoForm({ ...pagamentoForm, cod_jogador: e.target.value })}
                            required
                        >
                            <option value="">Selecione o jogador</option>
                            {jogadores.map(j => <option key={j.cod_jogador} value={j.cod_jogador}>{j.nome}</option>)}
                        </select>
                        <input
                            type="number"
                            placeholder="Ano"
                            value={pagamentoForm.ano}
                            onChange={e => setPagamentoForm({ ...pagamentoForm, ano: e.target.value })}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Mês (1-12)"
                            value={pagamentoForm.mes}
                            onChange={e => setPagamentoForm({ ...pagamentoForm, mes: e.target.value })}
                            required
                            min="1"
                            max="12"
                        />
                        <input
                            type="number"
                            step="0.01"
                            placeholder="Valor"
                            value={pagamentoForm.valor}
                            onChange={e => setPagamentoForm({ ...pagamentoForm, valor: e.target.value })}
                            required
                        />
                        <button type="submit">Registrar</button>
                    </form>
                </div>

                {/* Lista Pagamentos */}
                <div className="card">
                    <h2>Pagamentos</h2>
                    <div className="filtro">
                        <label>Filtrar por jogador: </label>
                        <select value={filtroJogador} onChange={handleFiltroJogador}>
                            <option value="">Todos</option>
                            {jogadores.map(j => <option key={j.cod_jogador} value={j.cod_jogador}>{j.nome}</option>)}
                        </select>
                    </div>
                    <table>
                        <thead>
                            <tr><th>ID</th><th>Jogador</th><th>Ano</th><th>Mês</th><th>Valor</th><th>Ações</th></tr>
                        </thead>
                        <tbody>
                            {pagamentos.map(p => (
                                <tr key={p.cod_pagamento}>
                                    <td>{p.cod_pagamento}</td>
                                    <td>{p.nome_jogador}</td>
                                    <td>{p.ano}</td>
                                    <td>{p.mes}</td>
                                    <td>R$ {parseFloat(p.valor).toFixed(2)}</td>
                                    <td><button onClick={() => deletarPagamento(p.cod_pagamento)}>Excluir</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Renderização
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);