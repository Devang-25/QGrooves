#!flask/bin/python
import uuid

from flask import Flask, request
from qgroove import process_circuit

app = Flask(__name__)


@app.route("/", methods=["GET"])
def index():
    """Receives a request with a quantum circuit, generates music,
    and saves the .wav file to MongoDB
    """
    circuit_json = request.args.get("circuitJson")
    document_id = str(uuid.uuid4())

    process_circuit(document_id, circuit_json)

    return document_id


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80)
