document.addEventListener("DOMContentLoaded", function() {


    const infoEmail = document.getElementById("infoEmail");
    const infoDate = document.getElementById("infoDate");
    const infoUsername = document.getElementById("infoUsername");

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const loggedInUser = localStorage.getItem("loggedInUser");


    if (!loggedInUser) {
        window.location.href = "login.html";
        return;
    }

    
    if (infoUsername) infoUsername.textContent = currentUser?.username || "غير محدد";
    if (infoEmail) infoEmail.textContent = currentUser?.email || "غير محدد";
    if (infoDate) infoDate.textContent = currentUser?.registerDate || new Date().toLocaleDateString();

    
    const tabs = document.querySelectorAll(".tab");
    if (tabs.length > 0) {
        tabs.forEach(btn => {
            btn.addEventListener("click", function() {
              
                document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
                document.querySelectorAll(".tab-content").forEach(c => c.classList.add("hidden"));
                
               
                btn.classList.add("active");
                const tabId = btn.getAttribute("data-tab");
                if (tabId) {
                    const tabContent = document.getElementById(tabId);
                    if (tabContent) tabContent.classList.remove("hidden");
                }
            });
        });
    }

    
    const backBtn = document.getElementById("backBtn");
    if (backBtn) {
        backBtn.addEventListener("click", function() {
            window.location.href = "index.html";
        });
    }

   
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function() {
            localStorage.removeItem("loggedInUser");
            localStorage.removeItem("currentUser");
            window.location.href = "index.html";
        });
    }

  
    const changePasswordBtn = document.getElementById("changePasswordBtn");
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener("click", function() {
            const newPasswordInput = document.getElementById("newPassword");
            if (!newPasswordInput) return;
            
            const newPassword = newPasswordInput.value.trim();
            
        
            if (!newPassword) {
                alert("Please enter new password!");
                return;
            }

        
            if (newPassword.length < 6) {
                alert("Password must be at least 6 characters!");
                return;
            }

        
            let users = JSON.parse(localStorage.getItem("users")) || [];
            
            const updatedUsers = users.map(user => {
                if (user.email === currentUser.email) {
                    return { 
                        ...user, 
                        password: newPassword 
                    };
                }
                return user;
            });
            
            
            const updatedCurrentUser = { 
                ...currentUser, 
                password: newPassword 
            };
            
           
            localStorage.setItem("users", JSON.stringify(updatedUsers));
            localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser));
            

            alert("✅ Password updated successfully!");
            
         
            newPasswordInput.value = "";
        });
    }

    
    const newPasswordInput = document.getElementById("newPassword");
    if (newPasswordInput && changePasswordBtn) {
        newPasswordInput.addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                changePasswordBtn.click();
            }
        });
    }

    console.log("Profile loaded for user:", currentUser?.username);
});