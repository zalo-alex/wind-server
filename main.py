from datetime import timedelta
from src.date import now, to_timestamp
from src.nmea.manager import Manager

from flask import Flask, render_template
import sqlite3
import dotenv
import os

dotenv.load_dotenv()

conn = sqlite3.connect("data.sqlite3", check_same_thread=False)
manager = Manager(conn)

app = Flask(__name__)

@app.route(f"/{os.getenv('NMEA_PATH_KEY')}/<nmea_sentence>")
def nmea(nmea_sentence):
    manager.save(nmea_sentence)
    
    return ""

@app.route('/')
def index():
    return render_template("base.html")

@app.route("/wind/<delta>")
def wind(delta):
    
    return manager.from_delta(delta)

@app.route("/wind/last")
def wind_last():
    
    return {"data": manager.last()}

if __name__ == '__main__':
    app.run(debug=True)