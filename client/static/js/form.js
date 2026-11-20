const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+380\d{9}$/;

const validators = {
  name(value) {
    const v = value.trim();
    if (!v) return 'Вкажіть ім’я';
    if (v.length < 2) return 'Ім’я має містити щонайменше 2 символи';
    return '';
  },
  email(value) {
    const v = value.trim();
    if (!v) return 'Вкажіть email';
    if (!EMAIL_RE.test(v)) return 'Введіть email у форматі name@example.com';
    return '';
  },
  phone(value) {
    const v = value.replace(/[\s()-]/g, '');
    if (!v) return 'Вкажіть телефон';
    if (!PHONE_RE.test(v)) return 'Телефон у форматі +380XXXXXXXXX';
    return '';
  },
};

function showError(field, message) {
  const error = document.getElementById(`${field.id}-error`);
  if (error) error.textContent = message;
  field.setAttribute('aria-invalid', message ? 'true' : 'false');
}

function checkField(field) {
  const validate = validators[field.name];
  if (!validate) return true;
  const message = validate(field.value);
  showError(field, message);
  return message === '';
}

function isFormValid(form) {
  const fieldsOk = Object.keys(validators).every(
    (name) => validators[name](form.elements[name].value) === ''
  );
  const agreeOk = form.elements.agree ? form.elements.agree.checked : true;
  return fieldsOk && agreeOk;
}

export function initForm(form, { onSubmit, canSubmit = () => true } = {}) {
  if (!form) return;

  const button = form.querySelector('button[type="submit"]');
  const update = () => {
    button.disabled = !(isFormValid(form) && canSubmit());
  };

  form.addEventListener('input', (event) => {
    if (event.target.name in validators) checkField(event.target);
    update();
  });

  form.addEventListener('focusout', (event) => {
    if (event.target.name in validators) checkField(event.target);
  });

  form.addEventListener('change', update);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const results = Object.keys(validators).map((name) => checkField(form.elements[name]));
    if (!results.every(Boolean) || !isFormValid(form)) {
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form));
    onSubmit?.(data);
  });

  form.refresh = update;
  update();
}