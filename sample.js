
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
