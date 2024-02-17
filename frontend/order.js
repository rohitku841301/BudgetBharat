document
  .getElementById("buyPremiumHandler")
  .addEventListener("click", async (event) => {
    try {
      event.preventDefault();
      const token = localStorage.getItem("token");
      const orderData = await axios.get(
        "http://localhost:3000/order/buy-premium",
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (orderData) {
        let options = {
          key: orderData.data.key_id,
          orderId: orderData.data.orderId,
          handler: async function (orderData) {
            try {
              const updatedStatus = await axios.post(
                "http://localhost:3000/order/buy-premium/update-transaction",
                {
                  orderId: options.orderId,
                  payment_id: orderData.razorpay_payment_id,
                },
                {
                  headers: {
                    Authorization: token,
                  },
                }
              );
              console.log(updatedStatus);
             if(updatedStatus.status === 200){
              localStorage.setItem('token',updatedStatus.data.token)
              console.log("df");
              window.location.href = '/frontend/addExpense.html'
             }
            } catch (error) {
              console.log(error);
            }
            
              
          },
        };

        const rzpl = new Razorpay(options);
        rzpl.open();
        event.preventDefault();

        rzpl.on("payment.failed", async function (orderData) {
          try {
            alert("something went wrong");
          } catch (error) {
            console.log(error);
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
