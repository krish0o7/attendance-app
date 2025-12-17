// ================= TIMETABLE =================
const timetable = {
  "Monday": [
    { subject: "DAA LAB", time: "10:30" },
    { subject: "CO", time: "11:30" },
    { subject: "ID (Online)", time: "14:30" },
    { subject: "OOPJ", time: "15:30" }
  ],
  "Tuesday": [
    { subject: "CO", time: "09:30" },
    { subject: "DAA", time: "10:30" },
    { subject: "GChem", time: "11:30" },
    { subject: "OOPJ", time: "12:30" },
    { subject: "BML LAB", time: "16:30" }
  ],
  "Wednesday": [
    { subject: "MATH LAB", time: "09:30" },
    { subject: "OOPJ", time: "14:30" },
    { subject: "DAA", time: "15:30" },
    { subject: "GChem", time: "16:30" }
  ],
  "Thursday": [
    { subject: "DAA", time: "09:30" },
    { subject: "GChem", time: "10:30" },
    { subject: "CO", time: "11:30" },
    { subject: "OOPJ", time: "12:30" },
    { subject: "OOPJ LAB", time: "16:30" }
  ],
  "Friday": [
    { subject: "SDE", time: "09:30" },
    { subject: "DAA", time: "14:30" },
    { subject: "CO", time: "15:30" }
  ]
};

// ================= STORAGE =================
let attendance = JSON.parse(localStorage.getItem("attendance")) || {};

// ================= DATE =================
const today = new Date();
const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
document.getElementById("day").innerText = "Today: " + dayName;

// ================= SHOW TODAY CLASSES =================
const container = document.getElementById("classes");
const todayClasses = timetable[dayName] || [];

if (todayClasses.length === 0) {
  container.innerHTML = "<p>No classes today 🎉</p>";
}

todayClasses.forEach(cls => {
  const div = document.createElement("div");
  div.className = "class-box";
  div.innerHTML = `
    <h3>${cls.subject}</h3>
    <p>⏰ ${cls.time}</p>
    <button class="present" onclick="markAttendance('${cls.subject}','Present')">Present</button>
    <button class="absent" onclick="markAttendance('${cls.subject}','Absent')">Absent</button>
  `;
  container.appendChild(div);
});

// ================= MARK ATTENDANCE =================
function markAttendance(subject, status) {
  if (!attendance[subject]) {
    attendance[subject] = { total: 0, present: 0 };
  }

  attendance[subject].total++;
  if (status === "Present") attendance[subject].present++;

  localStorage.setItem("attendance", JSON.stringify(attendance));
  showSummary();
  alert(subject + " marked " + status);
}

// ================= SUMMARY =================
function showSummary() {
  const summaryDiv = document.getElementById("summary");
  summaryDiv.innerHTML = "";

  for (let subject in attendance) {
    const data = attendance[subject];
    const percent = ((data.present / data.total) * 100).toFixed(2);

    summaryDiv.innerHTML += `
      <div class="summary-box">
        <b>${subject}</b><br>
        Present: ${data.present}/${data.total}<br>
        Attendance: ${percent}%
      </div>
    `;
  }
}

showSummary();

// ================= REMINDER =================
if ("Notification" in window) {
  Notification.requestPermission();
}

setInterval(() => {
  const now = new Date();
  const currentDay = now.toLocaleDateString("en-US", { weekday: "long" });
  const classes = timetable[currentDay] || [];

  classes.forEach(cls => {
    const [h, m] = cls.time.split(":");
    const reminderTime = new Date();
    reminderTime.setHours(h, m - 10, 0);

    if (Math.abs(now - reminderTime) < 60000) {
      new Notification("📚 Class Reminder", {
        body: `${cls.subject} class in 10 minutes`
      });
    }
  });
}, 60000);
