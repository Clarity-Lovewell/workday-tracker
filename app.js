const STORAGE_KEY = "workdaytracker";

function saveField(id) {
    localStorage.setItem(
        STORAGE_KEY + "_" + id,
        document.getElementById(id).value
    );
}

function loadField(id, defaultValue = "") {

    const value =
        localStorage.getItem(STORAGE_KEY + "_" + id);

    document.getElementById(id).value =
        value ?? defaultValue;
}

loadField("startTime");
loadField("breakStart");
loadField("breakEnd");
loadField("dailyHours", "7.5");

const finishTime =
    document.getElementById("finishTime");

const workedToday =
    document.getElementById("workedToday");

function calculate() {

    const startValue =
        document.getElementById("startTime").value;

    if (!startValue) {

        finishTime.textContent = "--:--";

        workedToday.textContent =
            "Enter a start time";

        document
            .getElementById("progressFill")
            .style.width = "0%";

        document
            .getElementById("progressText")
            .textContent = "0%";

        return;
    }

    const workHours =
        parseFloat(
            document.getElementById("dailyHours").value
        ) || 7.5;

    const today = new Date();

    const start = new Date(today);

    const [sh, sm] =
        startValue.split(":");

    start.setHours(
        Number(sh),
        Number(sm),
        0,
        0
    );

    let breakMinutes = 0;

    const breakStart =
        document.getElementById("breakStart").value;

    const breakEnd =
        document.getElementById("breakEnd").value;

    if (breakStart && breakEnd) {

        const bs = new Date(today);
        const be = new Date(today);

        const [bsh, bsm] =
            breakStart.split(":");

        const [beh, bem] =
            breakEnd.split(":");

        bs.setHours(
            Number(bsh),
            Number(bsm),
            0,
            0
        );

        be.setHours(
            Number(beh),
            Number(bem),
            0,
            0
        );

        breakMinutes =
            (be - bs) / 60000;
    }

    const finishDate =
    document.getElementById(
    "calculationText"
    ).innerHTML =

    `${startValue} start<br>
    + ${workHours}h target<br>
    + ${Math.round(breakMinutes)}m break<br><br>
    = ${finishDate.toLocaleTimeString(
    "en-AU",
    {
    hour:"numeric",
    minute:"2-digit",
    hour12:true
    }
    )}`;
        new Date(
            start.getTime()
            + workHours * 3600000
            + breakMinutes * 60000
        );

        

    finishTime.textContent =
    finishDate.toLocaleTimeString(
        "en-AU",
        {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        }
    );

    let workedHours = 0;

    const now = new Date();

    if (now > start) {

        workedHours =
            (now - start) / 3600000;

        workedHours -=
            breakMinutes / 60;
    }

    workedToday.textContent =
        workedHours.toFixed(2)
        + " hrs worked";

    const workedMinutes =
    Math.max(
    0,
    Math.round(workedHours * 60)
    );

    const remainingMinutes =
    Math.max(
    0,
    Math.round(
    (workHours * 60)
    - workedMinutes
    )
    );

    document.getElementById(
    "workedHours"
    ).textContent =
    `${Math.floor(workedMinutes/60)}h ${workedMinutes%60}m`;

    document.getElementById(
    "breakDisplay"
    ).textContent =
    `${Math.round(breakMinutes)}m`;

    document.getElementById(
    "remainingDisplay"
    ).textContent =
    `${Math.floor(remainingMinutes/60)}h ${remainingMinutes%60}m`;
        
    const progress =
        Math.max(
            0,
            Math.min(
                workedHours / workHours * 100,
                100
            )
        );

    document
        .getElementById("progressFill")
        .style.width =
        progress + "%";

    document
        .getElementById("progressText")
        .textContent =
        `${progress.toFixed(0)}% Complete`;

    if(progress >= 100){

    finishTime.textContent =
    "🎉 DONE";

    workedToday.textContent =
    "You've completed your day";
}
}

[
    "startTime",
    "breakStart",
    "breakEnd",
    "dailyHours"
].forEach(id => {

    document
        .getElementById(id)
        .addEventListener("input", () => {

            saveField(id);
            calculate();
        });
});

function currentTime() {

    return new Date()
        .toLocaleTimeString(
            "en-GB",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );
}

document
    .getElementById("startNowBtn")
    .onclick = () => {

        document
            .getElementById("startTime")
            .value =
            currentTime();

        saveField("startTime");

        calculate();
    };

document
    .getElementById("breakNowBtn")
    .onclick = () => {

        document
            .getElementById("breakStart")
            .value =
            currentTime();

        saveField("breakStart");

        calculate();
    };

document
    .getElementById("resumeNowBtn")
    .onclick = () => {

        document
            .getElementById("breakEnd")
            .value =
            currentTime();

        saveField("breakEnd");

        calculate();
    };

document
    .getElementById("resetBtn")
    .onclick = () => {

        [
            "startTime",
            "breakStart",
            "breakEnd"
        ].forEach(id => {

            document
                .getElementById(id)
                .value = "";

            localStorage.removeItem(
                STORAGE_KEY + "_" + id
            );
        });

        calculate();
    };

calculate();

setInterval(calculate, 30000);

if ("serviceWorker" in navigator) {

    navigator.serviceWorker.register(
        "./service-worker.js"
    );
}
