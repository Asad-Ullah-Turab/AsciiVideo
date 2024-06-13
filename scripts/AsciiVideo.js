const asciiArt = document.getElementById("ascii-art");

navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((stream) => {
    const video = document.createElement("video");
    video.srcObject = stream;
    video.play();

    video.addEventListener("playing", () => {
      const updateInterval = 10; // Update every 100ms
      setInterval(() => {
        captureAndConvert(video);
      }, updateInterval);
    });
  })
  .catch((err) => {
    console.error("Error accessing camera: ", err);
  });

function captureAndConvert(video) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Ensure canvas size matches video aspect ratio
  const aspectRatio = video.videoWidth / video.videoHeight;
  const canvasWidth = 740; // Set your desired width
  const canvasHeight = canvasWidth / aspectRatio;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // Flip the canvas horizontally
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);

  // Draw the video frame to the canvas
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const asciiStr = convertToAscii(imageData);
  asciiArt.textContent = asciiStr;
}

function convertToAscii(imageData) {
  const chars = "@%#*+=-:. ";
  const { data, width, height } = imageData;
  let asciiStr = "";

  for (let y = 0; y < height; y += 8) {
    for (let x = 0; x < width; x += 4) {
      const offset = (y * width + x) * 4;
      const red = data[offset];
      const green = data[offset + 1];
      const blue = data[offset + 2];
      const avg = (red + green + blue) / 3;
      const charIndex = Math.floor((avg / 255) * (chars.length - 1));
      asciiStr += chars[charIndex];
    }
    asciiStr += "\n";
  }

  return asciiStr;
}
