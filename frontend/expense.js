const form = document.querySelector("form");

let expenseId = null;
let pageNumber = 1;

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
      "http://35.171.4.218:3000/expense/add-Expense",
      JSON.stringify(expenseData),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    if (responseData.status === 201) {
      const expenseTable = document.getElementById("expenseTable");
      expenseTable.remove();
      const newResponseData = await fetchDataAndDisplay(token, pageNumber);
      updatePaginationButton(newResponseData);

      const allInput = form.getElementsByTagName("input");
      for (let i = 0; i < allInput.length; i++) {
        allInput[i].value = "";
      }
      form.querySelector("select").value = "0";
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
    console.log(parent);
    expenseId = parent.querySelector(".expenseId").innerText;
    console.log(expenseId);
    const token = localStorage.getItem("token");
    const deletedExpense = await axios.delete(
      `http://35.171.4.218:3000/expense/delete-Expense/${expenseId}`,
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
      "http://35.171.4.218:3000/expense/premium/leaderboard",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    if (responseData.status === 200) {
      leaderboardContent(responseData.data.responseData);

      // const div = document.createElement("div");

      // responseData.data.responseData.map((response) => {
      //   console.log(response);
      //   const p = document.createElement("p");
      //   p.innerText = `UserID - ${response.id}, Name - ${response.name}, Total Amount - ${response.totalAmount}`;
      //   div.append(p);
      // });
      // const leaderboard = document.querySelector(".leaderboard");
      // leaderboard.after(div);

      //   const container = document.querySelector(".container");
      //   container.innerHTML = `<div class="container text-center">
      //   <div class="row">
      //     <div class="col">
      //       <h1>Day to Day Expenses</h1>
      //       <table class="table table-success table-striped-columns">
      //         <thead>
      //           <tr>
      //             <th scope="col">Date</th>
      //             <th scope="col">Description</th>
      //             <th scope="col">Category</th>
      //             <th scope="col">Income</th>
      //             <th scope="col">Expense</th>
      //           </tr>
      //         </thead>
      //         <tbody class="table-group-divider">
      //           <tr>
      //             <th scope="row">1</th>
      //             <td>Mark</td>
      //             <td>Otto</td>
      //             <td>@mdo</td>
      //           </tr>
      //           <tr>
      //             <th scope="row">2</th>
      //             <td>Jacob</td>
      //             <td>Thornton</td>
      //             <td>@fat</td>
      //           </tr>

      //         </tbody>
      //       </table>

      //       <h2>Yearly Report</h2>
      //       <table class="table">
      //         <thead>
      //           <tr>
      //             <th scope="col">Month</th>
      //             <th scope="col">Income</th>
      //             <th scope="col">Expense</th>
      //             <th scope="col">Saving</th>
      //           </tr>
      //         </thead>
      //         <tbody class="table-group-divider">
      //           <tr>
      //             <th scope="row">1</th>
      //             <td>Mark</td>
      //             <td>Otto</td>
      //             <td>@mdo</td>
      //           </tr>
      //           <tr>
      //             <th scope="row">2</th>
      //             <td>Jacob</td>
      //             <td>Thornton</td>
      //             <td>@fat</td>
      //           </tr>
      //           <tr>
      //             <th scope="row">3</th>
      //             <td colspan="2">Larry the Bird</td>
      //             <td>@twitter</td>
      //           </tr>
      //         </tbody>
      //       </table>

      //       <p>Notes Report 2021</p>

      //       <table class="table">
      //         <thead>
      //           <tr>
      //             <th scope="col">Date</th>
      //             <th scope="col">Notes</th>
      //           </tr>
      //         </thead>
      //         <tbody class="table-group-divider">
      //           <tr>
      //             <th scope="row">1</th>
      //             <td>Mark</td>
      //           </tr>
      //           <tr>
      //             <th scope="row">2</th>
      //             <td>Jacob</td>
      //           </tr>

      //         </tbody>
      //       </table>
      //     </div>

      //   </div>
      // </div>`;
    }

    console.log(responseData);
  } catch (error) {
    console.log(error);
  }
}

