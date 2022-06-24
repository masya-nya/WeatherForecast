const buttonRefresh = document.querySelector('.refresh__button')

let types = {
    "clear": '01d.png',
    "few clouds": '02d.png',
    "scattered clouds": '03d.png',
    "broken clouds": '04d.png',
    "overcast clouds": '04d.png',
    "clouds": '04d.png',
    "shower rain": '09d.png',
    "rain": '10d.png',
    "thunderstorm": '11d.png',
    "snow": '13d.png',
}

document.addEventListener("DOMContentLoaded", refresh)

async function getHistory() {
    let obj = {}
    let dt = Math.floor(new Date().getTime() / 1000) - 86400
    for(let i = 0; i < 5; i++) {
        let historyForecastJson = await fetch(`https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=47.2313&lon=39.7233&dt=${dt}&units=metric&appid=8b701928e6d1dd8b545ff91022ee6fdd&only_current={true}`)
        let historyForecastData = await historyForecastJson.json()
        let date = historyForecastData.current
        //console.log(`History forecast day${i+1}`,date)
        obj['dt' + i] = date.dt
        obj['temp' + i] = date.temp
        dt -= 86400
    }
    return obj
}

async function refresh() {
    const url = 'https://api.openweathermap.org/data/2.5/onecall?lat=47.2313&lon=39.7233&units=metric&exclude=current,minutely,hourly,alerts&appid=8b701928e6d1dd8b545ff91022ee6fdd'
    let weatherJSON = await fetch(url);
    let weatherData = await weatherJSON.json();
    let data = weatherData.daily;
    const historyWeather = await getHistory()
    //console.log('OneCallAPI:',data);
    Vue.createApp({
        data() {
            return {
                averageTemp: `${((data[1].temp.day + data[2].temp.day + data[3].temp.day) / 3).toFixed(0)}`,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
                feelsLikeDayOne: data[0].feels_like.day.toFixed(0),
                dateDayOne: `${getTime(data[1].dt).substr(0, 5)}`,
                dateDayTwo: `${getTime(data[2].dt).substr(0, 5)}`,
                dateDayThree: `${getTime(data[3].dt).substr(0, 5)}`,
                tempDay: data[0].temp.day.toFixed(0),
                tempDayOne: data[1].temp.day.toFixed(0),
                tempDayTwo: data[2].temp.day.toFixed(0),
                tempDayThree: data[3].temp.day.toFixed(0),
                tempNightDayOne: data[1].temp.night.toFixed(0),
                tempNightDayTwo: data[2].temp.night.toFixed(0),
                tempNightDayThree: data[3].temp.night.toFixed(0),
                descriptionDayOne: data[1].weather[0].description,
                descriptionDayTwo: data[2].weather[0].description,
                descriptionDayThree: data[3].weather[0].description,
                srcImageDateOne: `http://openweathermap.org/img/wn/${types[(data[1].weather[0].main).toLowerCase()]}`,
                srcImageDateTwo: `http://openweathermap.org/img/wn/${types[(data[2].weather[0].main).toLowerCase()]}`,
                srcImageDateThree: `http://openweathermap.org/img/wn/${types[(data[3].weather[0].main).toLowerCase()]}`,
                srcImageDate: `http://openweathermap.org/img/wn/${types[(data[0].weather[0].main).toLowerCase()]}`
            }
        },
        mounted() {
            setInterval(() => {
                this.changeData()
            }, 60000)
        },
        methods: {
            async changeData() {
                const url = 'https://api.openweathermap.org/data/2.5/onecall?lat=47.2313&lon=39.7233&units=metric&exclude=current,minutely,hourly,alerts&appid=8b701928e6d1dd8b545ff91022ee6fdd'
                let weatherJSON = await fetch(url);
                let weatherData = await weatherJSON.json();
                let data = weatherData.daily;
                let types = {
                    "clear": '01d.png',
                    "few clouds": '02d.png',
                    "scattered clouds": '03d.png',
                    "broken clouds": '04d.png',
                    "overcast clouds": '04d.png',
                    "clouds": '04d.png',
                    "shower rain": '09d.png',
                    "rain": '10d.png',
                    "thunderstorm": '11d.png',
                    "snow": '13d.png',
                }
                this.averageTemp = `${((data[1].temp.day + data[2].temp.day + data[3].temp.day) / 3).toFixed(0)}`;
                this.date = new Date().toLocaleDateString();
                this.time = new Date().toLocaleTimeString();
                this.feelsLikeDayOne = data[0].feels_like.day.toFixed(0);
                this.dateDayOne = `${getTime(data[1].dt).substr(0, 5)}`;
                this.dateDayTwo = `${getTime(data[2].dt).substr(0, 5)}`;
                this.dateDayThree = `${getTime(data[3].dt).substr(0, 5)}`;
                this.tempDay = data[0].temp.day.toFixed(0);
                this.tempDayOne = data[1].temp.day.toFixed(0);
                this.tempDayTwo = data[2].temp.day.toFixed(0);
                this.tempDayThree = data[3].temp.day.toFixed(0);
                this.tempNightDayOne = data[1].temp.night.toFixed(0);
                this.tempNightDayTwo = data[2].temp.night.toFixed(0);
                this.tempNightDayThree = data[3].temp.night.toFixed(0);
                this.descriptionDayOne = data[1].weather[0].description;
                this.descriptionDayTwo = data[2].weather[0].description;
                this.descriptionDayThree = data[3].weather[0].description;
                this.srcImageDateOne = `http://openweathermap.org/img/wn/${types[(data[1].weather[0].main).toLowerCase()]}`;
                this.srcImageDateTwo = `http://openweathermap.org/img/wn/${types[(data[2].weather[0].main).toLowerCase()]}`;
                this.srcImageDateThree = `http://openweathermap.org/img/wn/${types[(data[3].weather[0].main).toLowerCase()]}`;
                console.log('Changed')
            }
        }

    }).mount('#info')
    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: [`${getTime(historyWeather.dt4)}`, 
                     `${getTime(historyWeather.dt3)}`, 
                     `${getTime(historyWeather.dt2)}`, 
                     `${getTime(historyWeather.dt1)}`, 
                     `${getTime(historyWeather.dt0)}`],
            datasets: [{
                label: 'Средняя температура на день',
                data: [historyWeather.temp4, 
                       historyWeather.temp3, 
                       historyWeather.temp2, 
                       historyWeather.temp1, 
                       historyWeather.temp0],
                backgroundColor: [
                    'rgba(255, 165, 0, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 140, 0)',
                ],
                borderWidth: 3
            }]
        },
        options: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Средняя погода в Ростове-на-Дону за последние 5 дней',
                position: 'top',
                fontSize: 16,
                padding: 40
            },
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0,
                        max: 50
                    }
                }]
            }
        }
    });
}
function getTime(unix) {
    let a = new Date(unix * 1000)
    let year = a.getFullYear().toString().substr(2);
    let month = a.getMonth() + 1;
    let date = a.getDate();
    return date + '.' + '0' + month + '.' + year;
}
function getUnix() {
    return Math.floor(new Date('2022.06.18').getTime() / 1000)
}
