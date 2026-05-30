
import React, { useEffect, useState } from 'react';

export default function CadastrarUsuario() {
	const [nome, setNome] = useState('');
	const [email, setEmail] = useState('');
	const [senha, setSenha] = useState('');
	const [idade, setIdade] = useState(0);
	const [turma, setTurma] = useState('');
	const [confirmSenha, setConfirmSenha] = useState('');
	const [erro, setErro] = useState(null);
	const [sucesso, setSucesso] = useState(null);
	const [loading, setLoading] = useState(false);

    const URL_BASE = process.env.URL_BASE || 'http://localhost:3000';

    useEffect(() => {
        fetch(`${URL_BASE}/alunos/6a0a022fca00471bc43fe28f`).then(res => res.json()).then(data => {
            console.log('Dados do aluno:', data);
            setNome(data.nome);
            setEmail(data.email);
            setIdade(data.idade);
            setTurma(data.turma);
        }).catch(err => {
            console.error('Erro ao buscar aluno:', err);
        });
    }, []);

	const validar = () => {
		if (!nome || !email || !senha || !confirmSenha) return 'Preencha todos os campos.';
		// simples validação de email
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email inválido.';
		if (senha.length < 6) return 'A senha deve ter pelo menos 6 caracteres.';
		if (senha !== confirmSenha) return 'As senhas não coincidem.';
		return null;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErro(null);
		setSucesso(null);
		const v = validar();
		if (v) {
			setErro(v);
			return;
		}
		setLoading(true);
		try {
			// Ajuste a rota conforme seu backend
			const res = await fetch(`${URL_BASE}/api/usuarios`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ nome, email, senha, idade, turma }),
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.message || 'Erro ao cadastrar usuário');
			}
			setSucesso('Usuário cadastrado com sucesso.');
			setNome('');
			setEmail('');
			setSenha('');
			setConfirmSenha('');
		} catch (err) {
			setErro(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={{ maxWidth: 480, margin: '2rem auto', padding: 20, border: '1px solid #eee', borderRadius: 8 }}>
			<strong>Meu nome é {nome}</strong>
            <h2 style={{ marginTop: 0 }}>Cadastrar Usuário</h2>
			<form onSubmit={handleSubmit}>
				<div style={{ marginBottom: 12 }}>
					<label>Nome</label>
					<input value={nome} onChange={e => setNome(e.target.value)} style={{ width: '100%', padding: 8 }} />
				</div>
				<div style={{ marginBottom: 12 }}>
					<label>Email</label>
					<input value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: 8 }} />
				</div>
                <div style={{ marginBottom: 12 }}>
                    <label>Idade</label>
                    <input type="number" value={idade} onChange={e => setIdade(e.target.value)} style={{ width: '100%', padding: 8 }} />
                </div>
                <div style={{ marginBottom: 12 }}>
                    <label>Turma</label>
                    <select value={turma} onChange={e => setTurma(e.target.value)} style={{ width: '100%', padding: 8 }}>
                        <option value="">Selecione a turma</option>
                        <option value="sem-turma">Sem turma!</option>
                        <option value="1A">1A</option>
                        <option value="1B">1B</option>
                        <option value="2A">2A</option>
                        <option value="2B">2B</option>
                    </select>
                </div>
				<div style={{ marginBottom: 12 }}>
					<label>Senha</label>
					<input type="password" value={senha} onChange={e => setSenha(e.target.value)} style={{ width: '100%', padding: 8 }} />
				</div>
				<div style={{ marginBottom: 12 }}>
					<label>Confirmar Senha</label>
					<input type="password" value={confirmSenha} onChange={e => setConfirmSenha(e.target.value)} style={{ width: '100%', padding: 8 }} />
				</div>
				{erro && <div style={{ color: 'red', marginBottom: 12 }}>{erro}</div>}
				{sucesso && <div style={{ color: 'green', marginBottom: 12 }}>{sucesso}</div>}
				<button type="submit" disabled={loading} style={{ padding: '8px 16px' }}>
					{loading ? 'Cadastrando...' : 'Cadastrar'}
				</button>
			</form>
		</div>
	);
}
