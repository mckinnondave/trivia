import React, { useState } from "react";
import "./GameBoard.scss";
import Scoreboard from "./Scoreboard";
import sortQuestion from "../../helpers/Sorting";
import "animate.css";
import { useCountdownTimer } from 'use-countdown-timer';

export default function GameBoard({ questions }) {
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answers, setAnswers] = useState([]);
  const [correctAnswerSelected, setCorrectAnswerSelected] = useState(false);
  const [falseAnswerSelected, setFalseAnswerSelected] = useState(false);
  const [hideButton, setHideButton] = useState(false);
  const [count, setCount] = useState(1);
  const [questionScore, setQuestionScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false)

  // Countdown timer variables
  const { countdown, start, reset, pause, isRunning } = useCountdownTimer({
    timer: 1000 * 20
  })

  // Array of 10 questions
  let myQuestions = questions;

  // Prepares gameboard for first question - hides begin button, selects first question, and starts the timer
  const handleClick = (e) => {
    e.preventDefault();
    setHideButton(true);
    setCurrentQuestion(myQuestions[0].question);
    setAnswers(sortQuestion(myQuestions[0]));
    start()
  };

  const handleAnswer = (value) => {
    pause();
    // Handle correct answer
    if (value === myQuestions[0].correctAnswer) {
      console.log("RIGHT!");
      setCorrectAnswerSelected(true);
      setCurrentQuestion(
        `CORRECT! The answer is "${myQuestions[0].correctAnswer}!"`
      );
      setQuestionScore(prev => prev + (countdown/100 + 100))
    }

    // Handle incorrect answer
    if (value !== myQuestions[0].correctAnswer) {
      console.log("WRONG");
      setFalseAnswerSelected(true);
      setCurrentQuestion(
        `Incorrect. The answer is "${myQuestions[0].correctAnswer}"`
      );
    }

    // Remove question from array once answered
    myQuestions.shift();

    // Display next question if there are still more questions to go through while resetting timer
    setTimeout(() => {
      if (myQuestions.length !== 0) {
        reset()
        setCount(prev => prev + 1)
        setCurrentQuestion(myQuestions[0].question);
        setAnswers(sortQuestion(myQuestions[0]));
        setCorrectAnswerSelected(false);
        setFalseAnswerSelected(false);
        start()
      } else {
        console.log("Out of Questions!!");
        
      }
    }, 3500);
  };

  const setCorrectColor = correctAnswerSelected
    ? "right-answer animate__animated animate__shakeY"
    : "";
  const setFalseColor = falseAnswerSelected
    ? "wrong-answer animate__animated animate__shakeX"
    : "";

  return (
    <>
      <Scoreboard countdown={countdown} count={count} questionScore={questionScore}/>
      <div className={`board ${setCorrectColor} ${setFalseColor} `}>
        <div className="board-container ">
          {!hideButton ? (
            <div className="board-start animate__animated animate__fadeIn animate__delay-1s">
              <button onClick={handleClick}>Begin!</button>
            </div>
          ) : (
            <>
              <div className="board-question ">{currentQuestion}</div>
              <div className="board-btns">
                <button onClick={() => handleAnswer(answers[0])}>
                  {answers[0]}
                </button>
                <button onClick={() => handleAnswer(answers[1])}>
                  {answers[1]}
                </button>
                <button onClick={() => handleAnswer(answers[2])}>
                  {answers[2]}
                </button>
                <button onClick={() => handleAnswer(answers[3])}>
                  {answers[3]}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
