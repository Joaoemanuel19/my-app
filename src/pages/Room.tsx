import { useParams } from 'react-router-dom'
import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import '../styles/room.scss'
import { FormEvent, useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { get, onValue, push, ref } from 'firebase/database'
import { database } from '../services/firebase'

type RoomParams = {
  id: string;
}

type firebaseQuestions = Record<string, {
  author: {
    name: string,
    avatar: string
  },
  content: string,
  isHighlighted: boolean,
  isAnswered: boolean
}>

type Questions = {
  id: string,
  author: {
    name: string,
    avatar: string
  },
  content: string,
  isHighlighted: boolean,
  isAnswered: boolean
}

export function Room() {
  const { user } = useAuth();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const [questions, setQuestions] = useState<Questions[]>([])
  const [title, setTitle] = useState('')

  useEffect(() => {
    const roomRef = ref(database, `rooms/${roomId}`);

    onValue(roomRef, room => {
      const databaseRoom = room.val()
      const firebaseQuestions: firebaseQuestions = databaseRoom.questions ?? {};

      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isAnswered: value.isAnswered,
          isHighlighted: value.isHighlighted
        }
      })

      setTitle(databaseRoom.title)
      setQuestions(parsedQuestions);
    })
  }, [roomId])

  const [newQuestion, setNewQuestion] = useState('');

  async function handleSendNewQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === '') {
      return;
    }

    if (!user) {
      throw new Error('you must be logged in');
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar
      },
      isHighlighted: false,
      isAnswered: false
    };

    const questionRef = await ref(database, `rooms/${roomId}/questions`);
    push(questionRef, question)

    setNewQuestion('')
  }

  if (!roomId) {
    return <div>Sala não encontrada</div>;
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="letmeask" />
          <RoomCode code={roomId} />
        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
        </div>

        <form onSubmit={handleSendNewQuestion}>
          <textarea 
            placeholder="o que voce quer perguntar?"
            onChange={event => setNewQuestion(event.target.value)}
            value={newQuestion}
          />
          
          <div className="form-footer">
            { user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>para enviar sua pergunta <button>faça seu login</button>.</span>
            )}
            <Button onClick={handleSendNewQuestion} disabled={!user}>Clique aqui</Button>
          </div>
        </form>

        {JSON.stringify(questions)}
      </main>
    </div>
  )
}