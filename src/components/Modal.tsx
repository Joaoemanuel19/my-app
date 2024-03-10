import { useState } from "react";
import ReactModal from "react-modal"
import confirmDeleteImg from '../assets/images/confirm.svg'
import { Button } from "./Button";
import '../styles/modal.scss'
import { ref, update } from "firebase/database";
import { database } from "../services/firebase";
import { useNavigate, useParams } from "react-router-dom";

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

type RoomParams = {
  id: string;
}

export function Modal() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const navigate = useNavigate()

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  async function handleEndroom() {
    const endRef = await ref(database, `rooms/${roomId}`)
    update(endRef, {
      endedAt: new Date()
    })

    navigate('/')
  }

  return (
    <div>
      <Button isOutlined onClick={openModal}>Encerrar Sala</Button>
      <div className="modal">

      <ReactModal
        isOpen={modalIsOpen}
        contentLabel="Example Modal"
        style={customStyles}
      >
        <div className="content-modal">
          <img src={confirmDeleteImg} />
          <div className="first-content">
            <span>Encerrar sala</span>
            <p>Tem certeza que você deseja encerrar esta sala?</p>
          </div>
          <div className="second-content">
            <button className="button1" onClick={closeModal}>Cancelar</button>
            <button className="button2" onClick={handleEndroom}>Sim, encerrar</button>
          </div>
        </div>
      </ReactModal>
      </div>
    </div>
  )
}