const exampleuser = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    profilePicture: "path/to/profilePicture.jpg",
    progress: {
        kanjiLearned: 120,
        wordsLearned: 250,
        gamesPlayed: {
            flashcards: {
                played: 15,
                scores: [
                    { date: "2024-01-05", score: 80 },
                    { date: "2024-01-15", score: 85 },
                    { date: "2024-01-25", score: 90 },
                ],
            },
            typingSpeed: {
                played: 10,
                scores: [
                    { date: "2024-01-07", score: 75 },
                    { date: "2024-01-17", score: 80 },
                    { date: "2024-01-27", score: 85 },
                ],
            },
            guessingWord: {
                played: 5,
                scores: [
                    { date: "2024-01-10", score: 70 },
                    { date: "2024-01-20", score: 75 },
                    { date: "2024-01-30", score: 80 },
                ],
            },
        },
        currentLesson: "Lesson 31",
    },
    achievements: [
        { id: 1, title: "Completed 100 Kanji", date: "2024-01-15" },
        { id: 2, title: "First 200 Words", date: "2024-02-10" },
        { id: 3, title: "Played 30 Games", date: "2024-03-05" },
    ],
    settings: {
        notifications: true,
        darkMode: false,
    },
    friends: [
        { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
        { id: 3, name: "Bob Johnson", email: "bob.johnson@example.com" },
    ],
};


