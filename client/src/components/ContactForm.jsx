export default function ContactForm() {
  function handleSubmit(event) {
    event.preventDefault();
    alert('Дякуємо! Ваше повідомлення відправлено.');
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <label>
        Ваше ім'я:
        <input type="text" name="name" required />
      </label>

      <label>
        Email:
        <input type="email" name="email" required />
      </label>

      <label>
        Повідомлення:
        <textarea name="message" required />
      </label>

      <button type="submit">Надіслати</button>
    </form>
  );
}
