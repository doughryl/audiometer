let audioContext;
let oscillator;
let gainNode;
let isPlaying = false;
let currentFrequencyIndex = 0;
let frequencies = [500, 1000, 2000, 4000];
let currentEar = 'Left';
let frequencyDecibelData = [];
let isTestCompleted = false; 

function playTone() {
  if (!isPlaying && !isTestCompleted) {
      stopTone();
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      oscillator = audioContext.createOscillator();
      gainNode = audioContext.createGain();

      const panNode = audioContext.createStereoPanner();
      panNode.pan.value = currentEar === 'Left' ? -1 : 1;

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequencies[currentFrequencyIndex], audioContext.currentTime);
      oscillator.connect(panNode);
      panNode.connect(gainNode);
      gainNode.connect(audioContext.destination);

      const volumeSlider = document.getElementById('volumeSlider');
      const currentVolumeElement = document.getElementById('currentVolume');
      
      volumeSlider.addEventListener('input', function () {
        const volumeStep = 5;
        let volumeValue = parseInt(volumeSlider.value, 10);
      
        volumeValue = Math.round(volumeValue / volumeStep) * volumeStep;
      
        volumeValue = Math.max(0, Math.min(120, volumeValue));
      
        volumeSlider.value = volumeValue;
        currentVolumeElement.textContent = volumeValue + ' dB';
      
        gainNode.gain.setValueAtTime(convertToGain(volumeValue), audioContext.currentTime);
      });
    

      const volumeValue = parseFloat(volumeSlider.value);
      gainNode.gain.setValueAtTime(convertToGain(volumeValue), audioContext.currentTime);

      const currentFrequencyElement = document.getElementById('currentFrequency');
      currentFrequencyElement.textContent = frequencies[currentFrequencyIndex] + ' Hz';

      const currentEarElement = document.getElementById('currentEar');
      currentEarElement.textContent = currentEar;

      oscillator.start();
      isPlaying = true;    
  }
}

function pauseTone() {
  if (isPlaying && !isTestCompleted) {
    oscillator.stop();
    isPlaying = false;
  }
}

function stopTone() {
  if (isPlaying) {
    oscillator.stop();
    isPlaying = false;
  }
}


function nextFrequency() {
  stopTone();

  
  if (!isTestCompleted) {

  // save the frequency, decibel, and ear values in the console (database simulation)
  const volumeValue = parseFloat(document.getElementById('volumeSlider').value);
  frequencyDecibelData.push({
    frequency: frequencies[currentFrequencyIndex],
    decibel: volumeValue,
    ear: currentEar
  });

  if (currentEar === 'Left') {
    // move to the next frequency for the left ear
    if (currentFrequencyIndex < frequencies.length - 1) {
      currentFrequencyIndex++;
    } else {
      // switch to the right ear if all frequencies are tested for the left ear
      currentEar = 'Right';
      currentFrequencyIndex = 0;
    }
  } else if (currentEar === 'Right') {
    // move to the next frequency for the right ear
    if (currentFrequencyIndex < frequencies.length - 1) {
      currentFrequencyIndex++;
    } else {
      // end of the test for both ears
      alert('Hearing test completed!');
      displayFrequencyDecibelData();

      // log for checking
      console.log('Test completed, sending data to the database...');

      sendDataToDatabase();

      // Show the "Complete" button
      const completeButton = document.querySelector('.complete-btn');
      completeButton.style.display = 'block';

      isTestCompleted = true;

      return;
    }
  }

  // update the display with the current frequency and ear
  const currentFrequencyElement = document.getElementById('currentFrequency');
  currentFrequencyElement.textContent = frequencies[currentFrequencyIndex] + ' Hz';

  const currentEarElement = document.getElementById('currentEar');
  currentEarElement.textContent = currentEar;

  playTone();
}
}
// Function to handle "Complete" button click event
function completeTest() {
  // Handle the "Complete" button click event as needed
  console.log('User clicked "Complete"');
  window.location.href = 'results.html';
}


function convertToGain(volume) {
  return volume / 100;
}

function sendDataToDatabase() {
  if (frequencyDecibelData.length > 0) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'test.php', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    const data = {
      decibels: frequencyDecibelData.map(entry => entry.decibel)
    };

    console.log('Decibel Values Array:', frequencyDecibelData.map(entry => entry.decibel));

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log('Data sent to database successfully.');
          // clear array after successful submission
          frequencyDecibelData = [];
        } else {
          console.log('Error sending data to the database. Status:', xhr.status);
        }
      }
    };

    xhr.send(JSON.stringify(data));
  }
}


function displayFrequencyDecibelData() {
  console.log("Frequency and Decibel Data:");
  frequencyDecibelData.forEach(data => {
    console.log(`Frequency: ${data.frequency} Hz, Decibel: ${data.decibel} dB, Ear: ${data.ear}`);
  });
}

// initial setup
window.onload = function() {
  playTone();
};
