let students = [];
let currentStudent = null;

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("loginForm").addEventListener("submit", handleLogin);
  await loadExcelData();
});

async function loadExcelData() {
  try {
    const response = await fetch("SY Bsc Vedic Internal Marklist.xlsx");
    if (!response.ok) throw new Error("Excel file could not be loaded.");
    const buffer = await response.arrayBuffer();
    const workbook = XLSX.read(buffer, {type: "array"});
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, {defval: ""});

    students = rows.map(row => ({
      rollNo: String(row["Roll No"] ?? "").trim(),
      name: String(row["Student Name"] ?? "").trim(),
      marks: String(row["Marks"] ?? "").trim(),
      total: String(row["Total Marks"] ?? "").trim()
    })).filter(s => s.rollNo);

    if (!students.length) throw new Error("No student records found in Sheet1.");
  } catch (error) {
    showAlert("Unable to load the Excel file. Make sure the Excel file is uploaded to the same GitHub repository as index.html.", "danger");
    console.error(error);
  }
}

function handleLogin(event) {
  event.preventDefault();
  const roll = document.getElementById("roll_no").value.trim();

  if (!roll) {
    showAlert("Please enter your Roll Number.", "warning");
    return;
  }

  if (!students.length) {
    showAlert("Student data is still loading or the Excel file was not found.", "danger");
    return;
  }

  const student = students.find(s => s.rollNo.toLowerCase() === roll.toLowerCase());
  if (!student) {
    showAlert("Roll Number not found. Please check and try again.", "danger");
    return;
  }

  currentStudent = calculateResult(student);
  sessionStorage.setItem("studentRoll", currentStudent.rollNo);
  renderDashboard(currentStudent);
}

function calculateResult(student) {
  const marksNum = parseFloat(student.marks);
  const totalNum = parseFloat(student.total);
  let percentage = null;
  let result = "NOT AVAILABLE";

  if (!Number.isNaN(marksNum) && !Number.isNaN(totalNum) && totalNum > 0) {
    percentage = Math.round((marksNum / totalNum * 100) * 100) / 100;
    result = marksNum >= totalNum * 0.40 ? "PASS" : "NEEDS IMPROVEMENT";
  } else if (student.marks.toUpperCase() === "AB") {
    result = "ABSENT";
  }

  return {...student, percentage, result};
}

function renderDashboard(s) {
  document.getElementById("loginSection").classList.add("d-none");
  document.getElementById("dashboardSection").classList.remove("d-none");
  document.getElementById("logoutBtn").classList.remove("d-none");

  document.getElementById("studentName").textContent = s.name;
  document.getElementById("studentRoll").textContent = s.rollNo;
  document.getElementById("statRoll").textContent = s.rollNo;
  document.getElementById("statMarks").textContent = `${s.marks} / ${s.total}`;
  document.getElementById("statPercentage").textContent = s.percentage === null ? "—" : `${s.percentage}%`;

  const result = document.getElementById("statResult");
  result.textContent = s.result;
  result.className = "stat-value " + (s.result === "PASS" ? "text-success" :
    s.result === "ABSENT" ? "text-warning" : "text-secondary");

  document.getElementById("tableRoll").textContent = s.rollNo;
  document.getElementById("tableName").textContent = s.name;
  document.getElementById("tableMarks").textContent = s.marks;
  document.getElementById("tableTotal").textContent = s.total;
  document.getElementById("tablePercentage").textContent = s.percentage === null ? "—" : `${s.percentage}%`;
  document.getElementById("tableResult").textContent = s.result;
  window.scrollTo({top: 0, behavior: "smooth"});
}

function logout() {
  currentStudent = null;
  sessionStorage.removeItem("studentRoll");
  document.getElementById("dashboardSection").classList.add("d-none");
  document.getElementById("loginSection").classList.remove("d-none");
  document.getElementById("logoutBtn").classList.add("d-none");
  document.getElementById("roll_no").value = "";
}

function showLogin() {
  logout();
}

function showAlert(message, type) {
  document.getElementById("alertArea").innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${escapeHtml(message)}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
