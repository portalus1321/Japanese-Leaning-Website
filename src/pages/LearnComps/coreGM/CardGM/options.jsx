import React, { useState, useEffect } from 'react';
import { kanjiData } from '../../../../utils/kanjidata';
import { supabase } from '../../../../utils/supabaseClient';
const GameOptions = ({ onOptionsSelected, token }) => {
  const levels = Object.keys(kanjiData); // Get all levels dynamically from kanjiData
  const [selectedLevel, setSelectedLevel] = useState(levels[0]); // Default to the first level
  const [selectedSection, setSelectedSection] = useState(null); // Start with no section selected
  const [mode, setMode] = useState('kanjiToWord');
  const [data, setUserData] = useState([]);

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
        .eq('data_type', 1)
        .eq('id', token.user.id)


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
  useEffect(() => {
    if (token && token.user) {
      getData();
    }
  }, [token]);
  const handleTileClick = (level, section) => {
    setSelectedLevel(level);
    setSelectedSection(section);
  };

  const isSectionClickable = (level, section) => {
    return kanjiData[level] && kanjiData[level][section];
  };

  const handleSubmit = () => {
    console.log(selectedLevel, " ", selectedSection)
    if (selectedLevel && selectedSection) {
      onOptionsSelected({ level: selectedLevel, section: selectedSection, mode });
    }
  };
  useEffect(() => {
  }, [token]);

  function getProgressColor(userData, level, section) {
    console.log("it should run getProgressColor function", userData);

    if (!userData || userData.length === 0) {
      return "bg-gray-300"; // data not loaded yet
    }

    const highScores = userData[0]?.data_best?.HighScores;
    if (!highScores || !Array.isArray(highScores)) {
      return "bg-gray-300"; // no HighScores found
    }

    const result = highScores.find(
      (entry) => entry.Level === level && entry.Group === section
    );

    if (!result) {
      return "bg-gray-300"; // no matching level/section
    }

    const score = result.Score;
    console.log(score, "score value");

    if (score < 20) {
      return "bg-red-500";
    } else if (score < 40) {
      return "bg-orange-500";
    } else if (score < 60) {
      return "bg-yellow-400";
    } else if (score < 80) {
      return "bg-lime-400";
    } else {
      return "bg-green-500";
    }
  }


  return (
    <div className="p-4 h-full w-full bg-white rounded-[30px] shadow-lg flex flex-col justify-center align-middle">
      <h2 className="text-lg font-bold mb-4">Select Game Options</h2>
      <div className=" relative grid grid-cols-10 w-[300px]  left-[50%] translate-x-[-50%] gap-y-[5px] gap-x-[30px]">
        {levels.map((level, rowIndex) => (
          <React.Fragment key={level}>
            {Object.keys(kanjiData[level]).map((section, colIndex) => (
              <div
                key={`${level}-${section}`}
                className={`border p-2 w-[30px] ml-1 h-[30px] text-center flex items-center justify-center cursor-pointer ${selectedLevel === level && selectedSection === section
                    ? 'bg-blue-500'
                    : 'bg-gray-300'
                  } ${isSectionClickable(level, section) ? 'hover:bg-blue-200' : 'cursor-not-allowed bg-gray-300'}`}
                onClick={() => handleTileClick(level, section)}
                style={{
                  gridColumn: `${colIndex + 1} / span 1`, // Parallel layout for sections within a level
                  gridRow: `${rowIndex + 1} / span 1`,
                }}
              >
                <div className={`absolute w-[20px] opacity-8~5 h-[20px] ${getProgressColor(data, level, section)}`}></div>
                {/* <p className='absolute h-[100%] w-[10px] h-[10px]'>N/A</p> */}
                {colIndex === 0 ? (
                  <span className="text-xs absolute w-[50px] text-right translate-x-[-100%] left-[-10px] leading-[4px]">{level}</span>
                ) : null}
                {rowIndex === 0 ? (
                  <span className="text-xs absolute w-[50px] text-right translate-y-[-100%] top-[-10px] leading-[4px]">{rowIndex + 1}</span>
                ) : null}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Mode</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="kanjiToWord">Kanji to Word</option>
          <option value="wordToKanji">Word to Kanji</option>
        </select>
      </div>
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-purple-700 text-white font-semibold rounded-lg shadow-md hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75"
      >
        Start Game
      </button>
    </div>
  );
};

export default GameOptions;
