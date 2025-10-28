window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 50);



  document.querySelectorAll(".fade-in").forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) el.classList.add("visible");
  });
});

let cart = JSON.parse(localStorage.getItem('cart')) || [];



function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}


function setupCartIcon() {
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function() {
            document.getElementById('cartPopup').style.display = 'flex';
            updateCartDisplay();
        });
    }
}


function setupAddToCartButtons() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const product = this.getAttribute('data-product');
            const price = parseFloat(this.getAttribute('data-price'));
            

            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            

            const existingItem = cart.find(item => item.product === product);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    product: product,
                    price: price,
                    quantity: 1
                });
            }
            

            localStorage.setItem('cart', JSON.stringify(cart));
            

            updateCartCount();
            

            showCartNotification(`${product} added to cart!`);
        });
    });
}


function showCartNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: linear-gradient(135deg, #00bfff, #007acc);
        color: white;
        padding: 12px 20px;
        border-radius: 10px;
        font-weight: 600;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}


function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cartItems && cartTotal) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
            cartTotal.textContent = '0.00';
            return;
        }
        
        cartItems.innerHTML = '';
        let total = 0;
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.product}</div>
                    <div class="cart-item-price">$${item.price} x ${item.quantity} = $${itemTotal.toFixed(2)}</div>
                </div>
                <button class="remove-item" data-index="${index}">🗑️</button>
            `;
            cartItems.appendChild(cartItem);
        });
        
        cartTotal.textContent = total.toFixed(2);
        

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartDisplay();
                updateCartCount();
            });
        });
    }
}


function setupCheckoutButton() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('🛒 Your cart is empty!');
                return;
            }
            

            let message = "🛍️ *NEW ORDER* 🛍️\n\n";
            let total = 0;
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                message += `• ${item.product}\n   Quantity: ${item.quantity}\n   Price: $${item.price} x ${item.quantity} = $${itemTotal.toFixed(2)}\n\n`;
                total += itemTotal;
            });
            
            message += `💰 *TOTAL: $${total.toFixed(2)}* 💰\n\n`;
            message += "Please contact me to complete the payment and delivery. Thank you! 🎉";
            

            const encodedMessage = encodeURIComponent(message);
            
            const instagramUrl = `https://www.instagram.com/double.a.media1/`;
            

            window.open(instagramUrl, '_blank');
            

            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            updateCartDisplay();
            

            document.getElementById('cartPopup').style.display = 'none';
        });
    }
}


function setupCartPopupClose() {
    const closeBtn = document.querySelector('#cartPopup .close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            document.getElementById('cartPopup').style.display = 'none';
        });
    }
    
    const cartPopup = document.getElementById('cartPopup');
    if (cartPopup) {
        cartPopup.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    }
}


const products = [
    { name: "Website Template", category: "Web Design", price: 0 },
    { name: "Video Effects Pack", category: "Video Editing", price: 0 },
    { name: "Social Media Kit", category: "Graphic Design", price: 0 }
];


function setupSearch() {
    const searchBar = document.getElementById('searchBar');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const searchIcon = document.querySelector('.search-icon');

    if (!searchIcon) return;

    searchIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        
        if (searchBar.classList.contains('expanded')) {
            searchBar.classList.remove('expanded');
            searchInput.value = '';
            searchResults.style.display = 'none';
            setTimeout(() => {
                searchInput.blur();
            }, 300);
        } else {
            searchBar.classList.add('expanded');
            setTimeout(() => {
                searchInput.focus();
            }, 300);
        }
    });


    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        
        if (query.length === 0) {
            searchResults.style.display = 'none';
            return;
        }
        
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(query) || 
            product.category.toLowerCase().includes(query)
        );
        
        displaySearchResults(filteredProducts, searchResults);
    });


    document.addEventListener('click', function(e) {
        if (searchBar && !searchBar.contains(e.target)) {
            searchBar.classList.remove('expanded');
            searchResults.style.display = 'none';
        }
    });
}


