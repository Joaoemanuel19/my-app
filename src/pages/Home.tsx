import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from "../assets/images/google-icon.svg";
import '../styles/auth.scss'
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FormEvent, useState } from 'react';
import { NewRoom } from './NewRoom';
import { get, ref } from 'firebase/database';
import { database } from '../services/firebase';

export function Home() {
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth()
  const [roomCode, setRoomCode] = useState('') 

  async function handleCreateNewRoom() {
    if (!user) {
      await signInWithGoogle()
    }

    navigate('/rooms/new');
  }

  async function handleRoomCode(event: FormEvent) {
    event.preventDefault()

    if (roomCode.trim() === '') {
      return;
    }

    const roomsRef = await ref(database, `rooms/${roomCode}`);
    const getRoomsRef = await get(roomsRef);
    
    if (!getRoomsRef.exists()) {
      alert('Room does not exist')
      return;
    }

    navigate(`/rooms/${roomCode}`)
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="ilustracao simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao vivo</strong>
        <p>tire duvidas das suas audiencias em tempo real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="letmeask" />
          <button onClick={handleCreateNewRoom} className="create-room">
            <img src={googleIconImg} alt="logo do google" />
            Faça login com o google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleRoomCode}>
            <input 
              type="text" 
              placeholder="Digite o codigo da Sala"
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}