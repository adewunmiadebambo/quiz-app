import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import { questions as dataset } from '../data/dataset'

const QuizPage = () => {
    const navigate = useNavigate()
    const [started, setStarted] = useState(false)
    const [quizData, setQuizData] = useState(dataset)
    const [userAnswer, setUserAnswer] = useState('')
    const [currentQuestion, setCurrentQuestion] = useState(null)
    const [progress, setProgress] = useState(0)
    const [timeElapsed, setTimeElapsed] = useState(false)
    const [userScore, setUserScore] = useState(0)
    const [username, setUsername] = useState('')
    const [endOfQuizReached, setEndOfQuizReached] = useState(false)
    const [questionAnswered, setQuestionAnswered] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [timerID, setTimerID] = useState(null)
    const [time, setTime] = useState({})
    const [timeLeft, setTimeLeft] = useState(20 * quizData.length)

    const tick = (time) => {
        let minutes = Math.floor(time / 60)
        let seconds = time % 60
        setTime(prev => ({
            minutes: minutes.toString().padStart('0'), 
            seconds: seconds.toString().padStart('0')
        }))
    }

    const startTimer = () => {
        let remainingTime = timeLeft
        let timer = setInterval(() => {
            tick(remainingTime--)
            setTimerID(timer)
    
            if (remainingTime < 0) {
                clearInterval(timer)
                setTimeElapsed(true)
                setEndOfQuizReached(true)
                submitQuiz()
            }
        }, 1000)
    }

    const reset = () => {
        setStarted(false)
        setUserScore(0)
        setProgress(0)
        setUserAnswer('')
        setEndOfQuizReached(false)
        setQuestionAnswered(false)
        setSubmitted(false)
        setCurrentQuestion(null)
    }

    const handleSubmit = (evt) => {
        evt.preventDefault()
        setStarted(true)
        startTimer()
        setCurrentQuestion(quizData[progress])
    }

    const calculateScore = () => {
        if (userAnswer === currentQuestion.answer) {
            let score = userScore + 1;
            setUserScore(score)
        }
        return
    }

    const next = () => {
        if (progress < quizData.length) {
            console.log(progress);
            calculateScore()
            setQuestionAnswered(false)
            setCurrentQuestion(quizData[progress])
        } else {
            setProgress(quizData.length)
            setEndOfQuizReached(true)
        }
    }

    
    const prev = () => {
        let currentProgress = progress - 1
        if (currentProgress >= 0) {
            setProgress(currentProgress)
            setQuestionAnswered(false)
            setCurrentQuestion(quizData[currentProgress])
            userScore > 0 && setUserScore(userScore - 1)
            setUserAnswer('')
        }
    }

    const goBack = () => prev()

    const submitQuiz = () => {
        setSubmitted(true)
        setUserScore(score => score)
    }
    
    return (
        <div className="quiz">
            { !started && 
                <div className="info">
                    <h1>Hello There!</h1>
                    <p>
                        You are about to start a quiz to test your knowledge. This quiz contains { quizData.length } questions. Every question answered correctly will add 10 points to your score. If you don't answer correctly, you get no points. This quiz is also timed, and has an average of 20 seconds per question. <b>Good Luck {username}!</b>
                    </p>

                    <form onSubmit={handleSubmit}>
                        <input type="text" placeholder="Enter Your name..." onChange={(evt) => setUsername(evt.target.value)} />
                        <button>Start Quiz!</button>
                    </form>
                </div>
            }

            {
                started && !endOfQuizReached &&
                <main>
                    <h1>{ currentQuestion.question }</h1>
                    <ul>
                        {
                            Object.values(currentQuestion?.options).map((option, index) => {
                                return <li 
                                            className={option === userAnswer ? 'selected' : ''} 
                                            onClick={() => {
                                                setUserAnswer(option)
                                                setQuestionAnswered(true)
                                                setProgress(progress + 1)
                                            }}
                                            key={index}
                                        >
                                            { option }
                                        </li>
                            })
                        }
                    </ul>
                    <footer>
                        <button 
                            onClick={prev}
                            // disabled={progress <= 0}
                        >
                            &larr; Prev
                        </button>
                        <div className="timer-box">
                            <p>{time?.minutes}:{time.seconds}</p>
                        </div>
                        <button 
                            onClick={next}
                            disabled={!questionAnswered}
                        >
                            Next &rarr;
                        </button>
                    </footer>
                </main>
            }

            {
                endOfQuizReached && 
                <div className="end-of-quiz">
                    <h1>Hooray!!!</h1>
                    <p>You have reached the end of this quiz. Would you like to submit?</p>
                    <div className="cta">
                        <button onClick={goBack}>Go Back</button>
                        <button onClick={submitQuiz}>Submit</button>
                    </div>
                </div>
            }

            {
                submitted &&
                <div className="score-card">
                    <h1>Great Job!</h1>
                    <p>You scored <b>{ userScore }</b> out of {quizData.length} questions</p>
                    <span>Think you can do better?</span>
                    <div className="cta">
                        <button onClick={reset}>Retake Quiz</button>
                        <button onClick={() => navigate('/')}>
                            Go Home
                        </button>
                    </div>
                </div>
            }
        </div>
    )
}

export default QuizPage