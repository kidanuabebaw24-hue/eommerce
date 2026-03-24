import urllib.request
import json
import ssl

url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCpKhs0sKbx2O7J7igILEnWRrddNs3m6JQ"
headers = {'Content-Type': 'application/json'}
data = {
    "contents": [{
        "parts": [{"text": "Hello, are you online?"}]
    }]
}

# Create a context to bypass SSL verification if needed (common in some restricted environments)
# context = ssl._create_unverified_context()

try:
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers, method='POST')
    with urllib.request.urlopen(req, timeout=10) as response:
        status_code = response.getcode()
        body = response.read().decode('utf-8')
        print(f"Status Code: {status_code}")
        print(f"Response: {body}")
except Exception as e:
    print(f"Error: {e}")
