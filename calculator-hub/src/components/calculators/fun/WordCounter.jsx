import React, { useState, useEffect } from 'react';
import { FaCalculator, FaFont, FaAlignLeft, FaClock } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const WordCounter = () => {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
    speakingTime: 0,
    mostFrequentWords: []
  });

  useEffect(() => {
    calculateStats(text);
  }, [text]);

  const calculateStats = (inputText) => {
    // Handle empty text
    if (!inputText || inputText.trim() === '') {
      setStats({
        characters: 0,
        charactersNoSpaces: 0,
        words: 0,
        sentences: 0,
        paragraphs: 0,
        readingTime: 0,
        speakingTime: 0,
        mostFrequentWords: []
      });
      return;
    }

    // Character count
    const characters = inputText.length;
    
    // Character count without spaces
    const charactersNoSpaces = inputText.replace(/\s+/g, '').length;
    
    // Word count
    const words = inputText.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    // Sentence count
    const sentences = inputText.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
    
    // Paragraph count
    const paragraphs = inputText.split(/\n+/).filter(para => para.trim().length > 0).length;
    
    // Reading time (average reading speed: 225 words per minute)
    const readingTime = Math.ceil(words / 225);
    
    // Speaking time (average speaking speed: 150 words per minute)
    const speakingTime = Math.ceil(words / 150);
    
    // Most frequent words
    const wordFrequency = {};
    inputText.trim().toLowerCase().split(/\s+/).forEach(word => {
      // Remove punctuation
      const cleanWord = word.replace(/[^\w\s]|_/g, "");
      if (cleanWord.length > 3) { // Only count words longer than 3 characters
        wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1;
      }
    });
    
    const mostFrequentWords = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word, count]) => ({ word, count }));
    
    setStats({
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTime,
      speakingTime,
      mostFrequentWords
    });
  };

  const handleClearText = () => {
    setText('');
  };

  const handleSampleText = () => {
    const sampleText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`;
    setText(sampleText);
  };

  return (
    <>
      <SEO
        title="Word Counter"
        description="Count words, characters, sentences, and paragraphs in your text. Get reading time estimates and text statistics."
        keywords="word counter, character count, text analyzer, reading time calculator, word frequency"
      />

      <div className="calculator-container">
        <h1 className="calculator-title">Word Counter</h1>
        <p className="calculator-description">
          Count words, characters, sentences, and paragraphs in your text. Get reading time estimates and text statistics.
        </p>

        <AdBanner position="top" />

        <div className="mb-6">
          <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
            Enter or paste your text below
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 min-h-[200px]"
            placeholder="Type or paste your text here..."
          ></textarea>
          
          <div className="flex space-x-2 mt-2">
            <button
              onClick={handleClearText}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Clear text
            </button>
            <button
              onClick={handleSampleText}
              className="text-sm text-primary-600 hover:text-primary-800"
            >
              Insert sample text
            </button>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FaCalculator className="mr-2 text-primary-600" /> Text Statistics
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
              <div className="flex items-center mb-1">
                <FaFont className="text-primary-600 mr-2" />
                <h4 className="text-sm font-medium text-gray-500">Characters</h4>
              </div>
              <p className="text-lg font-semibold">{stats.characters}</p>
              <p className="text-xs text-gray-500 mt-1">{stats.charactersNoSpaces} without spaces</p>
            </div>
            
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
              <div className="flex items-center mb-1">
                <FaFont className="text-primary-600 mr-2" />
                <h4 className="text-sm font-medium text-gray-500">Words</h4>
              </div>
              <p className="text-lg font-semibold">{stats.words}</p>
            </div>
            
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
              <div className="flex items-center mb-1">
                <FaAlignLeft className="text-primary-600 mr-2" />
                <h4 className="text-sm font-medium text-gray-500">Sentences</h4>
              </div>
              <p className="text-lg font-semibold">{stats.sentences}</p>
            </div>
            
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
              <div className="flex items-center mb-1">
                <FaAlignLeft className="text-primary-600 mr-2" />
                <h4 className="text-sm font-medium text-gray-500">Paragraphs</h4>
              </div>
              <p className="text-lg font-semibold">{stats.paragraphs}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
              <div className="flex items-center mb-1">
                <FaClock className="text-primary-600 mr-2" />
                <h4 className="text-sm font-medium text-gray-500">Estimated Reading Time</h4>
              </div>
              <p className="text-lg font-semibold">{stats.readingTime} minute{stats.readingTime !== 1 ? 's' : ''}</p>
              <p className="text-xs text-gray-500 mt-1">Based on 225 words per minute</p>
            </div>
            
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
              <div className="flex items-center mb-1">
                <FaClock className="text-primary-600 mr-2" />
                <h4 className="text-sm font-medium text-gray-500">Estimated Speaking Time</h4>
              </div>
              <p className="text-lg font-semibold">{stats.speakingTime} minute{stats.speakingTime !== 1 ? 's' : ''}</p>
              <p className="text-xs text-gray-500 mt-1">Based on 150 words per minute</p>
            </div>
          </div>
          
          {stats.mostFrequentWords.length > 0 && (
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Most Frequent Words</h4>
              <div className="flex flex-wrap gap-2">
                {stats.mostFrequentWords.map((item, index) => (
                  <div key={index} className="px-2 py-1 bg-gray-100 rounded-md text-sm">
                    {item.word} ({item.count})
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">About Word Counter</h3>
          <div className="space-y-3 text-gray-700 text-sm">
            <p>
              This word counter tool provides detailed statistics about your text, including character count, word count, sentence count, and paragraph count.
            </p>
            <p>
              It also estimates reading and speaking time based on average reading and speaking speeds, and identifies the most frequently used words in your text.
            </p>
            <p>
              Use this tool for essays, articles, blog posts, or any other text to get a better understanding of its length and complexity.
            </p>
          </div>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default WordCounter;
