import React, { useState, useEffect, useCallback } from 'react';

export default function ChatApp() {
    const [usuarioLogadoId, setUsuarioLogadoId] = useState(''); // ID do aluno/professor testado
    const [salas, setSalas] = useState([]);
    const [salaAtiva, setSalaAtiva] = useState(null);
    const [mensagens, setMensagens] = useState([]);
    const [novoTexto, setNovoTexto] = useState('');

    const REACT_APP_URL_BASE = process.env.REACT_APP_URL_BASE || 'http://localhost:3000';
    console.log(REACT_APP_URL_BASE);
    

    const buscarSalas = useCallback(async () => {
        const dados = await fetch(`${REACT_APP_URL_BASE}/chats/alunos/${usuarioLogadoId}`).then(r => r.json());
        if (Array.isArray(dados)) setSalas(dados);
    }, [REACT_APP_URL_BASE, usuarioLogadoId]);

    const buscarMensagens = useCallback(async (roomId) => {
        const dados = await fetch(`${REACT_APP_URL_BASE}/chats/salas/${roomId}/mensagens`).then(r => r.json());
        if (Array.isArray(dados)) setMensagens(dados);
    }, [REACT_APP_URL_BASE]);

    // Busca as salas sempre que o usuário "logar"
    useEffect(() => {
        if (usuarioLogadoId) {
            buscarSalas();
        }
    }, [usuarioLogadoId, buscarSalas]);

    // Polling: Atualiza as mensagens a cada 3 segundos se houver chat aberto
    useEffect(() => {
        let intervalo;
        if (salaAtiva) {
            buscarMensagens(salaAtiva._id);
            intervalo = setInterval(() => buscarMensagens(salaAtiva._id), 3000);
        }
        return () => clearInterval(intervalo);
    }, [salaAtiva, buscarMensagens]);

    const handleEnviarMensagem = async (e) => {
        e.preventDefault();
        if (!novoTexto.trim() || !salaAtiva) return;

        const res = await fetch(`${REACT_APP_URL_BASE}/chats/salas/${salaAtiva._id}/mensagens`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                remetenteId: usuarioLogadoId,
                conteudo: novoTexto
            })
        }).then(r => r.json());

        if (!res.error) {
            setMensagens([...mensagens, res]); // Adiciona na tela imediatamente
            setNovoTexto('');
        }
    };

    return (
        <div style={{ fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto', border: '1px solid #ddd' }}>
            {/* Simulador de Login */}
            <div style={{ backgroundColor: '#f5f5f5', padding: '10px', borderBottom: '1px solid #ddd' }}>
                <label><strong>Simulador de Login (Cole o ID do Aluno): </strong></label>
                <input 
                    value={usuarioLogadoId} 
                    onChange={e => setUsuarioLogadoId(e.target.value)} 
                    placeholder="Ex: 65e6b..." 
                    style={{ width: '250px', marginLeft: '10px' }}
                />
                <button onClick={buscarSalas} style={{ marginLeft: '10px' }}>Entrar</button>
            </div>

            <div style={{ display: 'flex', height: '500px' }}>
                {/* Barra Lateral: Lista de Chats */}
                <div style={{ width: '30%', borderRight: '1px solid #ddd', overflowY: 'auto', backgroundColor: '#fafafa' }}>
                    <h4 style={{ padding: '0 15px' }}>Minhas Conversas</h4>
                    {salas.map(sala => (
                        <div 
                            key={sala._id} 
                            onClick={() => setSalaAtiva(sala)}
                            style={{
                                padding: '15px', 
                                cursor: 'pointer', 
                                borderBottom: '1px solid #eee',
                                backgroundColor: salaAtiva?._id === sala._id ? '#e6f7ff' : 'transparent'
                            }}
                        >
                            <strong>{sala.nome}</strong>
                            <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#777' }}>{sala.descricao}</p>
                        </div>
                    ))}
                </div>

                {/* Área Principal: Janela de Conversa */}
                <div style={{ width: '70%', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
                    {salaAtiva ? (
                        <>
                            {/* Topo do Chat */}
                            <div style={{ padding: '10px 15px', borderBottom: '1px solid #ddd', backgroundColor: '#fff' }}>
                                <strong>{salaAtiva.nome}</strong>
                            </div>

                            {/* Histórico de Mensagens */}
                            <div style={{ flex: 1, padding: '15px', overflowY: 'auto', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {mensagens.map(msg => {
                                    const souEu = msg.remetente?._id === usuarioLogadoId;
                                    return (
                                        <div key={msg._id} style={{ alignSelf: souEu ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                                            <small style={{ color: '#555', display: 'block', marginBottom: '2px', textAlign: souEu ? 'right' : 'left' }}>
                                                {msg.remetente?.nome || "Usuário Excluído"}
                                            </small>
                                            <div style={{
                                                backgroundColor: souEu ? '#dcf8c6' : '#fff',
                                                padding: '10px',
                                                borderRadius: '8px',
                                                boxShadow: '0 1px 1px rgba(0,0,0,0.1)'
                                            }}>
                                                {msg.conteudo}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Caixa de Texto para Envio */}
                            <form onSubmit={handleEnviarMensagem} style={{ padding: '10px', borderTop: '1px solid #ddd', display: 'flex', gap: '10px', backgroundColor: '#fff' }}>
                                <input 
                                    value={novoTexto}
                                    onChange={e => setNovoTexto(e.target.value)}
                                    placeholder="Digite sua mensagem acadêmica..." 
                                    style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#0084ff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                    Enviar
                                </button>
                                <button type="button" onClick={() => setSalaAtiva(null)} style={{ padding: '10px 20px', backgroundColor: '#f44336', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                    Limpar
                                </button>
                            </form>
                        </>
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#999' }}>
                            Selecione uma sala ou faça login para começar a interagir.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}