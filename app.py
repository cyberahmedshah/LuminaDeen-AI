from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)


with open("mind.json", "r") as f:
    data = json.load(f)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/ask', methods=['POST'])
def ask():
    question = request.json.get('question').lower()  
    answer = "I don't know the answer to that."      

    if "name" in question:
        answer = data['name']
    if "purpose" in question:
        answer = data['purpose']
    if "hey" in question:
        answer = data['hey']

    return jsonify({'answer': answer})

if __name__ == '__main__':
    app.run(debug=True)