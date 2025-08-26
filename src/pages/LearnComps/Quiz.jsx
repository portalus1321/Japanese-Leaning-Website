import React, { useEffect, useState } from 'react';

const kanjiData = {
  N5: {
    S1: {
            kanji1:  { kanji: '最近', meaning: 'recently', onyomi: 'さいきん', kunyomi: 'blank' },
            kanji2:  { kanji: '材料', meaning: 'ingredients', onyomi: 'ざいりょう', kunyomi: 'blank' },
            kanji3:  { kanji: '作家', meaning: 'author', onyomi: 'さっか', kunyomi: 'blank' },
            kanji4:  { kanji: '作品', meaning: 'work,porduction', onyomi: 'さくひん', kunyomi: 'blank' },
            kanji5:  { kanji: '参加', meaning: 'partipication', onyomi: 'さんか', kunyomi: 'blank' },
            kanji6:  { kanji: '使用', meaning: 'use', onyomi: 'しよう', kunyomi: 'blank' },
            kanji7:  { kanji: '試合', meaning: 'match', onyomi: 'しあい', kunyomi: 'blank' },
            kanji8:  { kanji: '市民', meaning: 'citizen', onyomi: 'しみん', kunyomi: 'blank' },
            kanji9:  { kanji: '自然', meaning: 'nature', onyomi: 'しぜん', kunyomi: 'blank' },
            kanji10: { kanji: '失敗', meaning: 'failure', onyomi: 'しっぱい', kunyomi: 'blank' },
            kanji11: { kanji: '社員', meaning: 'company employee', onyomi: 'しゃいん', kunyomi: 'blank' },
            kanji12: { kanji: '社会', meaning: 'society', onyomi: 'しゃかい', kunyomi: 'blank' },
            kanji13: { kanji: '手術', meaning: 'surgeri', onyomi: 'しゅじゅつ', kunyomi: 'blank' },
            kanji14: { kanji: '主張', meaning: 'assertion', onyomi: 'しゅちょう', kunyomi: 'blank' },
            kanji15: { kanji: '出発', meaning: 'departure', onyomi: 'しょっぱつ', kunyomi: 'blank' },
            kanji16: { kanji: '商品', meaning: 'product', onyomi: 'しょうひん', kunyomi: 'blank' },
            kanji17: { kanji: '証明', meaning: 'proof', onyomi: 'しょうめい', kunyomi: 'blank' },
            kanji18: { kanji: '食事', meaning: 'meal', onyomi: 'しょくじ', kunyomi: 'blank' },
            kanji19: { kanji: '女性', meaning: 'female', onyomi: 'じょせい', kunyomi: 'blank' },
            kanji20: { kanji: '情報', meaning: 'information', onyomi: 'じょうほう', kunyomi: 'blank' },
        },
  }
};

const getRandomChoices = (correct, pool, count = 9) => {
  const filtered = pool.filter(item => item !== correct);
  const shuffled = filtered.sort(() => Math.random() - 0.5).slice(0, count - 1);
  return [...shuffled, correct].sort(() => Math.random() - 0.5);
};

export default function KanjiQuiz() {
  const [question, setQuestion] = useState(null);
  const [selection, setSelection] = useState({ meaning: null, reading: null });

  const flatList = Object.values(kanjiData.N5.S1);

  const generateQuestion = () => {
    const randomKanji = flatList[Math.floor(Math.random() * flatList.length)];
    const allMeanings = flatList.map(k => k.meaning);
    const allReadings = flatList.map(k => k.onyomi).concat(flatList.map(k => k.onyomi));
    const correctReading = Math.random() > 0.5 ? randomKanji.onyomi : randomKanji.onyomi;

    setQuestion({
      kanji: randomKanji.kanji,
      correctMeaning: randomKanji.meaning,
      correctReading,
      meaningChoices: getRandomChoices(randomKanji.meaning, allMeanings),
      readingChoices: getRandomChoices(correctReading, allReadings)
    });

    setSelection({ meaning: null, reading: null });
  };

  useEffect(() => {
    generateQuestion();
    const listener = (e) => {
      if (e.code === 'Space') {
        generateQuestion();
      }
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, []);

  if (!question) return null;

  const isAnswered = selection.meaning && selection.reading;

  const handleSelect = (type, value) => {
    if (!isAnswered) {
      setSelection(prev => ({ ...prev, [type]: value }));
    }
  };

  const getButtonColor = (type, value) => {
    const correct = type === 'meaning' ? question.correctMeaning : question.correctReading;
    const selected = selection[type];
    const otherSelected = type === 'meaning' ? selection.reading : selection.meaning;

    // Yellow for selected and waiting for other side
    if (selected === value && !otherSelected) {
      return 'gold';
    }

    // After both selected, show result
    if (isAnswered) {
      if (value === correct) return 'green';
      if (value === selected) return 'red';
    }

    return 'lightgray';
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '60px', textAlign: 'center' }}>{question.kanji}</h1>

      <div style={{ display: 'flex' , justifyContent: 'space-around', marginBottom: '30px' }}>
        <div style={{display:'flex',flexDirection:"column"}}>
          <h2>Meaning</h2>
          {question.meaningChoices.map((choice, idx) => (
            <button
              key={idx}
              style={{
                backgroundColor: getButtonColor('meaning', choice),
                margin: '5px',
                padding: '10px 20px',
                fontSize: '16px',
                border: '1px solid black',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onClick={() => handleSelect('meaning', choice)}
            >
              {choice}
            </button>
          ))}
        </div>

        <div  style={{display:'flex',flexDirection:"column"}}>
          <h2>Reading</h2>
          {question.readingChoices.map((choice, idx) => (
            <button
              key={idx}
              style={{
                backgroundColor: getButtonColor('reading', choice),
                margin: '5px',
                padding: '10px 20px',
                fontSize: '16px',
                border: '1px solid black',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onClick={() => handleSelect('reading', choice)}
            >
              {choice}
            </button>
          ))}
        </div>
      </div>

      {isAnswered && (
        <p style={{ textAlign: 'center', fontSize: '18px' }}>
          Press <b>Space</b> to go to next Kanji.
        </p>
      )}
    </div>
  );
}
