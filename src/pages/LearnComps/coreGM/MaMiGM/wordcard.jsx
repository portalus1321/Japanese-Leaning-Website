    // src/WordCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
const WordCard = ({ wordData }) => {
  const { japanese, senses } = wordData;
  const word = japanese[0].word || japanese[0].reading;
  const reading = japanese[0].reading;

  return (
    <div className="word-card">
      <h2>{word}</h2>
      <h3>{reading}</h3>
      <ul>
        {senses.map((sense, index) => (
          <li key={index}>
            {sense.english_definitions.join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
};
WordCard.propTypes = {
    wordData: PropTypes.shape({
      japanese: PropTypes.arrayOf(
        PropTypes.shape({
          word: PropTypes.string,
          reading: PropTypes.string
        })
      ).isRequired,
      senses: PropTypes.arrayOf(
        PropTypes.shape({
          english_definitions: PropTypes.arrayOf(PropTypes.string).isRequired
        })
      ).isRequired
    }).isRequired
  };
export default WordCard;
