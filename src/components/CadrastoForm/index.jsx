import React, { useState, useEffect } from 'react';

export default function CadastroForm() {
    const [professores, setProfessores] = useState([]);
    const [alunos, setAlunos] = useState([]);
    
    // States dos formulários
    const [profForm, setProfForm] = useState({ nome: '', email: '', materia: '', senha: '123' });
    const [alunoForm, setAlunoForm] = useState({ nome: '', email: '', idade: '', senha: '123' });
    const [turmaForm, setTurmaForm] = useState({ nome: '', anoLetivo: 2026, professorResponsavelId: '', alunosIds: [] });

    const URL_BASE = process.env.URL_BASE || 'http://localhost:3000';

    // Carrega dados iniciais para montar os selects da turma
    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            const p = await fetch(`${URL_BASE}/professor`).then(r => r.json());
            const a = await fetch(`${URL_BASE}/alunos`).then(r => r.json());
            setProfessores(Array.isArray(p) ? p : []);
            setAlunos(Array.isArray(a) ? a : []);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    };

    const handleCriarProfessor = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${URL_BASE}/professor`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profForm)
            });
            alert('Professor Criado!');
            carregarDados();
        } catch (error) {
            console.error('Erro ao criar professor:', error);
        }
    };

    const handleCriarAluno = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${URL_BASE}/alunos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(alunoForm)
            });
            alert('Aluno Criado!');
            carregarDados();
        } catch (error) {
            console.error('Erro ao criar aluno:', error);
        }
    };

    const handleCriarTurma = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${URL_BASE}/turma`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(turmaForm)
            }).then(r => r.json());

            alert(`Turma criada! Status do chat: ${res.chatAutomatico}`);
        } catch (error) {
            console.error('Erro ao criar turma:', error);
        }
    };

    return (
        <div style={{ display: 'flex', gap: '20px', padding: '20px', fontFamily: 'sans-serif' }}>
            {/* Form Professor */}
            <form onSubmit={handleCriarProfessor} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
                <h3>Cadastrar Professor</h3>
                <input placeholder="Nome" onChange={e => setProfForm({...profForm, nome: e.target.value})} required /><br/><br/>
                <input placeholder="Email" type="email" onChange={e => setProfForm({...profForm, email: e.target.value})} required /><br/><br/>
                <input placeholder="Matéria" onChange={e => setProfForm({...profForm, materia: e.target.value})} required /><br/><br/>
                <button type="submit">Salvar Professor</button>
            </form>

            {/* Form Aluno */}
            <form onSubmit={handleCriarAluno} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
                <h3>Cadastrar Aluno</h3>
                <input placeholder="Nome" onChange={e => setAlunoForm({...alunoForm, nome: e.target.value})} required /><br/><br/>
                <input placeholder="Email" type="email" onChange={e => setAlunoForm({...alunoForm, email: e.target.value})} required /><br/><br/>
                <input placeholder="Idade" type="number" onChange={e => setAlunoForm({...alunoForm, idade: e.target.value})} required /><br/><br/>
                <button type="submit">Salvar Aluno</button>
            </form>

            {/* Form Turma */}
            <form onSubmit={handleCriarTurma} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', minWidth: '300px' }}>
                <h3>Criar Turma (Gerador de Chat)</h3>
                <input placeholder="Nome da Turma" onChange={e => setTurmaForm({...turmaForm, nome: e.target.value})} required /><br/><br/>
                
                <label>Professor Responsável:</label><br/>
                <select onChange={e => setTurmaForm({...turmaForm, professorResponsavelId: e.target.value})} required>
                    <option value="">Selecione...</option>
                    {professores.map(p => <option key={p._id} value={p._id}>{p.nome} ({p.materia})</option>)}
                </select><br/><br/>

                <label>Selecione os Alunos (Segure Ctrl):</label><br/>
                <select multiple onChange={e => {
                    const ids = Array.from(e.target.selectedOptions, option => option.value);
                    setTurmaForm({...turmaForm, alunosIds: ids});
                }} style={{ width: '100%', height: '80px' }}>
                    {alunos.map(a => <option key={a._id} value={a._id}>{a.nome}</option>)}
                </select><br/><br/>

                <button type="submit" style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer' }}>
                    Criar Turma e Inicializar Chat
                </button>
                <button type="button" onClick={() => ({ nome: '', professorResponsavelId: '', alunosIds: [] })}>
                    Limpar Formulário
                </button>
            </form>

        </div>
        
    );

}
