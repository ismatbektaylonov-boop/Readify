// products.js — kitoblar katalogi + admin CRUD boshqaruvi (Coco uslubidagi form-panel bilan)

$(function () {
	/* ---------- ADMIN: FORM PANELNI OCHISH / YOPISH ---------- */
	$('#process-btn').on('click', function () {
		const $panel = $('#product-form-panel')
		const isHidden = $panel.attr('hidden') !== undefined
		$panel.attr('hidden', isHidden ? null : true)
		$(this).attr('aria-expanded', isHidden ? 'true' : 'false')
		if (isHidden)
			$panel[0].scrollIntoView({ behavior: 'smooth', block: 'start' })
	})

	$('#close-form-btn').on('click', function () {
		$('#product-form-panel').attr('hidden', true)
		$('#process-btn').attr('aria-expanded', 'false')
	})

	/* ---------- ADMIN: RASM TANLANGANDA NOMINI KO'RSATISH ---------- */
	$(document).on('change', '#upload-slot input[type=file]', function () {
		const file = this.files && this.files[0]
		const $slot = $(this).closest('.upload-slot')
		$slot.toggleClass('has-file', !!file)
		$slot.find('.upload-slot-name').text(file ? file.name : 'Rasm tanlang')
	})

	/* ---------- QIDIRUV FORMASI ---------- */
	$('#searchForm').on('submit', function (e) {
		e.preventDefault()
		const search = $('#searchInput').val().trim()
		const collection = $('#collectionSelect').val()
		const params = new URLSearchParams()
		if (search) params.set('search', search)
		if (collection) params.set('collection', collection)
		window.location.href = '/products?' + params.toString()
	})

	/* ---------- FOYDALANUVCHI: IJARAGA SO'ROV YUBORISH ---------- */
	$(document).on('click', '.rent-btn', function () {
		const productId = $(this).data('id')
		const $btn = $(this)
		$btn.prop('disabled', true).text('Yuborilmoqda...')

		axios
			.post('/api/orders', { productId, itemQuantity: 1 })
			.then(function () {
				$btn
					.text("So'rov yuborildi ✔")
					.addClass('secondary-action')
					.removeClass('primary-action')
			})
			.catch(function (err) {
				alert(
					(err.response && err.response.data && err.response.data.message) ||
						'Xatolik yuz berdi.',
				)
				$btn.prop('disabled', false).text('Ijaraga olish')
			})
	})

	/* ---------- ADMIN: YANGI KITOB QO'SHISH ---------- */
	$('#createProductForm').on('submit', function (e) {
		e.preventDefault()
		const formData = new FormData(this)

		axios
			.post('/admin/products', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			})
			.then(function () {
				window.location.reload()
			})
			.catch(function (err) {
				alert(
					(err.response && err.response.data && err.response.data.message) ||
						"Kitob qo'shishda xatolik yuz berdi.",
				)
			})
	})

	/* ---------- ADMIN: KITOB HOLATINI O'ZGARTIRISH (PROCESS / PAUSE) ---------- */
	$(document).on('change', '.status-select', function () {
		const productId = $(this).data('id')
		const productStatus = $(this).val()

		axios
			.patch(`/admin/products/${productId}/status`, { productStatus })
			.then(function () {
				window.location.reload()
			})
			.catch(function (err) {
				alert(
					(err.response && err.response.data && err.response.data.message) ||
						"Holatni o'zgartirishda xatolik.",
				)
			})
	})

	/* ---------- ADMIN: KITOBNI O'CHIRISH ---------- */
	$(document).on('click', '.delete-btn', function () {
		if (!confirm("Ushbu kitobni rostdan ham o'chirmoqchimisiz?")) return
		const productId = $(this).data('id')
		const $card = $(this).closest('.product-card')

		axios
			.delete(`/admin/products/${productId}`)
			.then(function () {
				$card.fadeOut(200, function () {
					$(this).remove()
				})
			})
			.catch(function (err) {
				alert(
					(err.response && err.response.data && err.response.data.message) ||
						"O'chirishda xatolik.",
				)
			})
	})
})
