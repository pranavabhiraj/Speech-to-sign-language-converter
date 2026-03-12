from flask import Flask, render_template, request, jsonify
import re

app = Flask(__name__)

def tokenize(text):
    return re.findall(r"[A-Za-z']+", text.lower())

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/process", methods=["POST"])
def process():
    data = request.get_json(force=True)
    text = data.get("text","")
    return jsonify({"text": text, "words": tokenize(text)})

if __name__ == "__main__":
    app.run(debug=True)
