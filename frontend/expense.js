const form = document.querySelector("form");

let expenseId = null;

async function addExpenseFormHandler(event) {
  try {
    event.preventDefault();
    const expenseData = {
      amount: event.target.amount.value,
      description: event.target.description.value,
      category: event.target.category.value,
    };
    console.log(expenseData);
    const token = localStorage.getItem("token");

    const responseData = await axios.post(
      "http://localhost:3000/expense/add-Expense",
      JSON.stringify(expenseData),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    if (responseData.status === 201) {
      showUser(responseData.data.responseData);
    }
  } catch (error) {
    if (error.response.status === 401 && statusText === "Unauthorized") {
      window.location.href = "frontend/addExpense.html";
    }
    console.log(error);
  }
}

async function deleteUserDetail(event) {
  try {
    const parent = event.target.parentNode;
    expenseId = parent.querySelector(".id").innerText;
    console.log(expenseId);
    const token = localStorage.getItem("token");
    const deletedExpense = await axios.delete(
      `http://localhost:3000/expense/delete-Expense/${expenseId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    console.log(deletedExpense);
    parent.remove();
  } catch (error) {
    if (error.response.status) {
      console.log("sds");
    }
    // console.log(error);
  }
}

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

async function showLeaderboard(event) {
  try {
    event.preventDefault();
    const token = localStorage.getItem("token");
    const responseData = await axios.get(
      "http://localhost:3000/expense/premium/leaderboard",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    if (responseData.status === 200) {
      const div = document.createElement("div");

      responseData.data.responseData.map((response) => {
        console.log(response);
        const p = document.createElement("p");
        p.innerText = `UserID - ${response.id}, Name - ${response.name}, Total Amount - ${response.totalAmount}`;
        div.append(p);
      });
      const leaderboard = document.querySelector(".leaderboard");
      leaderboard.after(div);

      const container = document.querySelector(".container");
      container.innerHTML = `<div class="container text-center">
      <div class="row">
        <div class="col">
          <h1>Day to Day Expenses</h1>
          <table class="table table-success table-striped-columns">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Description</th>
                <th scope="col">Category</th>
                <th scope="col">Income</th>
                <th scope="col">Expense</th>
              </tr>
            </thead>
            <tbody class="table-group-divider">
              <tr>
                <th scope="row">1</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
              
            </tbody>
          </table>
      
          <h2>Yearly Report</h2>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Month</th>
                <th scope="col">Income</th>
                <th scope="col">Expense</th>
                <th scope="col">Saving</th>
              </tr>
            </thead>
            <tbody class="table-group-divider">
              <tr>
                <th scope="row">1</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td colspan="2">Larry the Bird</td>
                <td>@twitter</td>
              </tr>
            </tbody>
          </table>

          <p>Notes Report 2021</p>

          <table class="table">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Notes</th>
              </tr>
            </thead>
            <tbody class="table-group-divider">
              <tr>
                <th scope="row">1</th>
                <td>Mark</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Jacob</td>
              </tr>
            
            </tbody>
          </table>
        </div>
        
      </div>
    </div>`;
    }

    console.log(responseData);
  } catch (error) {
    console.log(error);
  }
}

async function downloadFile(event) {
  try {
    console.log("sdj");
    event.preventDefault();

    const token = localStorage.getItem("token");
    console.log(token);
    const responseData = await axios.get(
      "http://localhost:3000/user/downloadFile",
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (responseData.status === 200) {
      fileURL = responseData.data.fileURL;
      window.location.href = fileURL;
    }
    console.log(responseData);
  } catch (error) {
    console.log(error);
  }
}

async function premiumUserFunctionality(token) {
  const payload = parseJwt(token);
  if (payload.isPremium) {
    document.getElementById("disappear").style.display = "none";
    document.getElementById("premium").innerHTML = "premium user";
    const leaderboard = document.createElement("button");
    leaderboard.innerText = "Leaderboard";
    leaderboard.classList.add("leaderboard");
    leaderboard.setAttribute("onclick", "showLeaderboard(event)");

    const downloadFile = document.createElement("button");
    downloadFile.innerText = "Download";
    downloadFile.classList.add("download");
    downloadFile.setAttribute("onclick", "downloadFile(event)");
    const premiumButton = document.querySelector(".premiumButton");
    premiumButton.append(leaderboard);
    premiumButton.append(downloadFile);
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const token = localStorage.getItem("token");

    premiumUserFunctionality(token);

    const allExpenseDetails = await axios.get(
      "http://localhost:3000/expense/get-Expense",
      {
        headers: {
          Authorization: token,
        },
      }
    );
    console.log(allExpenseDetails);
    // if()
    // document.getElementById("buyPremiumHandler").innerHTML = "Premium User⭐"

    const newObj = allExpenseDetails.data.responseData;
    for (let i = 0; i < newObj.length; i++) {
      showUser(newObj[i]);
    }
  } catch (error) {
    console.log(error);

    if (error.response.status === 401) {
      window.location.href = "signIn.html";
    }
  }
});

function showUser(newObj) {
  const entries = Object.entries(newObj);

  const ul = document.createElement("ul");
  entries.forEach(([key, value]) => {
    const li = document.createElement("li");
    li.innerText = value;
    li.classList.add(key);
    ul.append(li);
  });
  const btn = document.createElement("button");
  btn.innerText = "delete";
  btn.setAttribute("type", "click");
  btn.setAttribute("onclick", "deleteUserDetail(event)");

  const editBtn = document.createElement("button");
  editBtn.innerText = "edit";

  editBtn.setAttribute("type", "click");
  editBtn.setAttribute("class", "edit");
  editBtn.setAttribute("onclick", "editUserDetail(event)");
  ul.append(btn);
  ul.append(editBtn);
  form.after(ul);

  const allInput = form.getElementsByTagName("input");
  for (let i = 0; i < allInput.length; i++) {
    allInput[i].value = "";
  }
  form.querySelector("select").value = "0";
}
