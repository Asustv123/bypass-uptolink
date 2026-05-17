(function () {
  'use strict';

  // ====== Cấu hình NekoVCheat ======
  const API_BASE = 'https://vanhcheat.rf.gd/';
  const CONFIG_URL = API_BASE + '/link.json';
  const SAVE_URL = API_BASE + '/api.php?action=save';

  const urlHienTai = window.location.href;
  const thamSoUrl = new URLSearchParams(window.location.search);
  const tenMien = window.location.hostname;
  const cacDoanDuong = window.location.pathname.split('/').filter(Boolean);
  let maNhiemVu = null;

  if (cacDoanDuong.length > 0) {
    let doanCuoi = cacDoanDuong[cacDoanDuong.length - 1].replace(/\.html$/i, '');
    if (tenMien.includes('totreview.com')) {
      maNhiemVu = `totreview-${doanCuoi}`;
    } else {
      maNhiemVu = doanCuoi;
    }
  }

  let khoCookie = '';
  const USER_AGENT =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0';

  const SCHEMA_OCR = {
    name: 'google_search_extraction',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        target_domain: {
          type: 'string',
          description:
            'Extract ONLY the destination domain name (e.g., example.com)',
        },
        extracted_text: {
          type: 'string',
          description: 'Extract all readable text from the image.',
        },
      },
      required: ['target_domain', 'extracted_text'],
      additionalProperties: false,
    },
  };

  const REGEX_LINK_GOC = /<a[^>]+href=["']([^"']+)["'][^>]*>Link\s*Gốc<\/a>/i;

  // ===== Redirect =====
  if (thamSoUrl.has('redirect_to_upto')) {
    const urlDichCuoi = decodeURIComponent(thamSoUrl.get('redirect_to_upto'));
    document.body.innerHTML = 'Đang điều hướng...';
    setTimeout(() => {
      window.location.href = urlDichCuoi;
    }, 1000);
    return;
  }

  // ===== Check link gốc =====
  const matchLinkGoc = document.body.innerHTML.match(REGEX_LINK_GOC);
  if (matchLinkGoc) {
    window.location.href = matchLinkGoc[1];
    return;
  }

  // ===== Submit form =====
  function guiForm(form) {
    let thamSo = new URLSearchParams(new FormData(form));

    fetch(window.location.href, {
      method: 'POST',
      body: thamSo.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then(res => res.text())
      .then(html => {
        let link = html.match(REGEX_LINK_GOC);
        if (link) {
          window.location.href = link[1];
        }
      })
      .catch(() => {});
  }

  // ===== Auto run =====
  function autoBypass() {
    let form = document.querySelector('form');
    if (form) {
      guiForm(form);
    }
  }

  setTimeout(autoBypass, 1500);

})();
