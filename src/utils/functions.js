export const timeDiffString = (timeCreated) => {
  const timeNow = new Date().getTime();
  const seconds = Math.floor((timeNow - timeCreated) / 1000);

  let output = "";
  let data = {
    year: { multiple: 0, secs: 60 * 60 * 24 * 365 },
    day: { multiple: 0, secs: 60 * 60 * 24 },
    hour: { multiple: 0, secs: 60 * 60 },
    minute: { multiple: 0, secs: 60 },
    second: { multiple: 0, secs: 1 },
  };
  //recurring function to get time
  function timeCascade(seconds, data) {
    if (seconds <= 59) {
      data.second.multiple = seconds;
      seconds = 0;
      return;
    }
    for (const measure in data) {
      if (seconds >= data[measure].secs) {
        data[measure].multiple++;
        seconds -= data[measure].secs;

        return timeCascade(seconds, data);
      }
    }
  }

  timeCascade(seconds, data);

  //format string output
  for (const measure in data) {
    if (data[measure].multiple) {
      if (output.length)
        measure === "second" ? (output += " and ") : (output += ", ");
      if (measure === "year") output += "over ";
      data[measure].multiple === 1
        ? (output += `${data[measure].multiple} ${measure}`)
        : (output += `${data[measure].multiple} ${measure}s`);
      return (output += " ago");
    }
  }
};
