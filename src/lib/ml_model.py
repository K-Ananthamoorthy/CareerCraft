import sys
import json
import numpy as np
from tensorflow.keras.models import load_model
import pickle
import os
import traceback

# Set up logging
import logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

# Load the model and scaler
try:
    logging.info("Starting model and scaler loading")
    model_path = os.path.join(os.path.dirname(__file__), 'performance_prediction_model_final.h5')
    scaler_path = os.path.join(os.path.dirname(__file__), 'scaler_enhanced.pkl')
    
    logging.info(f"Model path: {model_path}")
    logging.info(f"Scaler path: {scaler_path}")
    
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found: {model_path}")
    if not os.path.exists(scaler_path):
        raise FileNotFoundError(f"Scaler file not found: {scaler_path}")
    
    model = load_model(model_path)
    logging.info("Model loaded successfully")
    
    with open(scaler_path, "rb") as scaler_file:
        scaler = pickle.load(scaler_file)
    logging.info("Scaler loaded successfully")
except Exception as e:
    logging.error(f"Error loading model or scaler: {str(e)}")
    logging.error(f"Current working directory: {os.getcwd()}")
    logging.error(traceback.format_exc())
    print(json.dumps({"error": str(e), "traceback": traceback.format_exc()}))
    sys.exit(1)

def preprocess_input(input_data):
    logging.info("Preprocessing input data")
    features = [
        "age", "attendance_rate", "average_test_score", "extracurricular_score",
        "coding_skill_score", "communication_score", "leadership_score", "internship_experience"
    ]
    try:
        input_array = [float(input_data[feature]) for feature in features]
        input_scaled = scaler.transform([input_array])
        return input_scaled
    except Exception as e:
        logging.error(f"Error in preprocess_input: {str(e)}")
        logging.error(f"Input data: {input_data}")
        logging.error(traceback.format_exc())
        raise

def predict(input_data):
    logging.info("Making prediction")
    try:
        preprocessed_input = preprocess_input(input_data)
        prediction = model.predict(preprocessed_input)[0][0]
        return float(prediction)
    except Exception as e:
        logging.error(f"Error in predict: {str(e)}")
        logging.error(traceback.format_exc())
        raise

def generate_insights(input_data):
    logging.info("Generating insights")
    strengths = []
    weaknesses = []
    recommendations = []

    try:
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
    except Exception as e:
        logging.error(f"Error in generate_insights: {str(e)}")
        logging.error(f"Input data: {input_data}")
        logging.error(traceback.format_exc())
        raise

def process_student_data(input_data):
    logging.info("Processing student data")
    try:
        prediction = predict(input_data)
        insights = generate_insights(input_data)
        
        return {
            "prediction": prediction,
            "insights": insights
        }
    except Exception as e:
        logging.error(f"Error in process_student_data: {str(e)}")
        logging.error(traceback.format_exc())
        raise

if __name__ == "__main__":
    logging.info("Script started")
    try:
        input_data = json.loads(sys.stdin.read())
        logging.info(f"Received input data: {input_data}")
        result = process_student_data(input_data)
        print(json.dumps(result))
        logging.info("Script completed successfully")
    except json.JSONDecodeError as e:
        logging.error(f"Error decoding JSON input: {str(e)}")
        print(json.dumps({"error": "Invalid JSON input", "details": str(e)}))
        sys.exit(1)
    except Exception as e:
        logging.error(f"Error processing data: {str(e)}")
        logging.error(traceback.format_exc())
        error_result = {
            "error": str(e),
            "traceback": traceback.format_exc()
        }
        print(json.dumps(error_result))
        sys.exit(1)

