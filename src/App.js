import React, { useState } from 'react';
import Login from './components/Login';
import PainelProfessor from './components/PainelProfessor';
import ChatApp from './components/ChatApp';

export default function App() {
    const [usuario, setUsuario] = useState(null); // Guarda o objeto do usuário logado
    const [telaAtual, setTelaAtual] = useState('login'); // 'login', 'dashboard_professor', 'chat'

    const lidarComLoginSucesso = (dadosUsuario) => {
        setUsuario(dadosUsuario);
        if (dadosUsuario.papel === 'professor') {
            setTelaAtual('dashboard_professor'); // Professor vai para a área de gestão primeiro
        } else {
            setTelaAtual('chat'); // Aluno cai direto na sala de conversas dele
        }
    };

    const lidarComLogout = () => {
        setUsuario(null);
        setTelaAtual('login');
    };

    return (
        <div>
            {telaAtual === 'login' && (
                <Login onLoginSucesso={lidarComLoginSucesso} />
            )}

            {telaAtual === 'dashboard_professor' && (
                <PainelProfessor 
                    professorLogado={usuario} 
                    aoClicarNoChat={() => setTelaAtual('chat')} 
                />
            )}

            {telaAtual === 'chat' && (
                <ChatApp 
                    usuarioLogado={usuario} 
                    aoSair={usuario.papel === 'professor' ? () => setTelaAtual('dashboard_professor') : lidarComLogout} 
                />
            )}
        </div>
    );
}