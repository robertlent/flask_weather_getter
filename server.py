from flask import Flask, render_template, request
from weather import get_current_weather
from waitress import serve

app = Flask(__name__)


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')


@app.route('/weather')
def get_weather():
    city = request.args.get("city")
    state = request.args.get("state")
    country = request.args.get("country")
    err = False
    err_msg = ""

    if all([city is not None, city != '',
            state is not None, state != '',
            country is not None, country != '']):
        city = request.args.get('city').strip()
        state = request.args.get('state').strip()
        country = request.args.get('country').strip()
    else:
        err = True
        err_msg = 'City, State, or Country parameter was missing'
        city = 'San Francisco'
        state = 'CA'
        country = 'US'

    city = f'{city},{state},{country}'

    weather_data = get_current_weather(city)

    if not weather_data['cod'] == 200:
        err = True
        err_msg = f'I was unable to retrieve weather data for {city}'
        city = 'San Francisco,CA,US'
        weather_data = get_current_weather(city)

    return render_template(
        "weather.html",
        title=city,
        status=weather_data["weather"][0]["description"].capitalize(),
        temp=f"{weather_data['main']['temp']:.1f}",
        feels_like=f"{weather_data['main']['feels_like']:.1f}",
        err=err,
        err_msg=err_msg
    )


if __name__ == '__main__':
    serve(app, host="0.0.0.0", port=8000)
