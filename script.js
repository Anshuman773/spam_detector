// Show animations on page load
document.addEventListener('DOMContentLoaded', function() {
    let elements = document.querySelectorAll('.animated-element');
    elements.forEach(element => {
        element.classList.add('fade-in');
    });
});

// Character counter
const smsText = document.getElementById('smsText');
const currentLength = document.getElementById('currentLength');

smsText.addEventListener('input', function() {
    currentLength.textContent = this.value.length;
    if (this.value.length > 160) {
        currentLength.style.color = '#ef233c';
    } else {
        currentLength.style.color = '#6c757d';
    }
});

// Function to check spam
function checkSpam() {
    let smsText = document.getElementById("smsText").value;
    if (!smsText.trim()) {
        alert("Please enter a message to check.");
        return;
    }
    
    console.log("Sending SMS:", smsText);
    
    // Show loading state
    const button = document.querySelector('.check-button');
    const buttonText = button.querySelector('span');
    const loader = document.getElementById('loader');
    const resultsSection = document.getElementById('resultsSection');
    
    buttonText.textContent = 'Analyzing...';
    loader.style.display = 'inline-block';
    button.disabled = true;
    
    fetch("https://spam-detector-mz19.onrender.com/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: smsText })
})

    .then(response => {
        console.log("Raw Response:", response);
        return response.json();
    })
    .then(data => {
        // Reset button state
        buttonText.textContent = 'Check SMS';
        loader.style.display = 'none';
        button.disabled = false;
        
        // Show results with animation
        resultsSection.classList.add('show');
        
        const resultElement = document.getElementById("predictionResult");
        resultElement.innerText = data.result;
        
        // Apply different styles based on result
        if (data.result.toLowerCase()===('spam')) {
            resultElement.className = 'spam';
            resultElement.innerHTML = '<i class="fas fa-exclamation-triangle"></i> ' + data.result;
        } else {
            resultElement.className = 'ham';
            resultElement.innerHTML = '<i class="fas fa-check-circle"></i> ' + data.result;
        } 
        
        console.log("Server Response:", data);
    })
    .catch(error => {
        console.error("Error:", error);
        // Reset button state
        buttonText.textContent = 'Check SMS';
        loader.style.display = 'none';
        button.disabled = false;
        
        // Show error message
        document.getElementById("predictionResult").innerText = "Error connecting to server";
        document.getElementById("predictionResult").className = 'spam';
        resultsSection.classList.add('show');
    });
}
