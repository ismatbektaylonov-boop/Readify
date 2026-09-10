// orders.js — foydalanuvchi ijaralar tarixi va admin so'rovlarni boshqarish paneli (coco card uslubida)

$(function () {
	const isAdmin = window.CURRENT_MEMBER_TYPE === 'ADMIN'
	let currentStatus = ''

	function statusLabel(status) {
		const labels = {
			PENDING: 'Kutilmoqda',
			APPROVE: isAdmin ? 'Tasdiqlangan' : "O'qiyapman",
			REJECT: 'Rad etilgan',
			RETURNED: 'Qaytarilgan',
		}
		return labels[status] || status
	}

	function loadOrders(status) {
		const url = isAdmin ? '/admin/orders' : '/api/orders/mine'
		const params = status ? { orderStatus: status } : {}

		axios
			.get(url, { params })
			.then(function (res) {
				const orders = res.data.data || []
				$('#ordersCount').text(
					orders.length +
						(orders.length === 1 ? ' ta buyurtma' : ' ta buyurtma'),
				)
				renderOrders(orders)
			})
			.catch(function () {
				$('#orderGrid').html(
					'<div class="empty-orders"><h2>Xatolik yuz berdi</h2><p>Ma\'lumotlarni yuklab bo\'lmadi.</p></div>',
				)
			})
	}

	function renderOrders(orders) {
		const $grid = $('#orderGrid')
		$grid.empty()

		if (orders.length === 0) {
			$grid.html(
				"<div class=\"empty-orders\"><h2>So'rovlar topilmadi</h2><p>Bu bo'limda hozircha hech narsa yo'q.</p></div>",
			)
			return
		}

		orders.forEach(function (o) {
			const productId = escapeHtml(o._id)
			const productImage = escapeHtml(o.productImage)
			const productName = escapeHtml(o.productName)
			const safeStatus = String(o.orderStatus || '').toLowerCase().replace(/[^a-z-]/g, '')
			const memberInfo = o.memberId
				? o.memberId.memberFullName || o.memberId.memberNick
				: ''

			let footerActions = ''
			if (isAdmin && o.orderStatus === 'PENDING') {
				footerActions = `
						  <button class="advance-order approve-btn" data-id="${productId}">Tasdiqlash</button>
						  <button class="advance-order reject-btn" data-id="${productId}">Rad etish</button>
        `
			} else if (isAdmin && o.orderStatus === 'APPROVE') {
				footerActions = `<button class="advance-order return-btn" data-id="${productId}">Qaytarilgan deb belgilash</button>`
			}

			const memberRow = isAdmin
				? `<div class="order-meta-row"><span>A'zo: <strong>${escapeHtml(memberInfo || "Noma'lum")}</strong></span></div>`
				: ''

			$grid.append(`
			<article class="order-card" data-id="${productId}">
          <header>
            <div class="order-book">
				  <img src="${productImage}" alt="${productName}" />
				  <p>${productName}</p>
            </div>
			<span class="status status--${safeStatus}">${escapeHtml(statusLabel(o.orderStatus))}</span>
          </header>
          ${memberRow}
          <div class="order-meta-row">
            <span>Soni: <strong>${o.itemQuantity}</strong></span>
            <span>Summasi: <strong>${o.orderTotal} so'm</strong></span>
          </div>
          ${footerActions ? `<footer>${footerActions}</footer>` : ''}
        </article>
      `)
		})
	}

	/* ---------- ADMIN AMALLARI ---------- */
	$(document).on('click', '.approve-btn', function () {
		const id = $(this).data('id')
		axios
			.patch(`/admin/orders/${id}/approve`)
			.then(() => loadOrders(currentStatus))
			.catch(alertErr)
	})

	$(document).on('click', '.reject-btn', function () {
		const id = $(this).data('id')
		axios
			.patch(`/admin/orders/${id}/reject`)
			.then(() => loadOrders(currentStatus))
			.catch(alertErr)
	})

	$(document).on('click', '.return-btn', function () {
		const id = $(this).data('id')
		axios
			.patch(`/admin/orders/${id}/return`)
			.then(() => loadOrders(currentStatus))
			.catch(alertErr)
	})

	function alertErr(err) {
		alert(
			(err.response && err.response.data && err.response.data.message) ||
				'Xatolik yuz berdi.',
		)
	}

	/* ---------- FILTR PILL'LAR ---------- */
	$('#statusFilters').on('click', '.filter-link', function (e) {
		e.preventDefault()
		$('.filter-link').removeClass('active')
		$(this).addClass('active')
		currentStatus = $(this).data('status') || ''
		loadOrders(currentStatus)
	})

	loadOrders('')
})
