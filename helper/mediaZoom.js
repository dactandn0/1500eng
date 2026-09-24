// Media zoom module: click bat ky <img> nao -> phong to fullscreen.
// - Nut [x] + bam nen den de dong
// - Nut + / - , double-tap, pinch-zoom, keo pan khi zoom (iPhone OK)
// Khong can sua code cu: tu bat click tren document.
(function () {
	var overlay = null, stage = null, img = null;
	var scale = 1, tx = 0, ty = 0;
	var MIN_S = 1, MAX_S = 5;
	var pinchD0 = 0, pinchS0 = 1;
	var lastTap = 0;
	var panId = null, panX0 = 0, panY0 = 0, panTx0 = 0, panTy0 = 0;

	function $(id) { return document.getElementById(id); }

	// iPhone/iPad zoom bang ngon tay san -> tat module de khoi vuong
	function isIOS() {
		try {
			if (/iPad|iPhone|iPod/.test(navigator.userAgent)) return true;
			if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) return true; // iPadOS
		} catch (e) {}
		return false;
	}

	function apply() {
		try {
			img.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + scale + ')';
		} catch (e) {}
	}
	function reset() { scale = 1; tx = 0; ty = 0; apply(); }

	function open(src) {
		if (!src) return;
		if (isIOS()) return;
		if (!overlay) return;
		try {
			img.src = src;
			reset();
			overlay.style.display = 'block';
			document.body.style.overflow = 'hidden';
		} catch (e) {}
	}
	function close() {
		if (!overlay) return;
		try {
			overlay.style.display = 'none';
			document.body.style.overflow = '';
			img.removeAttribute('src');
			reset();
		} catch (e) {}
	}
	function zoomAt(f) {
		scale = Math.min(MAX_S, Math.max(MIN_S, scale * f));
		if (scale === 1) { tx = 0; ty = 0; }
		apply();
	}

	function bind() {
		overlay = $('imgZoomOverlay');
		stage = $('imgZoomStage');
		img = $('imgZoomImg');
		if (!overlay || !stage || !img) return;
		// [x] dong
		$('imgZoomClose').addEventListener('click', function (ev) {
			try { ev.stopPropagation(); } catch (e) {}
			close();
		});
		// bam nen den (ngoai anh) thi dong
		overlay.addEventListener('click', function (ev) {
			try { if (ev.target === overlay || ev.target === stage) close(); } catch (e) {}
		});
		$('imgZoomPlus').addEventListener('click', function (ev) {
			try { ev.stopPropagation(); } catch (e) {}
			zoomAt(1.4);
		});
		$('imgZoomMinus').addEventListener('click', function (ev) {
			try { ev.stopPropagation(); } catch (e) {}
			zoomAt(1 / 1.4);
		});
		// double-tap: toggle 1x <-> 2.5x
		img.addEventListener('click', function () {
			const now = Date.now();
			if (now - lastTap < 300) {
				scale = (scale > 1.5) ? 1 : 2.5;
				if (scale === 1) { tx = 0; ty = 0; }
				apply();
				lastTap = 0;
			} else {
				lastTap = now;
			}
		});
		// pinch + pan (touch)
		stage.addEventListener('touchstart', function (ev) {
			try {
				if (ev.touches.length === 2) {
					const dx = ev.touches[0].clientX - ev.touches[1].clientX;
					const dy = ev.touches[0].clientY - ev.touches[1].clientY;
					pinchD0 = Math.sqrt(dx * dx + dy * dy) || 1;
					pinchS0 = scale;
					panId = null;
				} else if (ev.touches.length === 1 && scale > 1) {
					panId = ev.touches[0].identifier;
					panX0 = ev.touches[0].clientX; panY0 = ev.touches[0].clientY;
					panTx0 = tx; panTy0 = ty;
				}
			} catch (e) {}
		}, { passive: true });
		stage.addEventListener('touchmove', function (ev) {
			try {
				if (ev.touches.length === 2) {
					if (ev.cancelable) ev.preventDefault();
					const dx = ev.touches[0].clientX - ev.touches[1].clientX;
					const dy = ev.touches[0].clientY - ev.touches[1].clientY;
					const d = Math.sqrt(dx * dx + dy * dy) || 1;
					scale = Math.min(MAX_S, Math.max(MIN_S, pinchS0 * d / pinchD0));
					if (scale === 1) { tx = 0; ty = 0; }
					apply();
				} else if (ev.touches.length === 1 && panId !== null && scale > 1) {
					if (ev.cancelable) ev.preventDefault();
					tx = panTx0 + (ev.touches[0].clientX - panX0);
					ty = panTy0 + (ev.touches[0].clientY - panY0);
					apply();
				}
			} catch (e) {}
		}, { passive: false });
		stage.addEventListener('touchend', function (ev) {
			try { if (ev.touches.length < 2) pinchD0 = 0; } catch (e) {}
			try { if (panId !== null && ev.touches.length === 0) panId = null; } catch (e) {}
		});
		// ESC dong (desktop)
		document.addEventListener('keydown', function (ev) {
			try {
				if ((ev.key === 'Escape' || ev.keyCode === 27) && overlay.style.display === 'block') close();
			} catch (e) {}
		});
		// Click bat ky anh nao -> zoom (tru anh trong overlay)
		document.addEventListener('click', function (ev) {
			try {
				let t = ev.target;
				if (!t || t.id === 'imgZoomImg') return;
				if (t.tagName !== 'IMG') return;
				const src = t.currentSrc || t.src;
				if (!src) return;
				open(src);
			} catch (e) {}
		});
	}

	window.openImgZoom = open;
	window.closeImgZoom = close;
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', bind);
	} else {
		bind();
	}
})();
