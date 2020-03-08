#Hack Tech 2020
import pymongo
import base64
import bson
from bson import BSON
from bson.binary import Binary
import os
# establish a connection to the database
connection = pymongo.MongoClient()

#get a handle to the test database
db = connection.test
file_meta = db.file_meta
file_used = "ExampleFile.wav"
def getDiv(number):

    holder = 0;
    for i in range(1, number):
        if number % i == 0:
            holder = i;
    return holder;
def main():
    coll = db.sample
    with open(file_used, "rb") as f:
        encoded = Binary(f.read())
        n = len(encoded);
        m = getDiv(n)
        list = [];
    x = 0;
    holder = 0;

    while x < (n/m):
        sholder = encoded[int(holder):int(holder+m)]
        holder = holder + m
        x = x +1
        data = {"filename": file_used, "file": sholder, "description": "test" }
        coll.insert(data)
main()
    #""""data = {"filename": file_used, "file": encoded, "description": "test" }
    #data = json.dumps(data, indent=4) #BSON.encode(data)"""
