import { kanjiData } from "../../../../utils/kanjidata";




class KanjiGame {
    
   
    constructor(level, section) {
        this.level = level;
        this.section = section;
        this.cg = 0;
        this.wg = 0;
        this.startdate = new Date();
        

        // Check if kanjiData[level][section] is an object and convert to an array
        if (typeof kanjiData[level][section] === 'object' && !Array.isArray(kanjiData[level][section])) {
            this.originalSection = Object.values(kanjiData[level][section]);
           
        } else {
            this.originalSection = [...kanjiData[level][section]];
           
        }
        this.len = this.originalSection.length;

        this.currentSection = [...this.originalSection];
        this.incorrectGuesses = 0;
        this.guessed = 0;
        this.incorrectGuessedKanji = [];
    
    }
    getstartdate() {
        return this.startdate;
    }
    getCorrectGuesses() {
        return this.cg;
    }
    getWrongGuesses() {
        return this.wg;
    }
    getFullGuesses() {
        return this.len + this.wg;
    }

    // Method to get a random Kanji from the current section
    getRandomKanji() {
        if (this.currentSection.length === 0 && this.incorrectGuessedKanji.length === 0) {
            console.log("Finished");
             
            return null;
        }

        // If no more kanji in current section, replenish from incorrect guesses
        if (this.currentSection.length === 0) {
            this.currentSection = [...this.incorrectGuessedKanji];
            this.incorrectGuessedKanji = [];
        }

        const randomIndex = Math.floor(Math.random() * this.currentSection.length);
        const selectedKanji = this.currentSection[randomIndex];
        return selectedKanji;
    }

    // Method to generate possible answers
    generateOptions(correctKanji) {
        const options = [correctKanji];
        const originalKeys = [...this.originalSection];

        // Add incorrect answers
        while (options.length < 9) {
            const randomKanji = originalKeys[Math.floor(Math.random() * originalKeys.length)];
            if (!options.includes(randomKanji)) {
                options.push(randomKanji);
            }
        }

        // Shuffle the options array
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }

        return options;
    }

    // Method to handle the user's answer
    next(userAnswer, correctKanji) {
        this.guessed += 1;
        console.log(`Comparing user answer: ${JSON.stringify(userAnswer)} with correct answer: ${JSON.stringify(correctKanji)}`);
        const index = this.currentSection.findIndex(kanji => kanji.kanji === correctKanji.kanji);
        console.log(this.cg,this.wg);
        if (userAnswer.kanji === correctKanji.kanji) {
            this.cg +=1;//add corect guess
            this.currentSection.splice(index, 1); // Remove the correctly guessed kanji
            console.log(`Correct guess! Remaining kanji: ${this.currentSection.length}`);
            return { correct: true, guessed: this.guessed, incorrectGuesses: this.incorrectGuesses };
        } else {
            this.incorrectGuesses += 1;
            this.wg +=1;//add wrong guess 
            this.incorrectGuessedKanji.push(this.currentSection.splice(index, 1)[0]); // Move the incorrectly guessed kanji to the separate list
            console.log(`Incorrect guess. Remaining kanji: ${this.currentSection.length}`);
            return { correct: false, guessed: this.guessed, incorrectGuesses: this.incorrectGuesses };
        }
       
    }

    // Method to get the next question and options
    getNextQuestion() {
        const correctKanji = this.getRandomKanji();
        if (!correctKanji) {
            return "Finished";
        }
        const options = this.generateOptions(correctKanji);
        return { correctKanji, options };
    }
    

 



}

export default KanjiGame;
