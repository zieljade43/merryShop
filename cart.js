
const CART_KEY = "freshmart_cart";
const DELIVERY_FEE = 50;

function getCart() {
    try {
        const cart = JSON.parse(
            localStorage.getItem(CART_KEY) || "[]"
        );

        return Array.isArray(cart) ? cart : [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

function addToCart(productOrId) {

    let product;

    if (typeof productOrId === "object" && productOrId !== null) {
        product = productOrId;
    } else {
        const productList =
            typeof products !== "undefined" ? products : [];

        product = productList.find(
            p => String(p.id) === String(productOrId)
        );
    }

    if (!product) {
        alert("Product not found!");
        return;
    }

    const quantityInput = document.getElementById("quantity");

    const quantity = quantityInput
        ? Number(quantityInput.value)
        : 1;

    if (
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 20
    ) {
        alert("Please enter a quantity from 1 to 20.");
        return;
    }

    const cart = getCart();

    const existing = cart.find(
        item => String(item.id) === String(product.id)
    );

    if (existing) {

        if (existing.quantity + quantity > 20) {
            alert("Maximum quantity is 20 per product.");
            return;
        }

        existing.quantity += quantity;

    } else {

        cart.push({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image,
            unit: product.unit || "piece",
            quantity: quantity
        });

    }

    saveCart(cart);

    alert(product.name + " added to your cart!");
}

function updateCartCount() {

    const countElement =
        document.getElementById("cart-count");

    if (!countElement) return;

    const count = getCart().reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    countElement.textContent = count;
}

function changeQuantity(id, amount) {

    const cart = getCart();

    const item = cart.find(
        p => String(p.id) === String(id)
    );

    if (!item) return;

    const newQuantity = item.quantity + amount;

    if (newQuantity < 1) {
        removeItem(id);
        return;
    }

    if (newQuantity > 20) {
        alert("Maximum quantity is 20.");
        return;
    }

    item.quantity = newQuantity;

    saveCart(cart);
}

function removeItem(id) {

    const cart = getCart().filter(
        item => String(item.id) !== String(id)
    );

    saveCart(cart);
}

function renderCart() {

    const container =
        document.getElementById("cart-products");

    if (!container) return;

    const cart = getCart();

    const itemCount = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const delivery = cart.length > 0
        ? DELIVERY_FEE
        : 0;

    const total = subtotal + delivery;

    document.getElementById("item-count").textContent =
        itemCount + (itemCount === 1 ? " item" : " items");

    document.getElementById("subtotal").textContent =
        "₱" + subtotal.toFixed(2);

    document.getElementById("delivery").textContent =
        "₱" + delivery.toFixed(2);

    document.getElementById("total").textContent =
        "₱" + total.toFixed(2);

    document.querySelector(".checkout-btn").disabled =
        cart.length === 0;

    if (cart.length === 0) {

        container.innerHTML = `
            <div class="empty-cart">
                <div class="empty-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>You haven't added any grocery products yet.</p>
                <a href="index.html#products" class="shop-btn">
                    Start Shopping
                </a>
            </div>
        `;

        return;
    }

    container.innerHTML = cart.map(item => `

        <div class="cart-item">

            <img src="${escapeHTML(item.image || "")}"
                 alt="${escapeHTML(item.name)}">

            <div class="item-info">

                <h3>${escapeHTML(item.name)}</h3>

                <p class="item-price">
                    ₱${item.price.toFixed(2)} / ${escapeHTML(item.unit || "piece")}
                </p>

                <div class="quantity-control">

                    <button onclick="changeQuantity('${escapeHTML(item.id)}', -1)">−</button>

                    <span>${item.quantity}</span>

                    <button onclick="changeQuantity('${escapeHTML(item.id)}', 1)">+</button>

                </div>

            </div>

            <div class="item-actions">

                <p class="item-total">
                    ₱${(item.price * item.quantity).toFixed(2)}
                </p>

                <button class="remove-btn"
                    onclick="removeItem('${escapeHTML(item.id)}')">
                    Remove
                </button>

            </div>

        </div>

    `).join("");

}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}


function checkout() {

    const cart = getCart();

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    // Open the checkout page
    window.location.href = "checkout.html";

}

// Initialize cart on every page.
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    renderCart();
});

