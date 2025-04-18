// thankyou.js: Display order details on the thank you page
window.addEventListener('DOMContentLoaded', async () => {
  // Parse orderId from URL
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('orderId');
  const detailsDiv = document.getElementById('orderDetails');
  if (!orderId) {
    detailsDiv.innerHTML = '<p style="color:#a83232;">No order ID found.</p>';
    return;
  }
  // Fetch order details from backend (customize endpoint as needed)
  try {
    const res = await fetch(`https://moes-jerky-backend3.onrender.com/order/${orderId}`);
    if (!res.ok) throw new Error('Order not found');
    const order = await res.json();
    detailsDiv.innerHTML = `
      <div class="order-summary">
        <h2>Order #${orderId}</h2>
        <div class="order-section">
          <h3>Customer</h3>
          <p><strong>Name:</strong> ${order.customer?.name || ''}<br>
          <strong>Email:</strong> ${order.customer?.email || ''}<br>
          <strong>Phone:</strong> ${order.customer?.phone || ''}</p>
        </div>
        <div class="order-section">
          <h3>Items</h3>
          <ul>
            ${order.cart.map(item => `<li>${item.name} x${item.quantity}</li>`).join('')}
          </ul>
        </div>
        <div class="order-section">
          <h3>Total Paid</h3>
          <p><strong>$${order.amount?.toFixed(2) || '0.00'}</strong></p>
        </div>
        <div class="order-section">
          <h3>Status</h3>
          <p>${order.status || 'Processing'}</p>
        </div>
      </div>
    `;
  } catch (err) {
    detailsDiv.innerHTML = `<p style="color:#a83232;">Error loading order details: ${err.message}</p>`;
  }
});
