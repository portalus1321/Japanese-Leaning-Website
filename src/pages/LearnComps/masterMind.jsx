import CircleGenerator from "./coreGM/MaMiGM/circles"
import React, { useState } from 'react';
import RadarChart from "../../Charts/Radar"
import WordCard from "./coreGM/MaMiGM/wordcard";

const fetchJishoData = async (query) => {
    try {
      const response = await fetch(`https://cors-anywhere.herokuapp.com/https://jisho.org/api/v1/search/words?keyword=${query}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data from Jisho:', error.message);
      throw error;
    }
  };
export default function MasterMind() {

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
  
  
  const handleSearch = async () => {
  try {
    const data = await fetchJishoData(query);
    console.log('API Response:', data); // Log the entire response to check its structure
    setResults(data.data);
  } catch (error) {
    console.error('Error fetching data from Jisho:', error);
  }
};
const handlePrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, results.length - 1));
  };

  const currentResult = results[currentIndex] || {}; // Get the current result or an empty object

    return (
        <>
            <div className="w-full h-[90vh] flex justify-center items-center">
                <div className="relative w-[300px] h-[300px] rounded-full border-8 border-purple-700 bg-gray-500 flex items-center justify-center" >
                    <div className=" w-full h-full animate-clock-spin flex items-center justify-center">
                    <svg width="300" height="300" className=" scale-[1.4]" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M75.3995 52.7788C66.1879 49.0816 57.1957 44.6715 48.5077 39.5484C45.3973 42.408 42.408 45.3973 39.5484 48.5077C44.6715 57.1957 49.0816 66.1879 52.7788 75.3995C42.9179 74.2118 33.0846 72.2776 23.3607 69.575C21.0994 73.1282 18.9836 76.7831 17.0216 80.5311C24.2274 87.6034 30.822 95.1551 36.7835 103.104C26.9441 104.51 16.9378 105.187 6.83821 105.092C5.58328 109.097 4.49174 113.173 3.57141 117.315C12.3627 122.281 20.6876 127.869 28.5037 134.005C19.3753 137.904 9.8979 141.144 0.131348 143.665C0.0440674 145.766 0 147.878 0 150C0 152.122 0.0440674 154.234 0.131348 156.335C9.8979 158.856 19.3753 162.096 28.5037 165.995C20.6876 172.131 12.3627 177.719 3.5714 182.685C4.49173 186.827 5.58328 190.903 6.83821 194.908C16.9378 194.813 26.9441 195.49 36.7835 196.896C30.822 204.845 24.2274 212.397 17.0216 219.469C18.9836 223.217 21.0994 226.872 23.3607 230.425C33.0846 227.722 42.9179 225.788 52.7788 224.6C49.0816 233.812 44.6715 242.804 39.5484 251.492C42.408 254.603 45.3973 257.592 48.5077 260.452C57.1957 255.328 66.1879 250.918 75.3995 247.221C74.2118 257.082 72.2776 266.915 69.575 276.639C73.1282 278.901 76.7831 281.016 80.5311 282.978C87.6034 275.773 95.1551 269.178 103.104 263.217C104.51 273.056 105.187 283.062 105.092 293.162C109.097 294.417 113.173 295.508 117.315 296.429C122.281 287.637 127.869 279.312 134.005 271.496C137.904 280.625 141.144 290.102 143.665 299.869C145.766 299.956 147.878 300 150 300C152.122 300 154.234 299.956 156.335 299.869C158.856 290.102 162.096 280.625 165.995 271.496C172.131 279.312 177.719 287.637 182.685 296.429C186.827 295.508 190.903 294.417 194.908 293.162C194.813 283.062 195.49 273.056 196.896 263.217C204.845 269.178 212.397 275.773 219.469 282.978C223.217 281.016 226.872 278.901 230.425 276.639C227.722 266.915 225.788 257.082 224.6 247.221C233.812 250.918 242.804 255.328 251.492 260.452C254.603 257.592 257.592 254.603 260.452 251.492C255.328 242.804 250.918 233.812 247.221 224.6C257.082 225.788 266.915 227.722 276.639 230.425C278.901 226.872 281.016 223.217 282.978 219.469C275.773 212.397 269.178 204.845 263.217 196.896C273.056 195.49 283.062 194.813 293.162 194.908C294.417 190.903 295.508 186.827 296.429 182.685C287.637 177.719 279.312 172.131 271.496 165.995C280.625 162.096 290.102 158.856 299.869 156.335C299.956 154.234 300 152.122 300 150C300 147.878 299.956 145.766 299.869 143.665C290.102 141.144 280.625 137.904 271.496 134.005C279.312 127.869 287.637 122.281 296.429 117.315C295.508 113.173 294.417 109.097 293.162 105.092C283.062 105.187 273.056 104.51 263.217 103.104C269.178 95.1551 275.773 87.6034 282.978 80.5311C281.016 76.7831 278.901 73.1282 276.639 69.575C266.915 72.2776 257.082 74.2118 247.221 75.3995C250.918 66.1879 255.328 57.1957 260.452 48.5077C257.592 45.3973 254.603 42.408 251.492 39.5484C242.804 44.6715 233.812 49.0816 224.6 52.7788C225.788 42.9179 227.722 33.0846 230.425 23.3607C226.872 21.0994 223.217 18.9836 219.469 17.0216C212.397 24.2274 204.845 30.822 196.896 36.7835C195.49 26.9441 194.813 16.9378 194.908 6.83821C190.903 5.58328 186.827 4.49173 182.685 3.5714C177.719 12.3627 172.131 20.6876 165.995 28.5037C162.096 19.3753 158.856 9.8979 156.335 0.131348C154.234 0.0440674 152.122 0 150 0C147.878 0 145.766 0.0440674 143.665 0.131348C141.144 9.8979 137.904 19.3753 134.005 28.5037C127.869 20.6876 122.281 12.3627 117.315 3.57141C113.173 4.49174 109.097 5.58328 105.092 6.83821C105.187 16.9378 104.51 26.9441 103.104 36.7835C95.1551 30.822 87.6034 24.2274 80.5311 17.0216C76.7831 18.9836 73.1282 21.0994 69.575 23.3607C72.2776 33.0846 74.2118 42.9179 75.3995 52.7788ZM150 265C213.513 265 265 213.513 265 150C265 86.4873 213.513 35 150 35C86.4873 35 35 86.4873 35 150C35 213.513 86.4873 265 150 265Z" fill="rgb(126 34 206)" />
                    </svg>
                    </div>
                    <div className="absolute w-full h-full">
                              <div className="h-full w-full flex justify-center items-center rounded-full overflow-hidden ">
                                            <div className="bg-black w-3 h-3 rounded-full">
                                  
                                            </div>
                              </div>
                    </div>
                    <div className="absolute w-full h-full">
                        <div class="relative mt-2 rounded-md shadow-sm w-full h-full">
                           
                            <input   
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search for a word..."
                           name="price" id="price" class="absolute bottom-[-150px] block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-4 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-4 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                           <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Search
      </button>
      <div className="h-[500px]">
     
     <div className="p-4">
   
     
     <div className="mt-4">
       {results.length > 0 ? (
         <div className="border border-gray-300 p-4 mb-4 rounded-lg bg-gray-100 h-[350px] ">
           <WordCard wordData={currentResult} />
           <div className="flex justify-between mt-4">
             <button
               onClick={handlePrevious}
               disabled={currentIndex === 0}
               className={`px-4 py-2 text-white font-semibold rounded ${currentIndex === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
             >
               Previous
             </button>
             <button
               onClick={handleNext}
               disabled={currentIndex === results.length - 1}
               className={`px-4 py-2 text-white font-semibold rounded ${currentIndex === results.length - 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
             >
               Next
             </button>
           </div>
         </div>
       ) : (
         <p>No results found</p>
       )}
     </div>
   </div>
   </div>  
                        </div>
                    </div>
                </div>
            </div>
             <div className="absolute w-full h-[90vh] top-[10vh] flex items-center justify-center z-[-1] overflow-hidden">
                  <CircleGenerator/>
             </div>

        </>
    )
}