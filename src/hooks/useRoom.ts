import { off, onValue, ref } from "firebase/database"
import { useState, useEffect } from "react"
import { database } from "../services/firebase"
import { useAuth } from "./useAuth"

type QuestionType = {
  id: string,
  author: {
    name: string,
    avatar: string
  },
  content: string,
  isHighlighted: boolean,
  isAnswered: boolean, 
  likeCount: number,
  likeId: string | undefined
}

type firebaseQuestions = Record<string, {
  author: {
    name: string,
    avatar: string
  },
  content: string,
  isHighlighted: boolean,
  isAnswered: boolean,
  likes: Record<string, {
    authorId: string
  }>
}>

export function useRoom(roomId: string | undefined) {
  const { user } = useAuth()
  const [questions, setQuestions] = useState<QuestionType[]>([])
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
          isHighlighted: value.isHighlighted,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
        }
      })

      setTitle(databaseRoom.title)
      setQuestions(parsedQuestions);
    })

    return () => {
      off(roomRef)
    }
  }, [roomId, user?.id]);

  return { questions, title, roomId}
}