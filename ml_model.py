import sys
import json
import numpy as np
from tensorflow.keras.models import load_model
import pickle
import os
import traceback

# Load the model and scaler
try:
    model_path = os.path.join(os.path.dirname(__file__), 'performance_prediction_model_final.h5')
    scaler_path = os.path.join(os.path.dirname(__file__), 'scaler_enhanced.pkl')
    
    model = load_model(model_path)
    with open(scaler_path, "rb") as scaler_file:
        scaler = pickle.load(scaler_file)
except Exception as e:
    print(f"Error loading model or scaler: {str(e)}", file=sys.stderr)
    print(f"Current working directory: {os.getcwd()}", file=sys.stderr)
    print(f"Model path: {model_path}", file=sys.stderr)
    print(f"Scaler path: {scaler_path}", file=sys.stderr)
    print(traceback.format_exc(), file=sys.stderr)
    sys.exit(1)

def preprocess_input(input_data):
    features = [
        "age", "attendance_rate", "average_test_score", "extracurricular_score",
        "coding_skill_score", "communication_score", "leadership_score", "internship_experience"
    ]
    input_array = [float(input_data[feature]) for feature in features]
    input_scaled = scaler.transform([input_array])
    return input_scaled

def predict(input_data):
    preprocessed_input = preprocess_input(input_data)
    prediction = model.predict(preprocessed_input)[0][0]
    return float(prediction)

def generate_insights(input_data):
    strengths = []
    weaknesses = []
    recommendations = []

    if input_data["average_test_score"] >= 85:
        strengths.append("Strong academic performance.")
    else:
        weaknesses.append("Needs improvement in academic performance.")
        recommendations.append("Establish regular study habits and use active recall techniques.")

    if input_data["attendance_rate"] >= 90:
        strengths.append("Excellent attendance rate.")
    elif input_data["attendance_rate"] < 75:
        weaknesses.append("Low attendance rate.")
        recommendations.append("Improve attendance by prioritizing classes and managing time effectively.")

    if input_data["coding_skill_score"] >= 8:
        strengths.append("Excellent coding skills.")
    elif input_data["coding_skill_score"] < 5:
        weaknesses.append("Limited coding skills.")
        recommendations.append("Start with beginner programming courses and practice regularly.")

    if input_data["communication_score"] >= 8:
        strengths.append("Strong communication skills.")
    elif input_data["communication_score"] < 5:
        weaknesses.append("Needs improvement in communication.")
        recommendations.append("Practice public speaking and engage in group discussions.")

    if input_data["leadership_score"] >= 8:
        strengths.append("Excellent leadership qualities.")
    elif input_data["leadership_score"] < 5:
        weaknesses.append("Limited leadership experience.")
        recommendations.append("Take on leadership roles in student organizations or group projects.")

    if input_data["internship_experience"] >= 6:
        strengths.append("Valuable internship experience.")
    elif input_data["internship_experience"] == 0:
        weaknesses.append("No internship experience.")
        recommendations.append("Apply for internships or seek part-time work in your field of study.")

    return {
        "Strengths": strengths,
        "Weaknesses": weaknesses,
        "Recommendations": recommendations
    }

def process_student_data(input_data):
    prediction = predict(input_data)
    insights = generate_insights(input_data)
    
    return {
        "prediction": prediction,
        "insights": insights
    }

if __name__ == "__main__":
    try:
        input_data = json.loads(sys.stdin.read())
        result = process_student_data(input_data)
        print(json.dumps(result))
    except Exception as e:
        print(f"Error processing data: {str(e)}", file=sys.stderr)
        print(traceback.format_exc(), file=sys.stderr)
        sys.exit(1)

