let formChecker = null;
let resetPasswordURL = null;

async function signupHandler(event) {
  try {
    event.preventDefault();
    formChecker = true;
    const signupData = {
      name: event.target.name.value,
      email: event.target.email.value,
      password: event.target.password.value,
    };

    signupFormValidation(signupData);
    console.log(formChecker);
    if (formChecker) {
      console.log("jhbh");
      const responseData = await axios.post(
        "http://35.171.4.218:3000/user/signup",
        JSON.stringify(signupData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(responseData);
      if (responseData.status === 201) {
        document.getElementById("successMessage").innerHTML =
            responseData.data.responseMessage;
        document.getElementById("successAlert").style.display = "block";
        document.getElementById("warning").style.display = "none";
        document.getElementById("danger").style.display = "none";
        console.log("signup success");
        window.location.href = "/frontend/signIn.html";
      }
    }
  } catch (error) {
    if (error.response.status === 409) {
      document.getElementById("warningMessage").innerHTML =
        error.response.data.responseMessage;
      document.getElementById("warning").style.display = "block";
      document.getElementById("successAlert").style.display = "none";
      document.getElementById("danger").style.display = "none";
    } else {
      document.getElementById("dangerMessage").innerHTML = error.response
      ? error.response.data.responseMessage
      : "Unknown error";
      document.getElementById("warning").style.display = "none";
      document.getElementById("successAlert").style.display = "block";
      document.getElementById("danger").style.display = "block";
    }
  }
}

async function signinHandler(event) {
  try {
    event.preventDefault();
    formChecker = true;
    const signinData = {
      email: event.target.email.value,
      password: event.target.password.value,
    };
    signinFormValidation(signinData);
    console.log(formChecker);
    if (formChecker) {
      const responseData = await axios.post(
        "http://35.171.4.218:3000/user/signin",
        JSON.stringify(signinData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(responseData);
      if (responseData) {
        if (responseData.status === 200) {
          console.log(responseData);
          localStorage.setItem("token", responseData.data.token);

          document.getElementById("successMessage").innerHTML =
            responseData.data.responseMessage;
          document.getElementById("successAlert").style.display = "block";
          document.getElementById("warning").style.display = "none";
          document.getElementById("danger").style.display = "none";
          window.location.href = "/frontend/addExpense.html";
        }
      }
    }
  } catch (error) {
    console.log(error.response);
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
    formChecker = false;
  } else {
    document.getElementById("error2").innerText = "";
  }
  if (!password) {
    document.getElementById("error3").innerText = "*password is required";
    formChecker = false;
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
    formChecker = false;
  } else {
    document.getElementById("error1").innerText = "";
  }
  if (!email) {
    document.getElementById("error2").innerText = "*email is required";
    formChecker = false;
  } else {
    document.getElementById("error2").innerText = "";
  }
  if (!password) {
    document.getElementById("error3").innerText = "*password is required";
    formChecker = false;
  } else {
    document.getElementById("error3").innerText = "";
  }
  if (!name && !email && !password) {
    formChecker = false;
  }
}



async function forgetPasswordHandler(event) {
  try {
    event.preventDefault();
    const forgetEmail = {
      email: event.target.forgetEmail.value,
    };
    const forgetEmailData = await axios.post(
      "http://35.171.4.218:3000/user/password/forget-password",
      JSON.stringify(forgetEmail),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(forgetEmailData);
    if (forgetEmailData.status === 201) {
      console.log("all okay");
      resetPasswordURL = forgetEmailData.data.url;
      document.getElementById("successMessage").innerHTML =
        forgetEmailData.data.responseMessage;
      document.getElementById("successAlert").style.display = "block";
    }
  } catch (error) {
    if (error.response.status === 404) {
      document.getElementById("warningMessage").innerHTML =
        error.response.data.responseMessage;
      document.getElementById("warning").style.display = "block";
      console.log(error.response.data.responseMessage);
    } else if (error.response.status === 500) {
      console.log(error.response.data.responseMessage);
    } else {
      console.log(error);
    }
    console.log(error);
  }
}

function getUUIDFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("uuid");
}

async function resetPasswordHandler(event) {
  try {
    event.preventDefault();
    resetData = {
      newPassword: event.target.newPassword.value,
    };

    const uuid = getUUIDFromUrl();

    const responseData = await axios.post(
      `http://35.171.4.218:3000/user/password/reset-password/${uuid}`,
      JSON.stringify(resetData),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if(responseData.status===200){

    }
  } catch (error) {
    console.log(error);
    if(error.response.status === 400){

    }else if(error.response.status === 404){

    }else if(error.response.status === 500){

    }else{
      console.log(error);
    }
  }
}
