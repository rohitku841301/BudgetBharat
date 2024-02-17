let formChecker = true;
async function signupHandler(event) {
  try {
    formChecker = true;
    event.preventDefault();
    const signupData = {
      name: event.target.name.value,
      email: event.target.email.value,
      password: event.target.password.value,
    };

    signupFormValidation(signupData);
    if (formChecker) {
      const responseData = await axios.post(
        "http://localhost:3000/user/signup",
        JSON.stringify(signupData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (responseData.status === 201) {
        document.getElementById("successAlert").style.display = "block";
        document.getElementById("warning").style.display = "none";
        document.getElementById("danger").style.display = "none";
        console.log("signup success");
        window.location.href = "/frontend/signIn.html"
      }
    }
  } catch (error) {
    if (error.response.status === 409) {
      document.getElementById("warning").style.display = "block";
      document.getElementById("successAlert").style.display = "none";
      document.getElementById("danger").style.display = "none";
    } else {
      document.getElementById("warning").style.display = "none";
      document.getElementById("successAlert").style.display = "block";
      document.getElementById("danger").style.display = "block";
    }
  }
}

async function signinHandler(event) {
  try {
    event.preventDefault();
    const signinData = {
      email: event.target.email.value,
      password: event.target.password.value,
    };
    signinFormValidation(signinData);
    if (formChecker) {
      const responseData = await axios.post(
        "http://localhost:3000/user/signin",
        JSON.stringify(signinData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (responseData) {
        if (responseData.status === 200) {
          console.log(responseData);
          localStorage.setItem('token',responseData.data.token)
       
          document.getElementById("successMessage").innerHTML =
            responseData.data.responseMessage;
          document.getElementById("successAlert").style.display = "block";
          document.getElementById("warning").style.display = "none";
          document.getElementById("danger").style.display = "none";
          window.location.href = "/frontend/addExpense.html"
        }
      }
    }
  } catch (error) {
    if (error.response.status === 404) {
      document.getElementById("warningMessage").innerHTML =
        error.response.data.responseMessage;
      document.getElementById("successAlert").style.display = "none";
      document.getElementById("warning").style.display = "block";
      document.getElementById("danger").style.display = "none";
    } else if (error.response.status === 401) {
      console.log(error.response.data.responseMessage);
      document.getElementById("warningMessage").innerHTML =
        error.response.data.responseMessage;
      document.getElementById("successAlert").style.display = "none";
      document.getElementById("warning").style.display = "block";
      document.getElementById("danger").style.display = "none";
    } else {
      document.getElementById("dangerMessage").innerHTML = error.response
        ? error.response.data.responseMessage
        : "Unknown error";

      document.getElementById("successAlert").style.display = "none";
      document.getElementById("warning").style.display = "none";
      document.getElementById("danger").style.display = "block";
    }
    console.log(error);
  }
}

function signinFormValidation({ email, password }) {
  if (!email) {
    document.getElementById("error2").innerText = "*email is required";
  } else {
    document.getElementById("error2").innerText = "";
  }
  if (!password) {
    document.getElementById("error3").innerText = "*password is required";
  } else {
    document.getElementById("error3").innerText = "";
  }
  if (!email && !password) {
    formChecker = false;
  }
}
function signupFormValidation({ name, email, password }) {
  if (!name) {
    document.getElementById("error1").innerText = "*name is required";
  } else {
    document.getElementById("error1").innerText = "";
  }
  if (!email) {
    document.getElementById("error2").innerText = "*email is required";
  } else {
    document.getElementById("error2").innerText = "";
  }
  if (!password) {
    document.getElementById("error3").innerText = "*password is required";
  } else {
    document.getElementById("error3").innerText = "";
  }
  if (!name && !email && !password) {
    formChecker = false;
  }
}
