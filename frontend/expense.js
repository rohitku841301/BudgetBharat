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
          'Authorization': token,
        },
      }
    );
    if (responseData.status === 201) {
      showUser(responseData.data.responseData);
    }
  } catch (error) {
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

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const token = localStorage.getItem('token');
    
    const allExpenseDetails = await axios.get(
      "http://localhost:3000/expense/get-Expense", {
        headers:{
          'Authorization': token
        }
      }
    );
    const newObj = allExpenseDetails.data.responseData;
    for (let i = 0; i < newObj.length; i++) {
      showUser(newObj[i]);
    }
  } catch (error) {
    if(error.response.status === 401){
      console.log(error.response.data.responseMessage);
    }
    console.log(error);
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
