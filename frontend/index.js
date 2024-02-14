let formChecker = true;

async function signupHandler(event) {
  try {
    formChecker=true;
    event.preventDefault();
    const signupData = {
      name: event.target.name.value,
      email: event.target.email.value,
      password: event.target.password.value,
    };
    console.log(signupData);
    signupFormValidation(signupData);
    if (formChecker) {
    const responseData = await axios.post('http://localhost:3000/user/login', signupData, {
        headers:{
            'Content-Type':'application/json'
        }
    });
    console.log(responseData);
        
    } else {
        console.log("do nothing");
    }
  } catch (error) {
    console.log(error);
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
