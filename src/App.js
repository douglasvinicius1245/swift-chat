import React from 'react';
import CadastroForm from './components/CadrastoForm';
import ChatApp from './components/ChatApp';

export default function App() {
    return (
        <div>
            <h1 style={{ textAlign: 'center', fontFamily: 'sans-serif', color: '#333' }}>
                Portal Acadêmico & Mensageria Interna
            </h1>
            <hr />
            <CadastroForm />
            <br /><hr /><br />
            <ChatApp />
        </div>
    );
}