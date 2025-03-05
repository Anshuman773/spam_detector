from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import joblib
import re
import string
import os  # Import os to get Render's assigned port

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Load model
model = joblib.load("multinomial_nb_model.pkl")
vectorizer = joblib.load("tfidata_vectorizer.pkl")

# Preprocessing function
def preprocess_text(text):
    text = text.lower()
    text = re.sub(f"[{string.punctuation}]", "", text)
    return text

# ✅ Serve index.html directly from the root folder
@app.route("/")
def home():
    return send_file("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({'error': 'No message provided'}), 400

    message = data["message"]
    processed_msg = preprocess_text(message)
    vectorized_msg = vectorizer.transform([processed_msg])
    prediction = model.predict(vectorized_msg)[0]
    result = "spam" if prediction == 1 else "ham"

    return jsonify({"result": result})

# ✅ Fix: Bind Flask to the correct port for Render
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))  # Get the port from Render
    app.run(host="0.0.0.0", port=port, debug=True)  # Bind to all interfaces
