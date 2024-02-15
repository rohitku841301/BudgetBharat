

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
 
    signupFormValidation(signupData);
    if (formChecker) {
    const responseData = await axios.post('http://localhost:3000/user/login', JSON.stringify(signupData), { 
        headers:{
            'Content-Type':'application/json'
        }
    });
      if(responseData.status === 201){
        document.getElementById('successAlert').style.display = 'block';
      document.getElementById('warning').style.display = 'none';
      document.getElementById('danger').style.display = 'none';


        console.log("signup success");
      }
        
    } else {
        console.log("do nothing");
    }
  } catch (error) {
    
    if(error.response.status === 409){
      document.getElementById('warning').style.display = 'block';
      document.getElementById('successAlert').style.display = 'none';
      document.getElementById('danger').style.display = 'none';


    }else{
      document.getElementById('warning').style.display = 'none';
      document.getElementById('successAlert').style.display = 'block';
      document.getElementById('danger').style.display = 'block';
    }
  
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
