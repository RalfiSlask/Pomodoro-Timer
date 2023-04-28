let settings_button = document.querySelector(".settings");
let close_button = document.querySelector(".close");
let apply_button = document.querySelector(".apply-button");
let reset_button = document.querySelector(".reset");
let lightbox = document.querySelector(".lightbox");
let modal_settings = document.querySelector(".settings-modal");
let checkmarks = document.querySelectorAll(".checkmark");
let colorBoxes = document.querySelectorAll(".color-panel .box");
let fontBoxes = document.querySelectorAll(".fonts-panel .box");
let timerCircle = document.querySelector(".timer-circle");
let timeSettings = document.querySelectorAll("header div");
let times = document.querySelectorAll(".wrapper p");
let arrows_up = document.querySelectorAll(".select-panel .up");
let arrows_down = document.querySelectorAll(".select-panel .down");
let timeSettingsModal = document.querySelectorAll(".time-setting");
let active_header = document.querySelector(".active-header");
let body = document.querySelector("body");
let start_stop = document.querySelector(".pause");
let timers = document.querySelectorAll(".timer h2");
let display_seconds = document.querySelectorAll(".seconds");
let display_minutes = document.querySelectorAll(".minutes");
let timer_circle = document.querySelector(".timer-circle");
let circle_bar = document.querySelector(".circle-bar circle");
let circle_bar_tablet = document.querySelector(".circle-bar-tablet circle");

let colorTheme = "#F87070";
let count = 25;
let circlebarInterval;
let biggerCirclebarInterval;
let stroke_offset = 750;
let stroke_offset_bigger = 1005;

document.addEventListener("DOMContentLoaded", () => {
    clickingOnStartPauseButton();
    setInterval(isTimeZero, 0);
    clickingOnResetButton();
    clickingOnTimeSettings();
    clickingOnUpArrows();
    clickingOnDownArrows();
    openingSettings();
    closeSettings();
    clickingOnColorBoxes();
    clickingOnFontBoxes();
    clickingOnApplyButton();
    setInterval(updateColor, 0);
})

// Animating the circle bar //

const animateCirclebar = () => {
    stroke_offset -= (750/60);
    circle_bar.style.strokeDashoffset = `${stroke_offset}`
    if(stroke_offset < 0) {
        stroke_offset = 750;
    }
}

const animateBiggerCirclebar = () => {
    stroke_offset_bigger -= (1005/60);
    circle_bar_tablet.style.strokeDashoffset = `${stroke_offset_bigger}`
    if(stroke_offset_bigger < 0) {
        stroke_offset_bigger = 1005;
    }
}

const resetCirclebar = () => {
    stroke_offset = 750;
    circle_bar.style.strokeDashoffset = `${stroke_offset}`
    clearInterval(circlebarInterval);
}

const resetBiggerCirclebar = () => {
    stroke_offset_bigger = 1005;
    circle_bar_tablet.style.strokeDashoffset = `${stroke_offset_bigger}`
    clearInterval(biggerCirclebarInterval);
}


/* Time Settings */ 

let countdownInterval;
let time;
let minutes;
let isPaused = false;
let seconds;

const Timer = (mins, secs) => {
    minutes = Math.floor(time / 60);
    seconds = time % 60;
    time--
    mins.innerHTML = minutes;
    secs.innerHTML = seconds;
    if(secs.innerHTML.length == 1) {
        secs.innerHTML = "0" + seconds;
    }
}

const updateCountDown = (startingMinutes, mins, secs) => {
    if(!isPaused) {
        time = startingMinutes * 60;
        countdownInterval = setInterval(() => {
            Timer(mins, secs)
        }, 1000)
    } else if(isPaused) {
        countdownInterval = setInterval(() => {
            Timer(mins, secs)
        }, 1000)
    }
}

const changeOptionText = () => {
    if(start_stop.innerHTML == "START") {
        start_stop.innerHTML = "PAUSE"
    } else {
        start_stop.innerHTML = "START";
    }
}

const clickingOnStartPauseButton = () => {
    start_stop.addEventListener("click", () => {
        if(start_stop.innerHTML == "START") {
            circlebarInterval = setInterval(animateCirclebar, 1000);
            biggerCirclebarInterval = setInterval(animateBiggerCirclebar, 1000);
            for(let i = 0; i < display_minutes.length; i++) {
                if(timeSettings[i].classList.contains("active-header")) {
                    let startmin = parseInt(display_minutes[i].textContent);
                    updateCountDown(startmin, display_minutes[i], display_seconds[i]);
                }
            }
        } else if(start_stop.innerHTML == "RESTART") {
            for(let i = 0; i < display_minutes.length; i++) {
                resetTimers(display_seconds[i], display_minutes[i], times[i]);
            }     
            resetCirclebar();
            resetBiggerCirclebar();
            start_stop.innerHTML = "PAUSE";
        } else {
            isPaused = true;
            clearingTheIntervals();
        }
       changeOptionText();
    })
} 

const resetTimers = (seconds, minutes, times) => {
    start_stop.innerHTML = "START";
    minutes.innerHTML = times.innerHTML;
    seconds.innerHTML = "00";
    isPaused = false;
}

const clearingTheIntervals = () => {
    clearInterval(countdownInterval);
    clearInterval(circlebarInterval);
    clearInterval(biggerCirclebarInterval);
}

