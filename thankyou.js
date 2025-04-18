// thankyou.js: Display order details on the thank you page
function formatDateWithDay(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'long', year: '2-digit', month: '2-digit', day: '2-digit' }).replace(/\b(\d{2})\/(\d{2})\/(\d{2})\b/, (m, mm, dd, yy) => `${mm}/${dd}/${yy}`);
}

window.addEventListener('DOMContentLoaded', async () => {
  // Parse orderNumber from URL
  const params = new URLSearchParams(window.location.search);
  const orderNumber = params.get('orderNumber');
  const detailsDiv = document.getElementById('orderDetails');
  if (!orderNumber) {
    detailsDiv.innerHTML = '<p style="color:#a83232;">No order number found.</p>';
    return;
  }
  // Fetch order details from backend by orderNumber
  try {
    const res = await fetch(`https://moes-jerky-backend3.onrender.com/orders`);
    if (!res.ok) throw new Error('Order not found');
    const orders = await res.json();
    const order = orders.find(o => o.orderNumber === Number(orderNumber));
    if (!order) throw new Error('Order not found');
    detailsDiv.innerHTML = `
      <div class="order-summary">
        <h2>Order #${orderNumber}</h2>
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
          <h3>Delivery Date</h3>
          <p>${order.deliveryDate ? formatDateWithDay(order.deliveryDate) : '-'}</p>
        </div>
        <div class="order-section">
          <h3>Delivery Type</h3>
          <p>${order.customer?.fulfillment === 'delivery' ? 'Delivery' : 'Pickup'}</p>
        </div>
      </div>
    `;
  } catch (err) {
    detailsDiv.innerHTML = `<p style="color:#a83232;">Error loading order details: ${err.message}</p>`;
  }
});
