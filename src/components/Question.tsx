import { ReactNode } from 'react'
import cx from 'classnames'
import '../styles/question.scss'

type questionProps = {
  content: string,
  isAnswered?: boolean,
  isHighlighted?: boolean,
  author: {
    avatar: string,
    name: string
  },
  children?: ReactNode
}

export function Question({ 
  content,
  isAnswered = false,
  isHighlighted = false,
  author, 
  children }: questionProps) {
  return (
    <div className={cx(
      'question', 
      { answered: isAnswered },
      { highlighted: isHighlighted && !isAnswered },
    )}>
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>
          {children}
        </div>
      </footer>
    </div>
  )
}