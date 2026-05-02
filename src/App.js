import React, { useState } from 'react';
import { Camera, Send, Trophy, Ban } from 'lucide-react';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState('');
  const [missionProgress, setMissionProgress] = useState(0);
  const [isBanned, setIsBanned] = useState(false);

  // Lista simples de palavras proibidas (Moderação)
  const forbiddenWords = ['xingamento1', 'racismo1', 'odio'];

  const handlePost = () => {
    // 1. Verificar Moderação
    const hasForbiddenWord = forbiddenWords.some(word => 
      message.toLowerCase().includes(word)
    );

    if (hasForbiddenWord) {
      alert("CONTEÚDO OFENSIVO DETECTADO! Você foi suspenso por violar as regras.");
      setIsBanned(true);
      return;
    }

    // 2. Adicionar Postagem
    if (message.trim()) {
      const newPost = { id: Date.now(), text: message, type: 'text' };
      setPosts([newPost, ...posts]);
      setMessage('');
      
      // 3. Atualizar Missão (Ex: Poste 3 vezes para ganhar)
      if (missionProgress < 100) {
        setMissionProgress(prev => prev + 33.4);
      }
    }
  };

  if (isBanned) return (
    <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
      <Ban size={100} />
      <h1>Conta Suspensa</h1>
      <p>Você violou os termos de uso (Racismo/Xingamentos). Volte em 7 dias.</p>
    </div>
  );

  return (
    <div style={{ maxWidth: '500px', margin: 'auto', fontFamily: 'sans-serif' }}>
      {/* Cabeçalho de Missões */}
      <header style={{ background: '#eee', padding: '15px', borderRadius: '10px' }}>
        <h3><Trophy color="gold" /> Missão Diária</h3>
        <p>Poste 3 vezes para ganhar moedas!</p>
        <div style={{ width: '100%', bg: '#ddd', height: '10px', borderRadius: '5px' }}>
          <div style={{ width: `${missionProgress}%`, height: '100%', background: 'green', borderRadius: '5px' }} />
        </div>
      </header>

      {/* Feed */}
      <main style={{ minHeight: '400px', padding: '20px 0' }}>
        {posts.map(post => (
          <div key={post.id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
            <p>{post.text}</p>
          </div>
        ))}
      </main>

      {/* Input de Mensagem */}
      <footer style={{ position: 'sticky', bottom: 0, background: '#fff', display: 'flex', gap: '10px' }}>
        <input 
          value={message} 
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Diga algo legal..." 
          style={{ flex: 1, padding: '10px' }}
        />
        <button onClick={handlePost} style={{ padding: '10px' }}><Send /></button>
      </footer>
    </div>
  );
};

export default App;