function displaySearchResults(results, searchResults) {
    searchResults.innerHTML = '';
    
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="search-result-item" style="text-align: center; color: rgba(255,255,255,0.6);">
                No products found
            </div>
        `;
    } else {
        results.forEach(product => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                <strong>${product.name}</strong>
                <div class="product-info">${product.category} - $${product.price}</div>
                <div class="search-result-buttons">
                    <button class="quick-add-btn" data-product="${product.name}" data-price="${product.price}">
                        🛒 Add to Cart
                    </button>
                    <button class="view-product-btn">
                        👁️ View Details
                    </button>
                </div>
            `;
            
            searchResults.appendChild(resultItem);
        });
    }
    
    searchResults.style.display = 'block';
    

    document.querySelectorAll('.quick-add-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const product = this.getAttribute('data-product');
            const price = parseFloat(this.getAttribute('data-price'));
            addToCartFromSearch(product, price);
        });
    });
    
    document.querySelectorAll('.view-product-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            scrollToProducts();
        });
    });
}


function addToCartFromSearch(productName, price) {
    const existingItem = cart.find(item => item.product === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            product: productName,
            price: price,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showCartNotification(`${productName} added to cart!`);
    
    const searchResults = document.getElementById('searchResults');
    const searchInput = document.getElementById('searchInput');
    const searchBar = document.getElementById('searchBar');
    
    if (searchResults) searchResults.style.display = 'none';
    if (searchInput) searchInput.value = '';
    if (searchBar) searchBar.classList.remove('expanded');
}


function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
        
        const searchResults = document.getElementById('searchResults');
        const searchInput = document.getElementById('searchInput');
        const searchBar = document.getElementById('searchBar');
        
        if (searchResults) searchResults.style.display = 'none';
        if (searchInput) searchInput.value = '';
        if (searchBar) searchBar.classList.remove('expanded');
    }
}


function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;


    function loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            themeToggle.textContent = '☀️';
        } else {
            document.body.classList.remove('light-mode');
            themeToggle.textContent = '🌙';
        }
    }


    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('light-mode');
        
        if (document.body.classList.contains('light-mode')) {
            this.textContent = '☀️';
            localStorage.setItem('theme', 'light');
        } else {
            this.textContent = '🌙';
            localStorage.setItem('theme', 'dark');
        }
    });

    loadTheme();
}


