const saveTokenToLocalStorage=(token)=> {
    try {
    localStorage.setItem('styldod-token', token);
    } catch (error) {
    console.log('Failed to save user token');
    }
    }

const userSignUP=()=>{
    console.log("git")
if( validateUsername()&&validateUserType()&&validateEmail()&&validatePwd()&&aggreTerms()){
    firebase.auth().createUserWithEmailAndPassword($("#userEmail").val().trim(), $("#userPassword").val().trim()).then(
    auth => {
    // $('.w-form-done').text('Success. Redirecting...').fadeIn();
    // sendEmailVerification();
    firebase.auth().currentUser.updateProfile({
        displayName:$("#userName").val()                
    }).then(function () {
          firebase.auth().currentUser.getIdToken().then(idToken => {
      localStorage.setItem("user", JSON.stringify(firebase.auth().currentUser))
      saveTokenToLocalStorage(idToken)
      
        regUserToDB1({ userType: userType.val(), phone: authPhoneTxt1.val()},idToken).then((regPromise) => {
        window.location = "user-dashboard";
    });
    
      
    
        
            /*regUserToDB(idToken).then(regPromise => {
                if (!overrideAuth) {
                    window.location = 'user-dashboard';
                }
            });*/
        });
    }).catch(function (error) {
     
        alert(error,'Something went wrong. Try again.');
    });
    },
    error => {
    //hideLoading();
    var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode == 'auth/weak-password') {
        $('.w-form-fail').text('The password is too weak.').fadeIn().delay(3000).fadeOut();
    } else {
        $('.w-form-fail').text(errorMessage).fadeIn().delay(3000).fadeOut();
    }
    });
    }
}



const socialLogin=(provider)=>{
    var gProvider = new firebase.auth.GoogleAuthProvider();  
    var fProvider = new firebase.auth.FacebookAuthProvider();

    firebase.auth()
    .signInWithPopup(provider=="facebook"?fProvider:gProvider).then(function(result) {
      var user = result.user;
    firebase.auth().currentUser.getIdToken().then(function(idToken) {
      regUserToDB1({phone:user.phoneNumber},idToken).then((regPromise) => {
    
    localStorage.setItem("user", JSON.stringify(user));
        saveTokenToLocalStorage(idToken)
        window.location = "user-dashboard";
    });
    
    }).catch(function(error) {
      // Handle error
      console.log('Error',error)
    });
    }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    $('.w-form-fail').text(errorMessage).fadeIn().delay(3000).fadeOut();
    
    });
}

function regUserToDB1(jsonData,token) {
        console.log('Test3', jsonData, token)
    return $.ajax({
        type: "POST",
    url: `${apiUrl}/user/register`,
    data: jsonData,
    dataType: "json",
    headers: {
        "Authorization": "Bearer " + token
        }
    });
}
