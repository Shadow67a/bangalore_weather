var temp = document.getElementById("temprature");
var details = document.getElementById("details");
var weather_key = "";
var openai_key = "";

var state = "";
var interval_count = 0;
var time = "";

function fetch_temp() {
  var today = new Date();
  var curHr = today.getHours();

  if (curHr < 4) {
    time = "night";
  } else if (curHr < 12) {
    time = "morning";
  } else if (curHr < 16) {
    time = "afternoon";
  } else if (curHr < 19) {
    time = "evening";
  } else if (curHr < 23) {
    time = "night";
  }

  fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=bangalore&units=metric&appid=" + weather_key
  )
    .then((res) => res.json())
    .then((res) => {
      temp.innerText = ~~res.main.temp + "°";
      state = res.weather[0].description;
    });

  if (interval_count < 4) {
    interval_count += 1;
  } else {
    interval_count = 0;
    fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        Authorization:
          "Bearer " + openai_key,
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        model: "text-davinci-003",
        prompt:
          "Write a sentence based on a weather prompt and the time given:\nPrompt: Partialy cloudy, Morning\nSentence: Clouds and the Sun share the sky\nPrompt: Light rain, evening\nSentence: The cold rain and dark clouds cover the evening sky\nPrompt: Sun, Morning\nSentence: The Sun is out and shining with vigour!\nPrompt: Thunderstorm, night\nSentence: The thunders of the storm echo through the night sky\nPrompt: Extreme heat, night\nSentence: It's impossible to get some sleep in this heat\nPrompt: Scattered Clouds, afternoon\nSentence:  The clouds scatter across the afternoon sky\nPrompt: Clouds, night\nSentence: The stars are unable to be seen due to the clouds." +
          state +
          ", " +
          time +
          "\nSentence: ",
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    })
      .then((res) => res.json())
      .then((res) => {
        details.innerText = "//" + res.choices[0].text.slice(1);
      });
  }
}

fetch_temp();
fetch("https://api.openai.com/v1/completions", {
  method: "POST",
  headers: {
    Authorization: "Bearer " + openai_key,
    "Content-Type": "application/json"
  },

  body: JSON.stringify({
    model: "text-davinci-003",
    prompt:
      "Write a sentence based on a weather prompt and the time given:\nPrompt: Partialy cloudy, Morning\nSentence: Clouds and the Sun share the sky\nPrompt: Light rain, evening\nSentence: The cold rain and dark clouds cover the evening sky\nPrompt: Sun, Morning\nSentence: The Sun is out and shining with vigour!\nPrompt: Thunderstorm, night\nSentence: The thunders of the storm echo through the night sky\nPrompt: Extreme heat, night\nSentence: It's impossible to get some sleep in this heat\nPrompt: Scattered Clouds, afternoon\nSentence:  The clouds scatter across the afternoon sky\nPrompt: Clouds, night\nSentence: The stars are unable to be seen due to the clouds." +
      state +
      ", " +
      time +
      "\nSentence: ",
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  })
})
  .then((res) => res.json())
  .then((res) => {
    details.innerText = "//" + res.choices[0].text.slice(1);
  });
setInterval(fetch_temp, 15000);