document.addEventListener("DOMContentLoaded", () => {


    const serviceBtn = document.getElementById("servicesBtn");
    const contactBtn = document.getElementById("contactBtn");
    const popups = document.querySelectorAll(".popup");
    const closes = document.querySelectorAll(".close");


    if (serviceBtn) {
        serviceBtn.onclick = () => {
            document.getElementById("servicesPopup").style.display = "flex";
        };
    }

    if (contactBtn) {
        contactBtn.onclick = () => {
            document.getElementById("contactPopup").style.display = "flex";
        };
    }


    closes.forEach((c) => {
        c.addEventListener("click", () => {
            popups.forEach((p) => (p.style.display = "none"));
        });
    });

    window.addEventListener("click", (e) => {
        popups.forEach((p) => {
            if (e.target === p) p.style.display = "none";
        });
    });


    const homeLink = document.querySelector("a[href='#home']");
    if (homeLink) {
        homeLink.addEventListener("click", (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }


    const loginBtn = document.getElementById("loginBtn");
    const username = localStorage.getItem("loggedInUser");
    const userMenu = document.querySelector(".user-menu");
    const usernameDisplay = document.getElementById("usernameDisplay");
    const userDropdown = document.getElementById("userDropdown");
    const logoutBtn = document.getElementById("logoutBtn");

    if (username && userMenu && usernameDisplay) {


        if (loginBtn) loginBtn.style.display = "none";


        userMenu.style.display = "inline-block";
        usernameDisplay.textContent = username;


        usernameDisplay.addEventListener("click", (e) => {
  e.stopPropagation();
  userDropdown.classList.toggle("active");
  userMenu.classList.toggle("active");
});


document.addEventListener("click", (e) => {
            if (!userMenu.contains(e.target)) {
                userDropdown.classList.remove("active");
            }
        });


        if (logoutBtn) {
            logoutBtn.addEventListener("click", () => {
                localStorage.removeItem("loggedInUser");
                localStorage.removeItem("currentUser");
                window.location.reload();
            });
        }
    }

    setupCartIcon();
    setupAddToCartButtons();
    setupCheckoutButton();
    setupCartPopupClose();
    setupSearch();
    setupThemeToggle();
    updateCartCount();
});


const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .empty-cart {
        text-align: center;
        padding: 20px;
        color: rgba(255,255,255,0.6);
    }
`;
document.head.appendChild(style);


function setupScrollAnimations() {


    document.querySelectorAll(".fade-in").forEach((el) => {
        const rect = el.getBoundingClientRect();


        if (rect.top < window.innerHeight + 100) {
            el.classList.add("visible");
        }
    });


    window.addEventListener("scroll", () => {
        const navbar = document.getElementById("navbar");
        if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 50);

        document.querySelectorAll(".fade-in").forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                el.classList.add("visible");
            }
        });
    });


    setTimeout(() => {
        document.querySelectorAll(".fade-in").forEach((el) => {
            el.classList.add("visible");
        });
    }, 100);
}



window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 50);
});


function setupScrollAnimations() {


    document.querySelectorAll(".fade-in").forEach((el) => {
        el.classList.add("visible");
    });


    setTimeout(() => {
        document.querySelectorAll(".fade-in").forEach((el) => {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
        });
    }, 50);
}


function setupVisitorCounter() {
    let visitCount = localStorage.getItem('visitCount');
    
    if (!visitCount) {
        visitCount = 1;
    } else {
        visitCount = parseInt(visitCount) + 1;
    }
    
    localStorage.setItem('visitCount', visitCount);
    
    const visitCountElement = document.getElementById('visitCount');
    if (visitCountElement) {
        visitCountElement.textContent = visitCount;
        

        visitCountElement.style.transform = 'scale(1.2)';
        setTimeout(() => {
            visitCountElement.style.transform = 'scale(1)';
        }, 300);
    }
}

document.addEventListener("DOMContentLoaded", () => {

    

    setupVisitorCounter();
    

});


function setupVisitorCounter() {
    let visitCount = localStorage.getItem('visitCount');
    
    if (!visitCount) {
        visitCount = 1;
    } else {
        visitCount = parseInt(visitCount) + 1;
    }
    
    localStorage.setItem('visitCount', visitCount);
    
    const visitCountElement = document.getElementById('visitCount');
    if (visitCountElement) {
        visitCountElement.textContent = visitCount;
        

        visitCountElement.style.transform = 'scale(1.2)';
        setTimeout(() => {
            visitCountElement.style.transform = 'scale(1)';
        }, 300);
    }
}


function setupOnlineUsers() {
    let onlineUsers = localStorage.getItem('onlineUsers');
    let lastActivity = localStorage.getItem('lastActivity');
    const now = Date.now();
    

    if (!onlineUsers || !lastActivity || (now - lastActivity) > 5 * 60 * 1000) {


        const baseUsers = 34;
        const randomIncrease = Math.floor(Math.random() * 3) + 1;
        onlineUsers = baseUsers + randomIncrease;
        
        localStorage.setItem('onlineUsers', onlineUsers);
        localStorage.setItem('lastActivity', now);
        

        setTimeout(updateOnlineUsers, (Math.random() * 2 + 2) * 60 * 1000);
    }
    
    const onlineCountElement = document.getElementById('onlineCount');
    if (onlineCountElement) {
        onlineCountElement.textContent = onlineUsers;
        
   
        onlineCountElement.style.color = '#00ff88';
        setTimeout(() => {
            onlineCountElement.style.color = '';
        }, 1000);
    }
}

function updateOnlineUsers() {
    let onlineUsers = parseInt(localStorage.getItem('onlineUsers')) || 34;
    const change = Math.random() > 0.3 ? 1 : -1; 
    
    onlineUsers += change;
    

    onlineUsers = Math.max(30, Math.min(50, onlineUsers));
    
    localStorage.setItem('onlineUsers', onlineUsers);
    localStorage.setItem('lastActivity', Date.now());
    
    const onlineCountElement = document.getElementById('onlineCount');
    if (onlineCountElement) {
    
        onlineCountElement.style.transform = 'scale(1.3)';
        onlineCountElement.style.color = change > 0 ? '#00ff88' : '#ff4444';
        
        setTimeout(() => {
            onlineCountElement.textContent = onlineUsers;
            onlineCountElement.style.transform = 'scale(1)';
            setTimeout(() => {
                onlineCountElement.style.color = '';
            }, 500);
        }, 300);
    }
    

    setTimeout(updateOnlineUsers, (Math.random() * 2 + 2) * 60 * 1000);
}


document.addEventListener("DOMContentLoaded", () => {

    

    setupVisitorCounter();
    setupOnlineUsers();
    

});