import React, { useState, useEffect, useCallback } from 'react';

export default function ChatApp({ usuarioLogado, aoSair }) {
    // Substituímos o estado interno pelo ID vindo com segurança do login
    const usuarioLogadoId = usuarioLogado?._id || ''; 

    const [salas, setSalas] = useState([]);
    const [salaAtiva, setSalaAtiva] = useState(null);
    const [mensagens, setMensagens] = useState([]);
    const [novoTexto, setNovoTexto] = useState('');
    
    // 📱 Estado para monitorar se a tela é mobile (menor que 768px)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Mantido sem alterações conforme exigência
    const REACT_APP_URL_BASE = process.env.REACT_APP_URL_BASE || 'http://localhost:3000';

    const buscarSalas = useCallback(async () => {
        if (!usuarioLogadoId) return;
        const dados = await fetch(`${REACT_APP_URL_BASE}/chats/alunos/${usuarioLogadoId}`).then(r => r.json());
        if (Array.isArray(dados)) setSalas(dados);
    }, [REACT_APP_URL_BASE, usuarioLogadoId]);

    const buscarMensagens = useCallback(async (roomId) => {
        const dados = await fetch(`${REACT_APP_URL_BASE}/chats/salas/${roomId}/mensagens`).then(r => r.json());
        if (Array.isArray(dados)) setMensagens(dados);
    }, [REACT_APP_URL_BASE]);

    useEffect(() => {
        if (usuarioLogadoId) {
            buscarSalas();
        }
    }, [usuarioLogadoId, buscarSalas]);

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
            setMensagens([...mensagens, res]); 
            setNovoTexto('');
        }
    };

    // 💡 Controle de visibilidade responsiva
    const mostrarLista = !isMobile || !salaAtiva;
    const mostrarChat = !isMobile || !!salaAtiva;

    return (
        <div style={{ 
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', 
            maxWidth: isMobile ? '100vw' : '900px', 
            margin: '0 auto', 
            border: isMobile ? 'none' : '1px solid #ddd',
            height: isMobile ? '100vh' : '600px',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#fff'
        }}>
            {/* Cabeçalho do Aplicativo: Identifica quem está logado e adiciona opção de Sair */}
            {mostrarLista && (
                <div style={{ 
                    backgroundColor: '#075e54', 
                    padding: '15px', 
                    color: '#fff', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
                }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '18px' }}>{usuarioLogado?.nome || 'Usuário'}</h3>
                        <small style={{ color: '#b3d4d0' }}>
                            {usuarioLogado?.papel === 'professor' ? 'Painel do Professor' : 'Painel do Aluno'}
                        </small>
                    </div>
                    {aoSair && (
                        <button 
                            onClick={aoSair} 
                            style={{ backgroundColor: '#128c7e', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            Sair
                        </button>
                    )}
                </div>
            )}

            {/* Área de Trabalho das Conversas */}
            <div style={{ display: 'flex', flex: 1, height: '100%', overflow: 'hidden' }}>
                
                {/* 1. Barra Lateral (Lista de Conversas) */}
                {mostrarLista && (
                    <div style={{ 
                        width: isMobile ? '100%' : '30%', 
                        borderRight: '1px solid #ddd', 
                        overflowY: 'auto', 
                        backgroundColor: '#fff' 
                    }}>
                        <h4 style={{ padding: '15px', margin: 0, color: '#075e54', borderBottom: '1px solid #f5f5f5' }}>Minhas Conversas</h4>
                        {salas.map(sala => (
                            <div 
                                key={sala._id} 
                                onClick={() => setSalaAtiva(sala)}
                                style={{
                                    padding: '15px', 
                                    cursor: 'pointer', 
                                    borderBottom: '1px solid #eee',
                                    backgroundColor: salaAtiva?._id === sala._id ? '#e6f7ff' : 'transparent',
                                    transition: 'background 0.2s'
                                }}
                            >
                                <strong style={{ color: '#333', display: 'block' }}>{sala.nome}</strong>
                                <span style={{ fontSize: '12px', color: '#777', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{sala.descricao}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* 2. Área Principal da Conversa */}
                {mostrarChat && (
                    <div style={{ 
                        width: isMobile ? '100%' : '70%', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        backgroundColor: '#efeae2',
                        height: '100%'
                    }}>
                        {salaAtiva ? (
                            <>
                                {/* Topo do Chat */}
                                <div style={{ 
                                    padding: '12px 15px', 
                                    borderBottom: '1px solid #ddd', 
                                    backgroundColor: '#075e54', 
                                    color: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}>
                                    {isMobile && (
                                        <button 
                                            onClick={() => setSalaAtiva(null)} 
                                            style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', fontSize: '18px', cursor: 'pointer', padding: '4px' }}
                                        >
                                            ⬅
                                        </button>
                                    )}
                                    <strong>{salaAtiva.nome}</strong>
                                </div>

                                {/* Histórico de Mensagens */}
                                <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {mensagens.map(msg => {
                                        const souEu = msg.remetente?._id === usuarioLogadoId;
                                        return (
                                            <div key={msg._id} style={{ alignSelf: souEu ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                                                {!souEu && (
                                                    <small style={{ color: '#2b655e', fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '2px', marginLeft: '4px' }}>
                                                        {msg.remetente?.nome || "Usuário Excluído"}
                                                    </small>
                                                )}
                                                <div style={{
                                                    backgroundColor: souEu ? '#d9fdd3' : '#fff',
                                                    padding: '8px 12px',
                                                    borderRadius: souEu ? '10px 0px 10px 10px' : '0px 10px 10px 10px',
                                                    boxShadow: '0 1px 1px rgba(0,0,0,0.08)',
                                                    fontSize: '15px',
                                                    color: '#111'
                                                }}>
                                                    {msg.conteudo}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Caixa de Texto para Envio */}
                                <form onSubmit={handleEnviarMensagem} style={{ padding: '8px 10px', backgroundColor: '#f0f0f0', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <input 
                                        value={novoTexto}
                                        onChange={e => setNovoTexto(e.target.value)}
                                        placeholder="Digite sua mensagem acadêmica..." 
                                        style={{ flex: 1, padding: '10px 16px', borderRadius: '20px', border: 'none', outline: 'none', fontSize: '15px' }}
                                    />
                                    <button type="submit" style={{ 
                                        backgroundColor: '#00a884', 
                                        color: '#fff', 
                                        border: 'none', 
                                        width: '40px', 
                                        height: '40px', 
                                        borderRadius: '50%', 
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        flexShrink: 0
                                    }}>
                                        ➔
                                    </button>
                                    
                                    {!isMobile && (
                                        <button type="button" onClick={() => setSalaAtiva(null)} style={{ padding: '10px 15px', backgroundColor: '#f44336', color: '#fff', border: 'none', borderRadius: '20px', cursor: 'pointer' }}>
                                            Fechar
                                        </button>
                                    )}
                                </form>
                            </>
                        ) : (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#8696a0', backgroundColor: '#f0f2f5', padding: '20px', textAlign: 'center' }}>
                                Selecione uma conversa para começar a interagir.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}