function leaderboardContent(leaderboardData) {
  document.querySelector(".downloadedFileContainer").style.display = "none";
  document.getElementById("downloadedActive").classList.remove("active");

  console.log("-----", leaderboardData);
  document.querySelector(".leaderboaredContainer").style.display = "block";
  document.getElementById("ledearActive").classList.add("active");

  const leaderData = document.getElementById("leaderData");
  const allTr = leaderData.querySelectorAll("tr");
  allTr.forEach((tr) => {
    tr.remove();
  });
  leaderboardData.map((data) => {
    const tr = document.createElement("tr");
    const td1 = document.createElement("td");
    td1.innerText = data.id;
    const td2 = document.createElement("td");
    td2.innerText = data.name;
    const td3 = document.createElement("td");
    td3.innerText = data.totalAmount;
    tr.append(td1);
    tr.append(td2);
    tr.append(td3);
    leaderData.append(tr);
  });
}

async function showMonthlyExpense(event) {
  try {
    event.preventDefault();
    const token = localStorage.getItem("token");
    const responseData = await axios.get(
      "http://35.171.4.218:3000/expense/premium/monthly-Expense",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    console.log(responseData);
  } catch (error) {}
}

async function downloadFile(event) {
  try {
    console.log("sdj");
    event.preventDefault();

    const token = localStorage.getItem("token");
    console.log(token);
    const responseData = await axios.get(
      "http://35.171.4.218:3000/user/downloadFile",
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

async function showAllDownloadFiles(event) {
  try {
    event.preventDefault();
    const token = localStorage.getItem("token");
    const downloadedFile = await axios.get(
      "http://35.171.4.218:3000/user/showDownloadedFile",
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (downloadedFile.status === 200) {
      console.log("cxc");
      console.log(downloadedFile);

      displayDownloadedFile(downloadedFile.data.allFile);
    }
  } catch (error) {
    if (error.response.status === 404) {
      console.log("files are not found");
    } else if (error.response.status === 500) {
      console.log("internal server problem");
    } else {
      console.log(error);
    }
  }
}

function displayDownloadedFile(downloadedFile) {
  document.querySelector(".leaderboaredContainer").style.display = "none";
  document.getElementById("ledearActive").classList.remove("active");
  console.log(downloadedFile);
  document.querySelector(".downloadedFileContainer").style.display = "block";
  document.getElementById("downloadedActive").classList.add("active");

  const downloadedData = document.getElementById("downloadedData");
  const allTr = downloadedData.querySelectorAll("tr");
  allTr.forEach((tr) => {
    tr.remove();
  });
  downloadedFile.map((data) => {
    const tr = document.createElement("tr");
    const td1 = document.createElement("td");
    td1.innerText = data.createdAt;
    const anchor = document.createElement("a");
    anchor.setAttribute("href", `${data.fileURL}`);
    const td2 = document.createElement("td");
    anchor.innerText = data.fileURL;
    td2.append(anchor);
    tr.append(td1);
    tr.append(td2);
    downloadedData.append(tr);
  });
}

async function premiumUserFunctionality(token) {
  try {
    const payload = parseJwt(token);
    if (payload.isPremium) {
      document.getElementById("disappear").style.display = "none";
      document.getElementById("premium").innerHTML = "premium user";

      const allPremiumFeature = document.getElementById("allPremiumFeature");
      allPremiumFeature.innerHTML = `<div class="row">
          <div class="col ">
            <h6 class="display-6">Premium Features</h6>
            <ul class="nav nav-tabs">
              <li class="nav-item">
                <a class="nav-link " id="ledearActive" aria-current="page" onclick="showLeaderboard(event)">Leaderboared</a>
              </li>
              <li class="nav-item">
                <a class="nav-link " aria-current="page" onclick="showMonthlyExpense(event)">Monthly Expense</a>
              </li>
              <li class="nav-item">
                <a class="nav-link " aria-current="page" href="#">Yearly Expense</a>
              </li>
              <li class="nav-item">
                <a class="nav-link " aria-current="page" onclick="downloadFile(event)">Dowload</a>
              </li>
              <li class="nav-item">
                <a class="nav-link " id="downloadedActive" aria-current="page" onclick="showAllDownloadFiles(event)">Dowloaded Files</a>
              </li>
              
            </ul>

            <div class="leaderboaredContainer">
              <table class="table table-dark table-striped">
                <thead>
                  <tr>
                    <th scope="col">UserId</th>
                    <th scope="col">Username</th>
                    <th scope="col">Total Expense</th>
                  </tr>
                </thead >
                <tbody id="leaderData">
                </tbody>
              </table>
            </div>

            <div class="downloadedFileContainer">
              <table class="table table-dark table-striped">
                <thead>
                  <tr>
                    <th scope="col">CreatedAt</th>
                    <th scope="col">Filename</th>
                  </tr>
                </thead >
                <tbody id="downloadedData">
                </tbody>
              </table>
            </div>


          </div>
        </div>`;

      // const leaderboard = document.createElement("button");
      // leaderboard.innerText = "Leaderboard";
      // leaderboard.classList.add("leaderboard");
      // leaderboard.setAttribute("onclick", "showLeaderboard(event)");

      // const downloadFile = document.createElement("button");
      // downloadFile.innerText = "Download";
      // downloadFile.classList.add("download");
      // downloadFile.setAttribute("onclick", "downloadFile(event)");
      // const premiumButton = document.querySelector(".premiumButton");
      // premiumButton.append(leaderboard);
      // premiumButton.append(downloadFile);
    }
  } catch (error) {
    console.log(error.message);
    console.log("sdj");
  }
}

function displayUserDetails(expenseDetails) {
  const expenseTable = document.createElement("tbody");
  expenseTable.setAttribute("id", "expenseTable");
  expenseDetails.map((expense) => {
    const tr = document.createElement("tr");
    const td1 = document.createElement("td");
    td1.innerText = expense.id;
    td1.classList.add("expenseId");
    const td2 = document.createElement("td");
    td2.innerText = expense.amount;
    const td3 = document.createElement("td");
    td3.innerText = expense.category;
    const td4 = document.createElement("td");
    td4.innerText = expense.description;
    const td5 = document.createElement("button");
    td5.innerText = "Delete";
    td5.classList.add("deleteTableBtn");
    td5.setAttribute("onclick", "deleteUserDetail(event)");
    tr.append(td1);
    tr.append(td2);
    tr.append(td3);
    tr.append(td4);
    tr.append(td5);
    expenseTable.append(tr);
  });
  const table = document.getElementById("table");
  table.append(expenseTable);
}

async function fetchDataAndDisplay(token, pageNumber) {
  try {
    let rows = localStorage.getItem("rows");
    if (rows === null) {
      rows = 3;
    }
    const response = await axios.get(
      `http://35.171.4.218:3000/expense/get-Expense/${pageNumber}?rows=${rows}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    console.log(response);
    displayUserDetails(response.data.responseData);

    return response.data.pageDetail;
  } catch (error) {
    if (error.response.status === 401) {
      console.log("token verification failed");
      window.location.href = "/frontend/signIn.html";
    } else if (error.response.status === 404) {
      console.log(error.response.data.responseMessage);
    } else {
      console.error("An error occurred:", error);
    }
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const token = localStorage.getItem("token");
    await premiumUserFunctionality(token);

    const fetchData = await fetchDataAndDisplay(token, pageNumber);
    // console.log("---", fetchData);
    updatePaginationButton(fetchData);
  } catch (error) {
    console.log(error);
  }
});

function updatePaginationButton(fetchData) {
  const paginationButtons = document.querySelector(".paginationButtons");
  const buttonsToRemove = paginationButtons.querySelectorAll("button");
  buttonsToRemove.forEach((button) => {
    button.remove();
  });
  for (let i = 1; i <= fetchData.totalPages; i++) {
    const newPageBtn = document.createElement("button");
    newPageBtn.innerText = i;
    newPageBtn.classList.add("btn");
    newPageBtn.classList.add("btn-outline-secondary");
    newPageBtn.setAttribute("onclick", "currentPageBtn(event)");
    if (fetchData.currentPage === i) {
      console.log("hit me");
      newPageBtn.style.backgroundColor = "#6c63ff";
      newPageBtn.style.color = "white";
    }
    paginationButtons.append(newPageBtn);
  }
}

async function currentPageBtn(event) {
  try {
    const token = localStorage.getItem("token");
    const currentButtonClicked = event.target.innerText;
    const expenseTable = document.getElementById("expenseTable");
    expenseTable.remove();
    const updateButton = await fetchDataAndDisplay(token, currentButtonClicked);
    updatePaginationButton(updateButton);
  } catch (error) {
    console.log(error);
  }
}

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

document
  .getElementById("numberOfExpenses")
  .addEventListener("change", async (event) => {
    console.log(event.target.value);
    localStorage.setItem("rows", event.target.value);
    const token = localStorage.getItem("token");
    const expenseTable = document.getElementById("expenseTable");
    expenseTable.remove();
    const updateButton = await fetchDataAndDisplay(token, pageNumber);
    updatePaginationButton(updateButton);
  });

document.getElementById("logout").addEventListener("click",()=>{
  localStorage.removeItem("token");
})
