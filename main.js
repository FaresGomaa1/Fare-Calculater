// Class representing each entry
class FareEntry {
    constructor(amount, people, fare) {
        this.amount = amount;
        this.people = people;
        this.fare = fare;
        this.remaining = this.calculateRemaining();
        this.status = "Pending"; // default
    }

    calculateRemaining() {
        return this.amount - (this.people * this.fare);
    }

    toggleStatus() {
        this.status = this.status === "Pending" ? "Done" : "Pending";
    }
}

// Array to store all entries
let entries = [];


// Function to render the table
// inside renderTable (replace current render logic)
function renderTable() {
  const tbody = document.getElementById("resultBody");
  tbody.innerHTML = "";

  entries.forEach((entry, index) => {
    const tr = document.createElement("tr");

    // add status class (pending/done) for styling
    const statusClass = entry.status === "Pending" ? "pending" : "done";

    tr.innerHTML = `
      <td>${entry.amount}</td>
      <td>${entry.people}</td>
      <td>${entry.remaining}</td>
      <td><span class="status ${statusClass}">${entry.status}</span></td>
      <td>
        <button class="btn btn-sm status-btn ${statusClass === 'done' ? 'btn-success' : 'btn-outline-primary'}"
                data-index="${index}">
          <i class="fa-solid ${entry.status === 'Pending' ? 'fa-check' : 'fa-rotate-left'}"></i>
          ${entry.status === 'Pending' ? 'Mark Done' : 'Mark Pending'}
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  // attach listeners
  document.querySelectorAll(".status-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      const i = Number(this.getAttribute("data-index"));
      entries[i].toggleStatus();
      renderTable();
      calculateTotal();
    });
  });

  // update count
  document.getElementById("entriesCount").textContent = entries.length;
  calculateTotal();
}

// Handle form submit
document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();

    const amount = Number(document.getElementById("amount").value);
    const persons = Number(document.getElementById("persons").value);
    const fare = Number(document.getElementById("fare").value);

    if (!amount || !persons || !fare) {
        alert("Please fill in all fields");
        return;
    }
    if (amount < (persons * fare)) {
        alert(`المبلغ غير كافٍ!\nعدد الأشخاص: ${persons}\nالحد الأدنى للمبلغ: ${persons * fare} جنيه`);
        return;
    }
    // Create entry and push to array
    const entry = new FareEntry(amount, persons, fare);
    entries.push(entry);

    // Re-render table
    renderTable();

    // Clear inputs
    document.getElementById("amount").value = "";
    document.getElementById("persons").value = "";
});
function calculateTotal(){
    let totalPeopleCollected = 0;
    let totalPendingMoney = 0;
    let totalMoneyRequired = 0;
    let totalMoneyCollected = 0;
    for(let i = 0; i < entries.length; i++){
        totalPeopleCollected += entries[i].people;
        totalMoneyCollected += entries[i].amount;
        totalMoneyRequired += entries[i].people * entries[i].fare
        if(entries[i].status === "Pending"){
            totalPendingMoney += entries[i].remaining;
        }
        if(entries[i].status === "Done"){
          totalMoneyCollected -= entries[i].remaining;
        }
    }

    // Update UI
    document.getElementById("entriesCount").textContent = entries.length;
    document.getElementById("peopleCount").textContent = totalPeopleCollected;
    document.getElementById("pendingTotal").textContent = totalPendingMoney.toFixed(2);
    document.getElementById("totalRequired").textContent = totalMoneyRequired.toFixed(2);
    document.getElementById("totalCollected").textContent = totalMoneyCollected.toFixed(2);
}
document.getElementById("resultBody").addEventListener("click", function(e) {
    if (e.target.classList.contains("mark-done")) {

        const index = e.target.getAttribute("data-index");

        // Change status
        entries[index].status = "Done";

        // Re-render table
        renderTable();

        // Recalculate totals
        calculateTotal();
    }
});
