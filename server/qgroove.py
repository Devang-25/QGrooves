import base64
import os
import json
import pymongo
import subprocess
import shlex
import uuid

from qiskit import Aer, ClassicalRegister, execute, QuantumCircuit, QuantumRegister

# mongo_client = pymongo.MongoClient(
#    "mongodb+srv://{}:{}@{}".format(
#        os.getenv("MONGO_USER"), os.getenv("MONGO_PASSWORD"), os.getenv("MONGO_URL")
#    )
# )
# db = mongo_client.groovedb


def simulate_amplitude(circuit):
    """ Extract wave amplitudes from a quantum circuit simulation
    """

    simulator = Aer.get_backend("statevector_simulator")
    job = execute(circuit, backend=simulator)
    result = job.result()
    state_vector = result.get_statevector()

    pure_amplitude = [abs(i) for i in state_vector]
    max_amplitude = max(pure_amplitude)

    modulated_amplitude = [0.25 + (i / max_amplitude) ** 2 for i in pure_amplitude]
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


def save_to_db():
    pass


def process_circuit(document_id, circuit_json):

    circuit = QuantumCircuit(5)
    circuit.h(range(5))
    circuit.cx(0, 1)
    circuit.draw(output="mpl", filename="circuit_draw.png", scale=2.5)

    write_music(simulate_amplitude(circuit))
    execute_sonic()
