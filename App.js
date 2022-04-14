import logo from './logo.svg';
import './App.css';
import Die from "./Die.js"
import React from 'react';
import {nanoid} from "nanoid";
import Confetti from "react-confetti";

function App() {
    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)

    const [diceCount, setDiceCount] = React.useState(-1)

    const [seconds, setSeconds] = React.useState(parseFloat(0))
    const [isActive, setIsActive] = React.useState(false)

    const [bestTime, setBestTime] = React.useState(localStorage.getItem("besttime") || [])


    
    console.log(bestTime)
    function toggle() {
        setIsActive(!isActive);
      }

    function changeDiceCount(){
        setDiceCount(prevCount => prevCount+1)
    }

    React.useEffect(()=>{

        const doStuff = ()=>{setDiceCount(0)}

        if (!tenzies){

        doStuff()}
    },[tenzies])
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
        }
    }, [dice])

    React.useEffect(()=>{
        let interval = null;

        if (isActive){

        if (!tenzies){


            interval = setInterval(() => {
                setSeconds(second => second + 1);
              }, 1000);}
              else if (tenzies && seconds !== 0) {
                clearInterval(interval)}  }    
        
              return () => clearInterval(interval);

    },[tenzies,isActive])
    
    React.useEffect(()=>{
        if (!tenzies){
            setSeconds(0)
        }
    },[tenzies])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies) {
            setIsActive(true)
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setIsActive(false)
            setBestTime(prevBestTime => {
                if (prevBestTime === 0){
                    return seconds
                }else if (prevBestTime < seconds){
                    return prevBestTime
                }else{
                    return seconds
                }
            })
            localStorage.setItem("besttime",bestTime)
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={()=>{rollDice();changeDiceCount()}}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
            <div className="metrics">
            <h2 className='dice-count'>Count : {diceCount}</h2>
            <h2 className='dice-count'>Seconds : {seconds}</h2>
            <h2 className='dice-count'>Best Time : {bestTime}</h2>
            </div>
        </main>
    )
}

export default App;
