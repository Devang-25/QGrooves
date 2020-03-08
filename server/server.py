#!flask/bin/python
from flask import Flask, request

app = Flask(__name__)


@app.route("/", methods=["GET"])
def index():
    """Receives a request with a quantum circuit, generates music,
    and saves the .wav file to MongoDB
    """
    user_id = request.args.get("userId")
    circuit_json = request.args.get("circuitJson")

    return {"test": 0}


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80)
