import base64
import bson
import os
import json
import pymongo
import subprocess
import shlex
import uuid

from qiskit import Aer, ClassicalRegister, execute, QuantumCircuit, QuantumRegister

from bson import BSON
from bson.binary import Binary

mongo_client = pymongo.MongoClient(
    "mongodb+srv://{}:{}@{}".format(
        os.getenv("MONGO_USER"), os.getenv("MONGO_PASSWORD"), os.getenv("MONGO_URL")
    )
)
db = mongo_client.groovedb


def simulate_amplitude(circuit):
    """ Extract wave amplitudes from a quantum circuit simulation
    """

    simulator = Aer.get_backend("statevector_simulator")
    job = execute(circuit, backend=simulator)
    result = job.result()
    state_vector = result.get_statevector()

    pure_amplitude = [abs(i) for i in state_vector]
    max_amplitude = max(pure_amplitude)

    modulated_amplitude = [0.05 + (i / max_amplitude) ** 2 for i in pure_amplitude]
    return modulated_amplitude


def write_music(amplitude_list):
    """Generate music file from a modulated amplitude arrays"""
    power = 0
    while 2 ** power < len(amplitude_list):
        power += 1  # calculating 2^n = size of list

    with open("music.rb", "w") as music_file:

        music_file.write("power = {}\n".format(power))
        music_file.write("amplitudes = {}\n".format(amplitude_list))

        with open("template_music.rb", "r") as template_file:

            for line in template_file:
                music_file.write(line)


def execute_sonic():
    """ Calls the sonic-pi script to generate a song based on the amplitudes.
    """
    args = shlex.split("sh sonic_pi_execute.sh")
    result = subprocess.call(os.getcwd() + "/sonic_pi_execute.sh")
    return result


def save_to_db(file_used, file_type, document_id):

    coll = db.sample

    with open(file_used, "rb") as f:
        encoded = Binary(f.read())
        n = len(encoded)
        m = n // 16

    x = 0
    holder = 0

    while x < (n / m):
        sholder = encoded[int(holder) : min(int(holder + m), len(encoded))]
        holder = holder + m
        x = x + 1
        data = {
            "documentId": document_id,
            "content": sholder,
            "fileType": file_type,
            "fileChunk": x,
        }
        coll.insert(data)


def process_circuit(document_id, circuit_json):

    if circuit_json is not None:

        circuit = QuantumCircuit(circuit_json["numQubits"])

        if "append" in circuit_json:
            for gate_type, target in circuit_json["append"]:
                if gate_type == "x":
                    circuit.x(target[0])
                elif gate_type == "y":
                    circuit.y(target[0])
                elif gate_type == "z":
                    circuit.z(target[0])
                elif gate_type == "h":
                    circuit.h(target[0])
                elif gate_type == "cx":
                    circuit.cx(target[0], target[1])
                elif gate_type == "ccx":
                    circuit.ccx(target[0], target[1], target[2])
                elif gate_type == "barrier":
                    write_music(simulate_amplitude(circuit))
                    execute_sonic()
                    save_to_db("circsoud.wav", "audio", document_id)

        write_music(simulate_amplitude(circuit))
        execute_sonic()
        save_to_db("circsoud.wav", "audio", document_id)

        circuit.draw(output="mpl", filename="circuit_draw.png", scale=3)
        save_to_db("circuit_draw.png", "image", document_id)
