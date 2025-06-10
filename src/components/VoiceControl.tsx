import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useInventory } from '../context/InventoryContext';
import { useShoppingList } from '../context/ShoppingListContext';
import { Mic, MicOff } from 'lucide-react';
import { CATEGORIES, UNITS } from '../types';

const VoiceControl: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const [audioLevel, setAudioLevel] = useState<number[]>(Array(10).fill(0));
  const { addInventoryItem, decreaseQuantity } = useInventory();
  const { addShoppingItem } = useShoppingList();
  const [lastVoiceTime, setLastVoiceTime] = useState(Date.now());
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (!isListening && transcript) {
      processVoiceCommand(transcript.toLowerCase());
      resetTranscript();
    }
  }, [isListening, transcript]);

  useEffect(() => {
    let animationFrame: number;
    
    const updateAudioLevel = () => {
      if (analyser && isListening) {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        
        // Calculate average volume level
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        const normalizedLevel = Math.min(average / 128, 1);
        
        // Update last voice time if there's significant audio
        if (normalizedLevel > 0.1) {
          setLastVoiceTime(Date.now());
        } else if (Date.now() - lastVoiceTime > 1000) {
          // Stop listening after 1 second of silence
          stopListening();
          return;
        }
        
        // Create visualization bars
        const bars = Array(10).fill(0).map((_, i) => {
          const threshold = (i + 1) / 10;
          return normalizedLevel >= threshold ? normalizedLevel : 0;
        });
        
        setAudioLevel(bars);
        animationFrame = requestAnimationFrame(updateAudioLevel);
      }
    };

    if (isListening) {
      animationFrame = requestAnimationFrame(updateAudioLevel);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isListening, analyser, lastVoiceTime]);

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
    setFeedback(text);
  };

  const extractQuantityAndUnit = (text: string): { quantity: number; unit: string } | null => {
    const numberWords: { [key: string]: number } = {
      'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
      'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
    };

    // Match numeric values with units
    const numericMatch = text.match(/(\d+)\s*(kg|g|lb|lbs|pieces?|pcs|bunch(?:es)?|cups?|tbsp|tsp|oz|bottles?|cans?|packets?|boxes?)/i);
    if (numericMatch) {
      const quantity = parseInt(numericMatch[1]);
      let unit = numericMatch[2].toLowerCase();
      
      // Normalize units
      unit = unit.replace(/pieces?|pcs/, 'pcs')
        .replace(/bottles?/, 'bottle')
        .replace(/cans?/, 'can')
        .replace(/boxes?/, 'box')
        .replace(/bunches?/, 'bunch')
        .replace(/cups?/, 'cup')
        .replace(/lbs?/, 'lb');

      return { quantity, unit };
    }

    // Match word numbers with units
    for (const [word, num] of Object.entries(numberWords)) {
      const wordMatch = text.match(new RegExp(`${word}\\s*(kg|g|lb|lbs|pieces?|pcs|bunch(?:es)?|cups?|tbsp|tsp|oz|bottles?|cans?|packets?|boxes?)`, 'i'));
      if (wordMatch) {
        let unit = wordMatch[1].toLowerCase();
        unit = unit.replace(/pieces?|pcs/, 'pcs')
          .replace(/bottles?/, 'bottle')
          .replace(/cans?/, 'can')
          .replace(/boxes?/, 'box')
          .replace(/bunches?/, 'bunch')
          .replace(/cups?/, 'cup')
          .replace(/lbs?/, 'lb');
        return { quantity: num, unit };
      }
    }

    return null;
  };

  const findCategory = (item: string): string => {
    const categoryMap: { [key: string]: string[] } = {
      'Vegetables': ['tomato', 'potato', 'onion', 'carrot', 'cucumber', 'lettuce', 'spinach', 'cabbage', 'pepper', 'bell pepper', 'chili'],
      'Fruits': ['apple', 'banana', 'orange', 'grape', 'mango', 'strawberry', 'blueberry', 'avocado', 'kiwi', 'pear', 'peach'],
      'Dairy': ['milk', 'cheese', 'yogurt', 'butter', 'cream'],
      'Meat': ['chicken', 'beef', 'pork', 'lamb', 'turkey'],
      'Seafood': ['fish', 'shrimp', 'salmon', 'tuna'],
      'Grains': ['rice', 'pasta', 'bread', 'flour', 'cereal'],
      'Spices': ['salt', 'pepper', 'cumin', 'coriander', 'turmeric'],
      'Condiments': ['ketchup', 'mayonnaise', 'mustard', 'sauce'],
      'Baking': ['sugar', 'baking powder', 'vanilla', 'chocolate'],
      'Canned': ['beans', 'soup', 'tomato sauce'],
      'Beverages': ['water', 'juice', 'soda', 'coffee', 'tea']
    };

    for (const [category, items] of Object.entries(categoryMap)) {
      if (items.some(i => item.includes(i))) {
        return category;
      }
    }

    return 'Other';
  };

  const processVoiceCommand = async (text: string) => {
    // Extract item name
    const words = text.split(' ');
    let itemName = '';
    
    if (text.includes('add') && (text.includes('to inventory') || text.includes('to shopping') || text.includes('to shopping list'))) {
      const startIndex = words.indexOf('add') + 1;
      const endIndex = words.findIndex(w => w === 'to');
      if (startIndex < endIndex) {
        itemName = words.slice(startIndex, endIndex).join(' ');
      }
    }

    if (!itemName) {
      speak("I didn't catch the item name. Could you repeat that?");
      return;
    }

    // Determine if it's for inventory or shopping list
    const isInventory = text.includes('to inventory');
    const isShopping = text.includes('to shopping') || text.includes('to shopping list');

    if (!isInventory && !isShopping) {
      speak("Please specify if you want to add to inventory or shopping list");
      return;
    }

    // Extract quantity and unit
    const quantityInfo = extractQuantityAndUnit(text);
    if (!quantityInfo) {
      speak(`What quantity of ${itemName} would you like to add?`);
      return;
    }

    // Determine category
    const category = findCategory(itemName);

    if (isInventory) {
      addInventoryItem({
        name: itemName,
        category,
        quantity: quantityInfo.quantity,
        unit: quantityInfo.unit,
        lowThreshold: Math.ceil(quantityInfo.quantity * 0.2), // Set threshold at 20% of initial quantity
        kitchenId: 'default'
      });
      speak(`Added ${quantityInfo.quantity} ${quantityInfo.unit} of ${itemName} to inventory`);
    } else {
      addShoppingItem({
        name: itemName,
        category,
        quantity: quantityInfo.quantity,
        unit: quantityInfo.unit,
        kitchenId: 'default',
        automatic: false
      });
      speak(`Added ${quantityInfo.quantity} ${quantityInfo.unit} of ${itemName} to shopping list`);
    }
  };

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyserNode = audioContext.createAnalyser();
      analyserNode.fftSize = 256;
      source.connect(analyserNode);
      
      setAnalyser(analyserNode);
      setMediaStream(stream);
      setIsListening(true);
      setFeedback('Listening...');
      SpeechRecognition.startListening();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setFeedback('Error accessing microphone');
    }
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setIsListening(false);
    setAudioLevel(Array(10).fill(0));
    
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    setAnalyser(null);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        {feedback && (
          <div className="absolute bottom-16 right-0 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 mb-2 min-w-[200px]">
            <p className="text-sm text-gray-600">{feedback}</p>
          </div>
        )}
        {isListening && (
          <div className="absolute bottom-16 right-16 bg-black/20 backdrop-blur-sm rounded-lg p-2 mb-2">
            <div className="flex items-end h-8 space-x-1">
              {audioLevel.map((level, i) => (
                <div
                  key={i}
                  className="w-1 bg-herb-500 rounded-t transition-all duration-100"
                  style={{
                    height: `${Math.max(4, level * 32)}px`,
                    opacity: level > 0 ? 1 : 0.3
                  }}
                />
              ))}
            </div>
          </div>
        )}
        <button
          onClick={isListening ? stopListening : startListening}
          className={`p-4 rounded-full shadow-lg transition-all duration-300 ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-herb-500 hover:bg-herb-600'
          }`}
        >
          {isListening ? (
            <MicOff className="h-6 w-6 text-white" />
          ) : (
            <Mic className="h-6 w-6 text-white" />
          )}
        </button>
      </div>
    </div>
  );
};

export default VoiceControl;