import { useState, useEffect, useRef } from "react";
import { supabase } from "../../utils/supabaseClient";

// Romaji to Hiragana conversion map
const romajiToHiragana = {
    "a": "あ", "i": "い", "u": "う", "e": "え", "o": "お",
    "ka": "か", "ki": "き", "ku": "く", "ke": "け", "ko": "こ",
    "sa": "さ", "shi": "し", "su": "す", "se": "せ", "so": "そ",
    "za": "ざ",
    "ji": "じ",
    "zu": "ず",
    "ze": "ぜ",
    "zo": "ぞ",
    "zi": "ぢ",
    "zu": "づ",
    "ta": "た", "chi": "ち", "tsu": "つ", "te": "て", "to": "と",
    "んa": "な", "んi": "に", "んu": "ぬ", "んe": "ね", "んo": "の",
    "ha": "は", "hi": "ひ", "fu": "ふ", "he": "へ", "ho": "ほ",
    "ba": "ば",
    "bi": "び",
    "bu": "ぶ",
    "be": "べ",
    "bo": "ぼ",
    "pa": "ぱ",
    "pi": "ぴ",
    "pu": "ぷ",
    "pe": "ぺ",
    "po": "ぽ",
    "ma": "ま", "mi": "み", "mu": "む", "me": "め", "mo": "も",
    "ya": "や", "yu": "ゆ", "yo": "よ",
    "ra": "ら", "ri": "り", "ru": "る", "re": "れ", "ro": "ろ",
    "wa": "わ", "wo": "を", "n": "ん", " ":" "
};

const Wpm = ({ token }) =>  {
    const [text, setText] = useState("たぬき ひつじ そら なるま");
    const [input, setInput] = useState("");
    const [convertedInput, setConvertedInput] = useState(""); // Stores Hiragana
    const [startTime, setStartTime] = useState(null);
    const [wpm, setWpm] = useState(0);
    const inputRef = useRef(null);
    const tabPressed = useRef(false);
    const [data,setUserData] = useState([]);

    
    useEffect(() => {
        if (convertedInput.length === 1 && startTime === null) {
            setStartTime(Date.now());
        }

        if (convertedInput === text) {
            const elapsedTime = (Date.now() - startTime) / 60000;
            const wordsTyped = text.split(" ").length;
            setWpm(Math.round(wordsTyped / elapsedTime));
            updateGameResult({ score: Math.round(wordsTyped / elapsedTime), date: new Date().toISOString() })
        }
    }, [convertedInput, text, startTime]);

    // Handles Romaji-to-Hiragana conversion
    const handleInputChange = (e) => {
        let value = e.target.value.toLowerCase();
        let hiragana = "";
        let buffer = "";

        for (let char of value) {
            buffer += char;
            console.log("buffer ",buffer);
            
            if (romajiToHiragana[buffer]) {
                if(romajiToHiragana[buffer] == "ん" ){
                    buffer = "ん";
                }else{
                hiragana += romajiToHiragana[buffer];
                buffer = "";
                }

            } else if (buffer.length > 2) {
                hiragana += buffer[0];
                buffer = buffer.slice(1);
            }
        }

        setInput(value);
        setConvertedInput(hiragana);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Tab") {
                e.preventDefault();
                tabPressed.current = true;
            } else if (e.key === "Enter" && tabPressed.current) {
                e.preventDefault();
                setInput("");
                setConvertedInput("");
                setStartTime(null);
                setWpm(0);
                tabPressed.current = false;
            } else {
                tabPressed.current = false;
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
    function safeParse(data) {
        if (typeof data === 'string') {
          return JSON.parse(data);
        }
        return data; // already an object
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
            .eq('id', token.user.id).eq('data_type',2)
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
      
          // --- Update data_current (always) ---
      
        
            currentData.HighScores.score = newResult.score;
            
          // --- Update data_best (only if better) ---

         
            if (newResult.score > bestData.HighScores.score) {
              bestData.HighScores.score = newResult.score;
            } else {
              console.log(newResult.score,bestData);
              
              console.log("New score is not better than best score, not updating.");
            }
        
      
          // --- Now update the database ---
          const { error: updateError } = await supabase
            .from("UData")
            .update({
              value: bestData.HighScores.score, 
              data_current: currentData,
              data_best: bestData,
            })
            .eq('id', token.user.id).eq('data_type',2);
          
          if (updateError) {
            throw updateError;
          }

          console.log("Successfully updated current and best game results!");
          console.log(newResult);
          
        } catch (error) {
          console.error("Error updating game results:", error);
          alert("Failed to update your game results. Please try again later.");
        }
    }
    return (
        <div className="wpm-container p-4" onClick={() => inputRef.current.focus()}>
            <h2 className="text-xl font-bold">Japanese Typing Game</h2>

            {/* Typing Area with Background and Overlay Effect */}
            <div className="relative text-lg font-mono border p-4 w-full bg-black cursor-text">
                {/* Background text (gray) */}
                <div className="absolute left-0 top-0 inset-0 text-white">
                <span className="text-gray-600">{text}</span>
                </div>
               

                {/* Foreground text (typed characters overlaying the background) */}
                <div className="absolute left-0 top-0 inset-0 text-white">
                    {text.split("").map((char, index) => {
                        let className = "text-transparent"; // Default transparent
                        if (index < convertedInput.length) {
                            className = convertedInput[index] === text[index] ? "text-white" : "text-red-500"; // Correct = white, Incorrect = red
                        }
                        return (
                            <span key={index} className={className}>
                                {char}
                            </span>
                        );
                    })}
                </div>
            </div>

            {/* Hidden Input (Auto-focus when clicked) */}
            <input
                ref={inputRef}
                type="text"
                className="absolute opacity-0"
                autoFocus
                value={input}
                onChange={handleInputChange}
            />

            <p className="mt-4 text-lg">WPM: {wpm}</p>
            <p className="text-gray-400 text-sm">Type in Romaji, it converts to Hiragana automatically!</p>
            <p className="text-gray-400 text-sm">Press <kbd className="bg-gray-700 p-1 rounded">Tab</kbd> then <kbd className="bg-gray-700 p-1 rounded">Enter</kbd> to restart.</p>
        </div>
    );
}
export default Wpm