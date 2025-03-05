from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import re
import string

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the trained model and vectorizer
model = joblib.load("multinomial_nb_model.pkl")
vectorizer = joblib.load("tfidata_vectorizer.pkl")

# Preprocessing function
def preprocess_text(text):
    text = text.lower()
    text = re.sub(f"[{string.punctuation}]", "", text)  # Remove punctuation
    return text

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

if __name__ == "__main__":
    app.run(debug=True)
