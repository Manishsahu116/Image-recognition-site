  let cocoSsdModelPromise = cocoSsd.load();
  let mobilenetModelPromise = mobilenet.load();

  async function runObjectDetection(imageElement) {
    const model = await cocoSsdModelPromise;
    const predictions = await model.detect(imageElement);
    const resultElement = document.getElementById("recognition-result");
    resultElement.textContent = predictions
      .map((prediction) => prediction.class)
      .join(", ");
  }

  async function runImageClassification(imageElement) {
    const model = await mobilenetModelPromise;
    const predictions = await model.classify(imageElement);
    const resultElement = document.getElementById("classification-result");
    resultElement.textContent = predictions[0].className;
  }

  async function extractTextFromImage() {
    const imageElement = document.getElementById("uploaded-image");
    const resultElement = document.getElementById("text-extraction-result");
    resultElement.innerHTML = ""; // Clear previous results

    // Show loading spinner
    const loadingSpinner = document.getElementById("loading-spinner");
    loadingSpinner.classList.add("show"); // Add 'show' class to display loading spinner

    Tesseract.recognize(imageElement, "eng", {
      logger: (m) => console.log(m),
    })
      .then(({ data: { text } }) => {
        // Hide loading spinner
        hideLoadingSpinner(); // Hide loading spinner

        if (text.trim() === "") {
          resultElement.textContent = "No text found";
        } else {
          const formattedText = text.split("\n").join("<br>"); // Insert <br> for line breaks
          resultElement.innerHTML = formattedText; // Use innerHTML to render HTML content
        }
      })
      .catch((error) => {
        console.error("Error extracting text:", error);
        hideLoadingSpinner(); // Hide loading spinner
        resultElement.textContent = "Error extracting text";
      });
  }

  function hideLoadingSpinner() {
    const loadingSpinner = document.getElementById("loading-spinner");
    loadingSpinner.classList.remove("show"); 
  }
  document
    .getElementById("file-input")
    .addEventListener("change", function (event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = async function (event) {
        const img = new Image();
        img.onload = async function () {
          document.getElementById("uploaded-image").src = img.src;
          await runObjectDetection(img);
          await runImageClassification(img);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });