// Utility functions
function stringToBinary(str) {
    return str.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join('');
}

function binaryToString(bin) {
    let str = '';
    for (let i = 0; i < bin.length; i += 8) {
        str += String.fromCharCode(parseInt(bin.substr(i, 8), 2));
    }
    return str;
}

function xorWithKey(binary, key) {
    if (!key) return binary;
    const keyBin = stringToBinary(key).repeat(Math.ceil(binary.length / stringToBinary(key).length)).substr(0, binary.length);
    return binary.split('').map((bit, i) => (parseInt(bit) ^ parseInt(keyBin[i])).toString()).join('');
}

// Hide message with LSB steganography
function hideMessage(imageData, message, key) {
    const messageBin = stringToBinary(message);
    const lengthBin = (messageBin.length / 8).toString(2).padStart(32, '0'); // 32-bit length prefix
    const fullBin = lengthBin + messageBin;
    const encryptedBin = xorWithKey(fullBin, key);
    const data = imageData.data;
    const maxBits = (data.length / 4) * 3; // 3 bits per pixel (RGB)
    if (encryptedBin.length > maxBits) {
        alert('Message is too long for this image. Use a larger image or shorten the message.');
        return null;
    }
    let binaryIndex = 0;
    for (let i = 0; i < data.length && binaryIndex < encryptedBin.length; i += 4) {
        for (let j = 0; j < 3; j++) { // R, G, B
            if (binaryIndex < encryptedBin.length) {
                data[i + j] = (data[i + j] & 0xFE) | parseInt(encryptedBin[binaryIndex]); // Set LSB
                binaryIndex++;
            }
        }
    }
    return imageData;
}

// Reveal message with LSB steganography
function revealMessage(imageData, key) {
    const data = imageData.data;
    let extractedBin = '';
    for (let i = 0; i < data.length; i += 4) {
        for (let j = 0; j < 3; j++) {
            extractedBin += (data[i + j] & 1).toString(); // Extract LSB
        }
    }
    const decryptedBin = xorWithKey(extractedBin, key);
    if (decryptedBin.length < 32) {
        return 'No valid message found (image too small or no hidden message).';
    }
    const length = parseInt(decryptedBin.substr(0, 32), 2);
    if (isNaN(length) || length <= 0 || decryptedBin.length < 32 + length * 8) {
        return 'No valid message found (possible corruption or wrong key).';
    }
    const messageBin = decryptedBin.substr(32, length * 8);
    return binaryToString(messageBin);
}

// Helper to set dropzone image
function setDropzoneImage(dropzone, imgSrc) {
    dropzone.style.backgroundImage = `url(${imgSrc})`;
    dropzone.classList.add('has-image');
    dropzone.querySelector('.remove-icon').style.display = 'block';
}

// Helper to clear dropzone
function clearDropzone(dropzone) {
    dropzone.style.backgroundImage = '';
    dropzone.classList.remove('has-image');
    dropzone.querySelector('.remove-icon').style.display = 'none';
}

// Event listeners for Hide section
const hideDropzone = document.getElementById('hideDropzone');
const hideImageInput = document.getElementById('hideImageInput');
const hideRemoveIcon = document.getElementById('hideRemoveIcon');
const hideButton = document.getElementById('hideButton');
const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');

hideDropzone.addEventListener('click', () => hideImageInput.click());
hideDropzone.addEventListener('dragover', (e) => { e.preventDefault(); hideDropzone.classList.add('dragover'); });
hideDropzone.addEventListener('dragleave', () => hideDropzone.classList.remove('dragover'));
hideDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    hideDropzone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length) handleImageUpload(files[0], hideDropzone, hideImageInput);
});
hideImageInput.addEventListener('change', () => {
    const file = hideImageInput.files[0];
    if (file) handleImageUpload(file, hideImageInput, hideDropzone);
});
hideRemoveIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    clearDropzone(hideDropzone);
    hideImageInput.value = '';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

function handleImageUpload(file, dropzone, input) {
    const img = new Image();
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        setDropzoneImage(dropzone, URL.createObjectURL(file));
    };
    img.src = URL.createObjectURL(file);
}

hideButton.addEventListener('click', () => {
    const message = document.getElementById('message').value;
    const key = document.getElementById('hideKey').value;
    if (!message) return alert('Enter a message');
    if (!ctx.getImageData(0, 0, 1, 1).data.length) return alert('Upload an image first');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const modifiedData = hideMessage(imageData, message, key);
    if (!modifiedData) return; // Message too long
    ctx.putImageData(modifiedData, 0, 0);
    canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'NewImage.png';
        a.click();
        URL.revokeObjectURL(url);
    });
});

// Event listeners for Reveal section
const revealDropzone = document.getElementById('revealDropzone');
const revealImageInput = document.getElementById('revealImageInput');
const revealRemoveIcon = document.getElementById('revealRemoveIcon');
const revealButton = document.getElementById('revealButton');
const revealedMessage = document.getElementById('revealedMessage');

revealDropzone.addEventListener('click', () => revealImageInput.click());
revealDropzone.addEventListener('dragover', (e) => { e.preventDefault(); revealDropzone.classList.add('dragover'); });
revealDropzone.addEventListener('dragleave', () => revealDropzone.classList.remove('dragover'));
revealDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    revealDropzone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length) handleImageUpload(files[0], revealDropzone, revealImageInput);
});
revealImageInput.addEventListener('change', () => {
    const file = revealImageInput.files[0];
    if (file) handleImageUpload(file, revealImageInput, revealDropzone);
});
revealRemoveIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    clearDropzone(revealDropzone);
    revealImageInput.value = '';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

revealButton.addEventListener('click', () => {
    if (!ctx.getImageData(0, 0, 1, 1).data.length) return alert('Upload an image first');
    const key = document.getElementById('revealKey').value;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const message = revealMessage(imageData, key);
    if (message.startsWith('No valid message')) {
        revealedMessage.innerHTML = '<span style="color: red; font-weight: bold;">' + message + '</span>';
    }
    else {
        revealedMessage.textContent = 'Hidden message: ' + message;
    }
});

// Eye icon toggle for hide key
const hideEyeIcon = document.getElementById('hideEyeIcon');
const hideKey = document.getElementById('hideKey');
hideEyeIcon.addEventListener('click', () => {
    if (hideKey.type === 'password') {
        hideKey.type = 'text';
        hideEyeIcon.classList.add('hidden');
    } else {
        hideKey.type = 'password';
        hideEyeIcon.classList.remove('hidden');
    }
});

// Eye icon toggle for reveal key
const revealEyeIcon = document.getElementById('revealEyeIcon');
const revealKey = document.getElementById('revealKey');
revealEyeIcon.addEventListener('click', () => {
    if (revealKey.type === 'password') {
        revealKey.type = 'text';
        revealEyeIcon.classList.add('hidden');
    } else {
        revealKey.type = 'password';
        revealEyeIcon.classList.remove('hidden');
    }
});