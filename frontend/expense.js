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
    const deletedExpense = await axios.delete(
      `http://localhost:3000/expense/delete-Expense/${expenseId}`
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

async function premiumUserFunctionality(token) {
  const payload = parseJwt(token);
  if(payload.isPremium){
    document.getElementById("disappear").style.display = "none";
    document.getElementById("premium").innerHTML = "premium user";
    const leaderboard = document.createElement("button");
    leaderboard.innerText = "Leaderboard"
    const form = document.querySelector("form");
    form.prepend(leaderboard)

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
