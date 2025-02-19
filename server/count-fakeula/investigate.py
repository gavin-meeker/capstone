#!/bin/python3

# Quick and dirty Flask app to test IOC extraction.
# Usage: python investigate.py -d

import argparse
import requests
import json

from flask import Flask, request

app = Flask(__name__)

input_box_html = """
<form method=POST>
<textarea name=query rows=10 cols=80>%s</textarea>
<br><br>
Defang? <input type=checkbox name=defang %s><br><br>
<input type=submit value="Search">
</form>
"""

def extract(text, defang):
    if defang:
        url = "http://localhost:7000/extract?defang=1"
    else:
        url = "http://localhost:7000/extract"
    r = requests.post(
        url,
        data=text,
        auth=('user', 'pass'),
        headers = { 'Content-Type' : 'text/plain' }
    )
    return r.json()

@app.route('/', methods=['POST', 'GET'])
def main():
    if request.method == 'POST':
        query = request.form.get('query')
        defang = request.form.get('defang')
        if defang:
            defang = "checked"
        return_html = input_box_html % (query, defang)
        extracted_data = extract(query, defang)
        return_html += '<table border=1>\n'
        return_html += '<tr><th>IOC</th><th>Type</th></tr>\n'
        for ioc in extracted_data.get('data', []):
            description = ioc['threat']['indicator']['description']
            _type = ioc['threat']['indicator']['type']
            return_html += f"<tr><td>{description}</td><td>{_type}</td></tr>\n"
        return_html += "</table>\n"

        return return_html
    else:
        return input_box_html % ("", "")

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("-d", "--debug", action='store_true',
            help="Run in debug mode")
    parser.add_argument("-p", "--port", type=int,
            help="Port to listen on (default 5000 for production or 7000 for debug)")
    args = parser.parse_args()

    print("Starting server...", flush=True)

    port = args.port if args.port else 7001
    app.run(port=port, host='0.0.0.0', debug=args.debug)
