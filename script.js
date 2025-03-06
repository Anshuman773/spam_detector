document.addEventListener("DOMContentLoaded", function () {
    // Show animations on page load
    let elements = document.querySelectorAll(".animated-element");
    elements.forEach((element) => {
        element.classList.add("fade-in");
    });

    // Character counter
    const smsText = document.getElementById("smsText");
    const currentLength = document.getElementById("currentLength");

    if (smsText && currentLength) {
        smsText.addEventListener("input", function () {
            currentLength.textContent = this.value.length;
            currentLength.style.color = this.value.length > 160 ? "#ef233c" : "#6c757d";
        });
    }

    // Spam check function
    document.querySelector(".check-button").addEventListener("click", checkSpam);
});

function checkSpam() {
    const smsTextElement = document.getElementById("smsText");
    const smsText = smsTextElement ? smsTextElement.value.trim() : "";

    if (!smsText) {
        alert("Please enter a message to check.");
        return;
    }

    console.log("Sending SMS:", smsText);

    // UI elements
    const button = document.querySelector(".check-button");
    const buttonText = button ? button.querySelector("span") : null;
    const loader = document.getElementById("loader");
    const resultsSection = document.getElementById("resultsSection");
    const resultElement = document.getElementById("predictionResult");

    if (!button || !buttonText || !loader || !resultsSection || !resultElement) {
        console.error("Some required elements are missing from the DOM.");
        return;
    }

    // Show loading state
    buttonText.textContent = "Analyzing...";
    loader.style.display = "inline-block";
    button.disabled = true;

    fetch("https://spamdetector-lovat.vercel.app/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: smsText }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log("Server Response:", data);

            // Reset button state
            buttonText.textContent = "Check SMS";
            loader.style.display = "none";
            button.disabled = false;

            // Show results
            resultsSection.classList.add("show");
            resultElement.innerHTML = `<i class="fas ${
                data.result.toLowerCase() === "spam" ? "fa-exclamation-triangle spam" : "fa-check-circle ham"
            }"></i> ${data.result}`;
        })
        .catch((error) => {
            console.error("Error:", error);

            // Reset button state
            buttonText.textContent = "Check SMS";
            loader.style.display = "none";
            button.disabled = false;

            // Show error message
            resultElement.innerHTML = '<i class="fas fa-times-circle spam"></i> Error connecting to server';
            resultsSection.classList.add("show");
        });
}
