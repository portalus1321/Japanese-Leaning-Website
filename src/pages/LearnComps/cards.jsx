import React, { useState, useEffect } from 'react';
import { Cog6ToothIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/solid';
import KanjiGame from './coreGM/CardGM/CGModule'; // Import KanjiGame module
import GameOptions from './coreGM/CardGM/options'; // Correct import for GameOptions
import RadarCards from '../../Charts/RadarCards';
import { supabase } from '../../utils/supabaseClient';
const Cards = ({ token }) =>  {
    // Initialize the KanjiGame with N5 level and Section1
    const [game, setGame] = useState(null);
    const [cg, setCg] = useState(0);
    const [wg, setWg] = useState(0);
    const [ful, setFg] = useState(0);
    // -----------------------
    const [resultwait,setresultwait] = useState(false);
    const [data,setUserData] = useState([]);
    const [paused, setPaused] = useState(false);

    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [gameOptions, setGameOptions] = useState(null);
    const [showOptions, setShowOptions] = useState(true); // Options visible by default
    const [resultMessage, setResultMessage] = useState("");
    const correctPercentage = Math.round((cg / ful) * 100);
    const wrongPercentage = Math.round((wg / ful) * 100);

    // Determine the styles based on the condition
    const correctStyle = cg === (ful - wg) ? { flexGrow: 1 } : { flexBasis: `${correctPercentage}%` };
    const wrongStyle = { flexBasis: `${wrongPercentage}%` };


    async function getData() {
       console.log("clicked gettopplayers");
       if (!token || !token.user) {
        console.log('Waiting for token...');
        return; // Return early if token is not available
       }
       try {
         const { data, error } = await supabase
           .from("UData")
           .select('id,data_type,data_best,data_current,value')
           .eq('id',token.user.id) 

     
         if (error) {
           throw error;
         }
     
        
    
         console.log("Fetched top players data:", data);
         setUserData(data); // Update state

       } catch (error) {
         console.error("Error fetching top players:", error);
         alert("Failed to load top players. Please try again later.");
       }
    }
     

    function safeParse(data) {
        if (typeof data === 'string') {
          return JSON.parse(data);
        }
        return data; // already an object
      }
    function createNewResult(gameOptions,corect ,total) {
        return {
          Level: gameOptions.level,   // Example: "N3"
          Group: gameOptions.section, // Example: "S1"
          Score:  Math.round(100*(corect/total))          // Example: 100
        };
      }

    async function updateGameResult(newResult) {
        console.log("clicked updateGameResult");
      
        if (!token || !token.user) {
          console.log('Waiting for token...');
          return;
        }
      
        try {
          const { data, error } = await supabase
            .from("UData")
            .select('id, data_current, data_best, value')
            .eq('id', token.user.id).eq('data_type',1)
            .single();
      
          if (error && error.code !== 'PGRST116') {
            throw error;
          }
      
          let currentData = {};
          let bestData = {};
      
          if (data) {
            if (data.data_current) currentData = safeParse(data.data_current);
            if (data.data_best) bestData = safeParse(data.data_best);
          }
      
          if (!currentData.HighScores) {
            currentData.HighScores = [];
          }
          if (!bestData.HighScores) {
            bestData.HighScores = [];
          }
      
          // --- Update data_current (always) ---
          const currentIndex = currentData.HighScores.findIndex(
            (item) => item.Level === newResult.Level && item.Group === newResult.Group
          );
      
          if (currentIndex !== -1) {
            currentData.HighScores[currentIndex].Score = newResult.Score;
          } else {
            currentData.HighScores.push(newResult);
          }
      
          // --- Update data_best (only if better) ---
          const bestIndex = bestData.HighScores.findIndex(
            (item) => item.Level === newResult.Level && item.Group === newResult.Group
          );
      
          if (bestIndex !== -1) {
            if (newResult.Score > bestData.HighScores[bestIndex].Score) {
              bestData.HighScores[bestIndex].Score = newResult.Score;
            } else {
              console.log("New score is not better than best score, not updating.");
            }
          } else {
            bestData.HighScores.push(newResult);
          }
      
          // --- Now update the database ---
          const { error: updateError } = await supabase
            .from("UData")
            .update({
              data_current: currentData,
              data_best: bestData,
            })
            .eq('id', token.user.id).eq('data_type',1);
          
          if (updateError) {
            throw updateError;
          }
          setresultwait(false);
          setPaused(false);
          console.log("Successfully updated current and best game results!");
          
        } catch (error) {
          console.error("Error updating game results:", error);
          alert("Failed to update your game results. Please try again later.");
        }
      }
      


















     useEffect(() => {
        if (game) {
          const question = game.getNextQuestion();
          if (question === "Finished") {
            setResultMessage("Finished");
            setCurrentQuestion(null);
          } else {
            setCurrentQuestion(question);
            setResultMessage("");
          }
      
          const interval = setInterval(() => {
            if (game && !paused) { // now paused is a real useState
              const currentCg = game.getCorrectGuesses();
              const currentWg = game.getWrongGuesses();
              const currentFg = game.getFullGuesses();
              
              setCg(currentCg);
              setWg(currentWg);
              setFg(currentFg);
      
              console.log("Cg:", currentCg, " ; WG:", currentWg, " ; FG: ", currentFg);
                
              if (resultwait) {

                const newResult = createNewResult(gameOptions,currentCg,currentFg);
                updateGameResult(newResult);
                setPaused(true);
              }
            }
          }, 100);
      
          return () => clearInterval(interval);
        }
      }, [game, paused,resultwait]);
      

    const handleOptionsSelected = (options) => {
        setGameOptions(options);
        setShowOptions(false); // Hide options after selection
        setGame(new KanjiGame(options.level, options.section)); // Initialize game with selected options
    };

    const toggleOptions = () => {
        setShowOptions(!showOptions);
    };

    const handleAnswerClick = (selectedAnswer) => {
        if (currentQuestion) {
            const correctAnswer = currentQuestion.correctKanji;

            const result = game.next(selectedAnswer, correctAnswer);
            setResultMessage(result.correct ? "Correct!" : "Incorrect!");

            // Fetch the next question
            const nextQuestion = game.getNextQuestion();
            if (nextQuestion === "Finished") {
                setResultMessage("Finished");
                setresultwait(true)
                console.log(resultwait,"saveresult value");
                setCurrentQuestion(null);
            } else {
                setCurrentQuestion(nextQuestion);
            }
        }
    };

    // Reset the game when gameOptions change
    useEffect(() => {
        if (gameOptions) {
            const newGame = new KanjiGame(gameOptions.level, gameOptions.section);
            setGame(newGame);
            const question = newGame.getNextQuestion();
            if (question === "Finished") {
                
                setResultMessage("Finished");
                setCurrentQuestion(null);
            } else {
                setCurrentQuestion(question);
                setResultMessage("");
            }
        }
    }, [gameOptions]);

    return (
        <div className="flex justify-center items-center h-[90vh] w-full bg-gray-100 font-sans">
            <div className="flex flex-col justify-center gap-[50px] items-center h-full w-full sm:flex-row">
                {/* Kanji Square */}
                <div className="flex relative justify-center items-center rounded-[30px] bg-white bg-gray-400 shadow-lg text-4xl w-[300px] h-[300px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]">
                    {currentQuestion && currentQuestion.correctKanji && gameOptions ? (
                        gameOptions.mode === 'kanjiToWord'
                            ? currentQuestion.correctKanji.kanji
                            : currentQuestion.correctKanji.meaning
                    ) : (
                        <RadarCards userData={[50, 6, 20]}
                            averageData={[40, 15, 100]}
                            categories={['Result', 'accuracy', 'Time']}
                            scale={100}
                        />
                    )}
                    <div className='absolute w-full h-full opacity-50 flex'>

                    </div>
                    <div className="progres flex absolute border-gray-300 m-0 top-[-20px] shadow-lg border-2 rounded bg-purple-700 sm:w-[300px] md:w-[400px] lg:w-[440px] h-[10px] ">
                        <div className="cor bg-green-400 h-full" style={correctStyle}></div>
                        <div className="wro bg-red-400 h-full" style={wrongStyle}></div>
                    </div>
                    <div className="rounded-[30px] z-10 overflow-hidden absolute left-0 ">
                        {/* <Myresult/> */}
                    </div>
                    <div className="absolute left-[-10px] top-0 translate-x-[-100%] bg-gray-400 rounded-lg">
                        <Cog6ToothIcon
                            className="h-[50px] w-[50px] flex-none fill-purple-700 text-purple-700 cursor-pointer hover:rotate-90 hover:fill-purple-500 transition"
                            aria-hidden="true"
                            onClick={toggleOptions}
                        />
                    </div>
                    <div className="absolute left-[-10px] top-[10px] translate-x-[-100%] translate-y-[100%] bg-gray-400 rounded-lg">
                        <QuestionMarkCircleIcon
                            className="h-[50px] w-[50px] flex-none fill-purple-700 text-purple-700 cursor-pointer hover:fill-purple-500 transition"
                            aria-hidden="true"
                        />
                    </div>
                    {showOptions && (
                        <div className="absolute w-full h-full rounded-[30px] bg-gray-200">
                            <GameOptions onOptionsSelected={handleOptionsSelected} token={token} />
                        </div>
                    )}
                    {gameOptions && !currentQuestion && (
                        <div>
                            {/* Render your flashcards and scoreboard here */}
                        </div>
                    )}
                </div>

                {/* Answers Grid */}
                {currentQuestion && (
                    <div className="grid rounded-[30px] overflow-hidden sm:ml-0 w-[300px] h-[300px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] grid-cols-3 gap-2">
                        {currentQuestion.options.map((option, index) => (
                            <div
                                key={index}
                                className="w-full h-full flex justify-center items-center text-6xl hover:text-purple-700 bg-gray-400 shadow-lg text-xl cursor-pointer hover:bg-gray-200"
                                onClick={() => handleAnswerClick(option)}
                            >
                                {gameOptions.mode === 'kanjiToWord' ? option.meaning : option.kanji}
                            </div>
                        ))}
                    </div>
                )}
                {resultMessage && (
                    <div className="absolute bottom-0 text-lg font-bold">
                        {resultMessage}
                    </div>
                )}
            </div>
        </div>
    );
}
export default Cards