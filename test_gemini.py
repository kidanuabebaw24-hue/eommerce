import requests
import json

url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBBoAQbXu3Nd7aovVOlnxSMA6P3tO6CpMU"
headers = {'Content-Type': 'application/json'}
data = {
    "contents": [{
        "parts": [{"text": "Hello, are you online?"}]
    }]
}

try:
    response = requests.post(url, headers=headers, data=json.dumps(data), timeout=10)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
