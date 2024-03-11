import { useParams } from 'react-router-dom'
import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import { RoomCode } from '../components/RoomCode'
import '../styles/room.scss'
// import { useAuth } from '../hooks/useAuth'
import { Question } from '../components/Question'
import { useRoom } from '../hooks/useRoom'
import { ref, remove, update } from 'firebase/database'
import { database } from '../services/firebase'
import { Modal } from '../components/Modal'
import { useState } from "react";
import ReactModal from "react-modal"
import confirmDeleteImg from '../assets/images/delete-red.svg'
import '../styles/modal.scss'

type RoomParams = {
  id: string;
}

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  content: {
    width: '590px',
    border: 'none',
    borderRadius: '8px',
    height: '362px',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

export function AdminRoom() {
  // const { user } = useAuth();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { title, questions } = useRoom(roomId)

  if (!roomId) {
    return <div>Sala não encontrada</div>;
  }

  function openModal(questionId: string) {
    setCurrentQuestionId(questionId);
    setIsOpen(true);
  }

  function closeModal() {
    setCurrentQuestionId(null);
    setIsOpen(false);
  }

  async function handleDeleteQuestion() {
    if (currentQuestionId == null) return;
    
    const questionRef = ref(database, `rooms/${roomId}/questions/${currentQuestionId}`);
    await remove(questionRef);
    closeModal();
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    const questionRef = ref(database, `rooms/${roomId}/questions/${questionId}`);
    update(questionRef, {
      isAnswered: true,
    })
  }

  async function handleHighlightQuestion(questionId: string) {
    const questionRef = ref(database, `rooms/${roomId}/questions/${questionId}`);
    update(questionRef, {
      isHighlighted: true,
    })
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Modal/>
          </div>
        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
        </div>

        <div className="question-list">
          {questions.map(question => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >      
                <div>  
                {!question.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img src={checkImg} alt="Marcar pergunta como respondida" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHighlightQuestion(question.id)}
                    >
                      <img src={answerImg} alt="Dar destaque à pergunta" />
                    </button>
                  </>
                )}
                  <button
                    type="button"
                    onClick={() => openModal(question.id)}
                  >
                    <img src={deleteImg} alt="remover pergunta" />
                  </button>
                  <div>
                  <ReactModal
                    isOpen={modalIsOpen}
                    contentLabel="Example Modal"
                    onRequestClose={closeModal}
                    style={customStyles}
                  >
                    <div className="content-modal">
                      <img src={confirmDeleteImg} />
                      <div className="first-content">
                        <span>Excluir pergunta</span>
                        <p>Tem certeza que você deseja excluir esta pergunta?</p>
                      </div>
                      <div className="second-content">
                        <button className="button1" onClick={closeModal}>Cancelar</button>
                        <button className="button2" onClick={handleDeleteQuestion}>Sim, excluir</button>
                      </div>
                    </div>
                  </ReactModal>
                  </div>
                </div>
              </Question>
            )
          })}
        </div>
      </main>
    </div>
  )
}