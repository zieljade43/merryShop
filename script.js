
const products = [
    {
        id: 1,
        name: "Surf Detergent Powder",
        price: 12,
        category: "Household",
        image: "https://placehold.co/500x400/e8f4ff/2455a4?text=SURF+DETERGENT"
    },
    {
        id: 2,
        name: "Fresh Chicken Eggs",
        price: 10,
        category: "Eggs",
        image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=500"
    },
    {
        id: 3,
        name: "Fudgee Barr",
        price: 10,
        category: "Snacks",
        image: "https://placehold.co/500x400/fff0df/914b20?text=FUDGEE+BARR"
    },
    {
        id: 4,
        name: "Palmolive Shampoo",
        price: 15,
        category: "Personal Care",
        image: "https://placehold.co/500x400/e5f5e8/26733c?text=PALMOLIVE+SHAMPOO"
    },
    {
        id: 5,
        name: "Cooking Oil",
        price: 35,
        category: "Cooking Essentials",
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500"
    }
];

function displayProducts(items) {
    const container = document.getElementById("product-list");

    container.innerHTML = items.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>₱${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        </div>
    `).join("");
}

function filterProducts(category) {
    const filtered = category === "All"
        ? products
        : products.filter(p => p.category === category);

    displayProducts(filtered);
}


displayProducts(products);
