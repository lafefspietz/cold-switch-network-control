import base64
import copy
import io
import json
from pathlib import Path
import socket
import time
import urllib.parse
import urllib.request
import serial

import matplotlib.pyplot as plt
import numpy as np
with open("instrument.json", "r", encoding="utf-8") as file:
    file_contents = file.read()
instrument = json.loads(file_contents)
previous_instrument = copy.deepcopy(instrument)

python_response = {}
python_response['data'] = {}

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server:
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.bind(('127.0.0.1', 8000))
    server.listen(5)
    server.settimeout(0.5)
    print("=== LIVE SERVER ACTIVE ===")
    try:
        while True:
            try:
                conn, addr = server.accept()
            except socket.timeout:
                continue 
            with conn:
                raw_web_input = conn.makefile('r', encoding='utf-8').readline()
                if not raw_web_input:
                    continue
                try:
                    instrument = json.loads(raw_web_input.strip())
                except (json.JSONDecodeError, ValueError):
                    pass
                
                python_response['image'] = imagedata                
                payload = json.dumps(python_response) + "\n"
                conn.sendall(payload.encode('utf-8'))
                conn.shutdown(socket.SHUT_WR)
                previous_instrument = copy.deepcopy(instrument)

    except KeyboardInterrupt:
        print("\n=== SERVER TERMINATED CLEANLY BY USER ===")