const isTimeZero = () => {
    for(let i = 0; i < display_minutes.length; i++) {
        if(display_minutes[i].innerHTML == "0" && display_seconds[i].innerHTML == "00") {
            start_stop.innerHTML = "RESTART";
            clearingTheIntervals();
        }
    }
}

const clickingOnResetButton = () => {
    reset_button.onclick = () => {
        for(let i = 0; i < timeSettings.length; i++) {
            if(timeSettings[i].classList.contains("active-header")) {
                clearingTheIntervals();
                resetTimers(display_seconds[i], display_minutes[i], times[i]);
                resetCirclebar();
                resetBiggerCirclebar();
            }
        }
    }
}

const clickingOnTimeSettings = () => {
    for(let i = 0; i < timeSettings.length; i++) {
        timeSettings[i].onclick = () => {
            resetTimers(display_seconds[i], display_minutes[i], times[i]);
            clearingTheIntervals();
            resetCirclebar();
            resetBiggerCirclebar();
            timeSettings.forEach(setting => {
                setting.classList.remove("active-header");
            })
            timeSettings[i].classList.toggle("active-header");
            timers.forEach(timer => {
                timer.classList.add("nodisplay");
            })
            timers[i].classList.toggle("nodisplay");
        }

    }
}

// Settings Modal JS //

const clickingOnUpArrows = () => {
    for(let i = 0; i < arrows_up.length; i++) {
        arrows_up[i].onclick = () => {
            count = parseInt(times[i].innerHTML);
            count++;
            if(timeSettingsModal[i].innerHTML == "pomodoro" && count > 60) {
                return;
            } else if(timeSettingsModal[i].innerHTML == "short break" && count > 10) {
                return;
            }  else if(timeSettingsModal[i].innerHTML == "long break" && count > 30) {
                return;
            } 
            times[i].innerHTML = count;
        }
    }
}

const clickingOnDownArrows = () => {
    for(let i = 0; i < arrows_down.length; i++) {
        arrows_down[i].onclick = () => {
            count = parseInt(times[i].innerHTML);
            count--;
            if(timeSettingsModal[i].innerHTML == "pomodoro" && count < 10) {
                return;
            } else if(timeSettingsModal[i].innerHTML == "short break" && count < 5) {
                return;
            }  else if(timeSettingsModal[i].innerHTML == "long break" && count < 15) {
                return;
            } 
            times[i].innerHTML = count;
        }
    }
}

const openingSettings = () => {
    settings_button.addEventListener("click", () => {
        lightbox.classList.toggle("hidden");
        modal_settings.classList.toggle("hidden");
    })
}

const closeSettings = () => {
    close_button.addEventListener("click", () => {
        lightbox.classList.toggle("hidden");
        modal_settings.classList.toggle("hidden");
    })
}

const clickingOnColorBoxes = () => {
    for(let i = 0; i < colorBoxes.length; i++) {
        colorBoxes[i].onclick = () => {
            colorBoxes.forEach(box => {
                box.classList.remove("active-color");
            })
            checkmarks.forEach(checkmark => {
            checkmark.classList.add("hidden")
           })
           checkmarks[i].classList.toggle("hidden");
           colorBoxes[i].classList.toggle("active-color");
        }
    }
}

const clickingOnFontBoxes = () => {
    for(let i = 0; i < fontBoxes.length; i++) {
        fontBoxes[i].onclick = () => {
            fontBoxes.forEach(box => {
                box.classList.remove("active-font");
            })
            fontBoxes[i].classList.toggle("active-font");
        }
    }
}

/* Styling Javascript */

const colorChanges = (theme) => {
    circle_bar.style.stroke = `${theme}`;
    circle_bar_tablet.style.stroke = `${theme}`;
}

const updateColor = () => {
    for(let i = 0; i < timeSettings.length; i++) {
        if(timeSettings[i].classList.contains("active-header")) {
            timeSettings[i].style.backgroundColor = `${colorTheme}`
        } else {
            timeSettings[i].style.backgroundColor = "#161932";
        }
        start_stop.onmouseover = () => {
            start_stop.style.color = `${colorTheme}`;
        }
        start_stop.onmouseleave = () => {
            start_stop.style.color = "#D7E0FF";
        }
    }
}

const changingColorTheme = (boxes) => {
    if(boxes.classList.contains("active-color")) {
        if(boxes.classList.contains("box-red")) {
            colorTheme = "#F87070";
        } else if(boxes.classList.contains("box-turquoise")) {
            colorTheme = "#70F3F8";
        } else if(boxes.classList.contains("box-purple")) {
            colorTheme = "#D881F8";
        }
        colorChanges(colorTheme);
    }
}

const changingFontTheme = (boxes) => {
    if(boxes.classList.contains("active-font")) {
        if(boxes.classList.contains("box-kumbh")) {
            body.style.fontFamily = "Kumbh Sans";
        } else if(boxes.classList.contains("box-roboto")) {
            body.style.fontFamily = "Roboto Slab";
        } else if(boxes.classList.contains("box-space")) {
            body.style.fontFamily = "Space Mono";
        }
    }
}

const clickingOnApplyButton = () => {
    apply_button.addEventListener("click", () => {
        for(let i = 0; i < colorBoxes.length; i++) {
            changingColorTheme(colorBoxes[i]);
            changingFontTheme(fontBoxes[i]);
            clearingTheIntervals();
            resetCirclebar();
            resetBiggerCirclebar();
            start_stop.innerHTML = "START"
            display_minutes[i].innerHTML = times[i].innerHTML;
            display_seconds[i].innerHTML = "00";
        }
    })
}




