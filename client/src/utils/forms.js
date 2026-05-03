// Input masks + validators for the storefront forms.
// Format-as-you-type: pass to onChange via fmt(e.target.value).

// — Phone (RU): +7 (XXX) XXX-XX-XX, max 11 digits with leading 7/8
export function phoneMask(raw) {
  let digits = String(raw || '').replace(/\D/g, '');
  if (digits.startsWith('8')) digits = '7' + digits.slice(1);
  if (!digits.startsWith('7')) digits = '7' + digits;
  digits = digits.slice(0, 11);

  const a = digits.slice(1, 4);
  const b = digits.slice(4, 7);
  const c = digits.slice(7, 9);
  const d = digits.slice(9, 11);

  let out = '+7';
  if (a) out += ' (' + a;
  if (a.length === 3) out += ')';
  if (b) out += ' ' + b;
  if (c) out += '-' + c;
  if (d) out += '-' + d;
  return out;
}

export function phoneDigits(value) {
  return String(value || '').replace(/\D/g, '');
}

export function validatePhone(value) {
  const d = phoneDigits(value);
  if (d.length === 0) return 'Введите номер телефона';
  if (d.length < 11) return 'Номер должен содержать 11 цифр';
  if (!d.startsWith('7') && !d.startsWith('8')) return 'Номер должен начинаться с +7 или 8';
  return null;
}

// — Card number: 4-4-4-4, up to 19 digits (some cards 16, AmEx 15)
export function cardMask(raw) {
  const digits = String(raw || '').replace(/\D/g, '').slice(0, 19);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

export function cardDigits(value) {
  return String(value || '').replace(/\D/g, '');
}

// Luhn check
export function luhnCheck(num) {
  const s = String(num || '').replace(/\D/g, '');
  if (s.length < 12) return false;
  let sum = 0, alt = false;
  for (let i = s.length - 1; i >= 0; i--) {
    let n = parseInt(s[i], 10);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

export function validateCard(value) {
  const d = cardDigits(value);
  if (d.length === 0) return 'Введите номер карты';
  if (d.length < 13) return 'Номер карты слишком короткий';
  if (d.length > 19) return 'Номер карты слишком длинный';
  if (!luhnCheck(d)) return 'Неверный номер карты';
  return null;
}

export function detectCardBrand(value) {
  const d = cardDigits(value);
  if (/^4/.test(d)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(d)) return 'mc';
  if (/^3[47]/.test(d)) return 'amex';
  if (/^(220[0-4])/.test(d)) return 'mir';
  return null;
}

// — Expiry: MM/YY
export function expMask(raw) {
  const d = String(raw || '').replace(/\D/g, '').slice(0, 4);
  if (d.length <= 2) return d;
  return d.slice(0, 2) + '/' + d.slice(2);
}

export function validateExp(value) {
  const d = String(value || '').replace(/\D/g, '');
  if (d.length === 0) return 'Введите срок';
  if (d.length < 4) return 'Формат MM/ГГ';
  const mm = parseInt(d.slice(0, 2), 10);
  const yy = parseInt(d.slice(2, 4), 10);
  if (mm < 1 || mm > 12) return 'Неверный месяц';
  const now = new Date();
  const curYY = now.getFullYear() % 100;
  const curMM = now.getMonth() + 1;
  if (yy < curYY || (yy === curYY && mm < curMM)) return 'Срок истёк';
  if (yy > curYY + 20) return 'Слишком далеко';
  return null;
}

// — CVC: 3-4 digits
export function cvcMask(raw) {
  return String(raw || '').replace(/\D/g, '').slice(0, 4);
}
export function validateCVC(value) {
  const d = String(value || '').replace(/\D/g, '');
  if (d.length === 0) return 'CVC обязателен';
  if (d.length < 3) return 'CVC — 3 или 4 цифры';
  return null;
}

// — Name: letters/spaces/hyphens, 2..30
export function validateName(value, label = 'Имя') {
  const v = String(value || '').trim();
  if (!v) return label + ' обязательно';
  if (v.length < 2) return label + ' слишком короткое';
  if (v.length > 40) return label + ' слишком длинное';
  if (!/^[a-zA-Zа-яА-ЯёЁ\-\s']+$/.test(v)) return label + ' содержит недопустимые символы';
  return null;
}

// — Address: 6..200 chars
export function validateAddress(value) {
  const v = String(value || '').trim();
  if (!v) return 'Введите адрес доставки';
  if (v.length < 6) return 'Адрес слишком короткий';
  if (v.length > 200) return 'Адрес слишком длинный';
  return null;
}

// — Cardholder name (uppercased latin)
export function cardNameMask(raw) {
  return String(raw || '').toUpperCase().replace(/[^A-Z\s\-']/g, '').slice(0, 40);
}
export function validateCardName(value) {
  const v = String(value || '').trim();
  if (!v) return 'Введите имя владельца';
  if (v.length < 3) return 'Слишком коротко';
  if (!/\s/.test(v)) return 'Укажите имя и фамилию';
  return null;
}
