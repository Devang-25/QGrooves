import base64
import os
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


def simulate_amplitude():
    return [1] * 32


def write_music(amplitude_list):

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
    pass
