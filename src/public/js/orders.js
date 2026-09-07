// orders.js — foydalanuvchi ijaralar tarixi va admin so'rovlarni boshqarish paneli

$(function () {
  const isAdmin = window.CURRENT_MEMBER_TYPE === "ADMIN";

  function loadOrders(status) {
    const url = isAdmin ? "/admin/orders" : "/api/orders/mine";
    const params = status ? { orderStatus: status } : {};

    axios
      .get(url, { params })
      .then(function (res) {
        const orders = res.data.data || [];
        isAdmin ? renderAdminTable(orders) : renderMyOrders(orders);
      })
      .catch(function () {
        const target = isAdmin ? "#adminOrdersTable tbody" : "#myOrdersList";
        $(target).html("<p>Ma'lumotlarni yuklashda xatolik yuz berdi.</p>");
      });
  }

  /* ---------- FOYDALANUVCHI RO'YXATI ---------- */
  function renderMyOrders(orders) {
    const $list = $("#myOrdersList");
    $list.empty();

    if (orders.length === 0) {
      $list.html("<p>Hozircha so'rovlar mavjud emas.</p>");
      return;
    }

    orders.forEach(function (o) {
      $list.append(`
        <div class="order-card">
          <img src="${o.productImage}" alt="${o.productName}" />
          <div class="info">
            <h3>${o.productName}</h3>
            <p>Soni: ${o.itemQuantity} | Summasi: ${o.orderTotal} so'm</p>
            <p>${renderStatusTag(o.orderStatus)}</p>
          </div>
        </div>
      `);
    });
  }

  /* ---------- ADMIN JADVALI ---------- */
  function renderAdminTable(orders) {
    const $tbody = $("#adminOrdersTable tbody");
    $tbody.empty();

    if (orders.length === 0) {
      $tbody.html('<tr><td colspan="6">So\'rovlar mavjud emas.</td></tr>');
      return;
    }

    orders.forEach(function (o) {
      const memberInfo = o.memberId
        ? o.memberId.memberFullName || o.memberId.memberNick
        : "Noma'lum";

      let actions = "";
      if (o.orderStatus === "PENDING") {
        actions = `
          <button class="btn btn-small btn-primary approve-btn" data-id="${o._id}">Tasdiqlash</button>
          <button class="btn btn-small btn-danger reject-btn" data-id="${o._id}">Rad etish</button>
        `;
      } else if (o.orderStatus === "APPROVE") {
        actions = `<button class="btn btn-small return-btn" data-id="${o._id}">Qaytarilgan deb belgilash</button>`;
      } else {
        actions = "—";
      }

      $tbody.append(`
        <tr data-id="${o._id}">
          <td>${o.productName}</td>
          <td>${memberInfo}</td>
          <td>${o.itemQuantity}</td>
          <td>${o.orderTotal} so'm</td>
          <td>${renderStatusTag(o.orderStatus)}</td>
          <td>${actions}</td>
        </tr>
      `);
    });
  }

  /* ---------- ADMIN AMALLARI ---------- */
  $(document).on("click", ".approve-btn", function () {
    const id = $(this).data("id");
    axios.patch(`/admin/orders/${id}/approve`).then(() => loadOrders($("#statusFilter").val())).catch(alertErr);
  });

  $(document).on("click", ".reject-btn", function () {
    const id = $(this).data("id");
    axios.patch(`/admin/orders/${id}/reject`).then(() => loadOrders($("#statusFilter").val())).catch(alertErr);
  });

  $(document).on("click", ".return-btn", function () {
    const id = $(this).data("id");
    axios.patch(`/admin/orders/${id}/return`).then(() => loadOrders($("#statusFilter").val())).catch(alertErr);
  });

  function alertErr(err) {
    alert((err.response && err.response.data && err.response.data.message) || "Xatolik yuz berdi.");
  }

  $("#statusFilter").on("change", function () {
    loadOrders($(this).val());
  });

  loadOrders("");
});
