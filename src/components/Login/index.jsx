import React, { useState } from 'react';

export default function Login({ onLoginSucesso }) {
    const [tipo, setTipo] = useState('aluno'); // 'aluno' ou 'professor'
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');

        const REACT_APP_URL_BASE = process.env.REACT_APP_URL_BASE || 'http://localhost:3000'; // Alterado para string fixa para evitar problemas com process.env
        const rota = tipo === 'aluno' ? '/login/aluno' : '/login/professor';

        try {
            console.log(`Enviando login para: ${REACT_APP_URL_BASE}${rota}`);
            
            const resposta = await fetch(`${REACT_APP_URL_BASE}${rota}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            }).then(r => r.json());
            
            // 🔍 DEBUG: Dá uma olhada no F12 do navegador para ver a estrutura exata que sua API respondeu
            console.log("Resposta tratada do endpoint de Login:", resposta);

            // Se a API retornou alguma mensagem de erro tratada no backend (ex: senha incorreta)
            if (resposta.error || resposta.mensagemErro) {
                setErro(resposta.error || resposta.mensagemErro || 'Credenciais inválidas.');
                return;
            }

            // Se o login deu certo, a API deve ter devolvido o objeto do Aluno/Professor com um _id válido
            if (resposta && resposta._id) {
                console.log("🎉 Login efetuado com sucesso!");
                
                // Passa os dados do usuário + o papel para o App.jsx liberar o acesso
                onLoginSucesso({ ...resposta, papel: tipo });
            } else {
                setErro('Usuário ou senha inválidos.');
            }

        } catch (err) {
            console.error("Erro capturado no bloco catch:", err);
            setErro('Falha na conexão com a API. Verifique se o servidor backend está rodando.');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5', padding: '20px', fontFamily: 'sans-serif' }}>
            <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', color: '#075e54', margin: '0 0 20px' }}>Portal Acadêmico</h2>
                
                {erro && <p style={{ color: 'red', textAlign: 'center', fontSize: '14px' }}>{erro}</p>}

                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <button type="button" onClick={() => setTipo('aluno')} style={{ flex: 1, padding: '10px', borderRadius: '20px', border: 'none', backgroundColor: tipo === 'aluno' ? '#00a884' : '#ddd', color: tipo === 'aluno' ? '#fff' : '#333', fontWeight: 'bold', cursor: 'pointer' }}>Sou Aluno</button>
                    <button type="button" onClick={() => setTipo('professor')} style={{ flex: 1, padding: '10px', borderRadius: '20px', border: 'none', backgroundColor: tipo === 'professor' ? '#00a884' : '#ddd', color: tipo === 'professor' ? '#fff' : '#333', fontWeight: 'bold', cursor: 'pointer' }}>Sou Professor</button>
                </div>

                <input type="email" placeholder="Seu E-mail" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                <input type="password" placeholder="Sua Senha" value={senha} onChange={e => setSenha(e.target.value)} required style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />

                <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#075e54', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>Entrar no Sistema</button>
            </form>
        </div>
    );
}