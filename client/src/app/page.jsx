import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-gray-100 min-h-screen">
      {/* Геройський розділ */}
      <section className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Ласкаво просимо до YouLearn
          </h1>
          <p className="text-xl mb-8">
            Розкрийте свій потенціал з найкращими онлайн-курсами
          </p>
          <Link
            className="bg-white text-blue-500 px-6 py-3 rounded-full text-lg font-semibold hover:bg-gray-200 transition duration-300"
            href="/register"
          >
            Почати
          </Link>
        </div>
      </section>

      {/* Розділ курсів */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-12">Наші популярні курси</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Картка курсу */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-semibold mb-2">
                Курс з веб-розробки
              </h3>
              <p className="text-gray-700 mb-4">
                Дізнайтеся, як створювати веб-сайти та веб-застосунки з нуля,
                використовуючи HTML, CSS, JavaScript та інші технології.
              </p>
              <Link
                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300"
                href="/course/1"
              >
                Дізнатися більше
              </Link>
            </div>
            {/* Картка курсу */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-semibold mb-2">
                Наука про дані та машинне навчання
              </h3>
              <p className="text-gray-700 mb-4">
                Опануйте аналіз даних, візуалізацію та методи машинного навчання
                з Python та R.
              </p>
              <Link
                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300"
                href="/course/2"
              >
                Дізнатися більше
              </Link>
            </div>
            {/* Картка курсу */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-semibold mb-2">
                Стратегії цифрового маркетингу
              </h3>
              <p className="text-gray-700 mb-4">
                Розвивайте свої навички в SEO, маркетингу в соціальних мережах
                та створенні контенту, щоб підвищити свій бізнес.
              </p>
              <Link
                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300"
                href="/course/3"
              >
                Дізнатися більше
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Розділ особливостей */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-12">Чому обрати YouLearn?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Картка особливостей */}
            <div className="bg-gray-100 rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-2">
                Експертні інструктори
              </h3>
              <p className="text-gray-700">
                Навчайтеся у експертів галузі з реальним досвідом.
              </p>
            </div>
            {/* Картка особливостей */}
            <div className="bg-gray-100 rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-2">Гнучке навчання</h3>
              <p className="text-gray-700">
                Вчіться у власному темпі завдяки нашим гнучким опціям навчання.
              </p>
            </div>
            {/* Картка особливостей */}
            <div className="bg-gray-100 rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-2">Доступні ціни</h3>
              <p className="text-gray-700">
                Отримайте доступ до високоякісних курсів за конкурентними
                цінами.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Розділ відгуків */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-12">Що кажуть наші студенти</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Картка відгуку */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-gray-700 mb-4">
                "Ця платформа змінила моє життя! Курси першокласні, а
                інструктори чудові."
              </p>
              <h3 className="text-xl font-semibold">- Джейн Доу</h3>
            </div>
            {/* Картка відгуку */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-gray-700 mb-4">
                "Гнучкість та якість курсів фантастичні. Я дуже рекомендую
                YouLearn."
              </p>
              <h3 className="text-xl font-semibold">- Джон Сміт</h3>
            </div>
            {/* Картка відгуку */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-gray-700 mb-4">
                "Я змогла опанувати нові навички, які допомогли мені просунутися
                в кар'єрі. Дякую, YouLearn!"
              </p>
              <h3 className="text-xl font-semibold">- Сара Джонсон</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Розділ заклику до дії */}
      <section className="bg-blue-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Готові почати навчання?</h2>
          <p className="text-xl mb-8">
            Приєднуйтесь до нас сьогодні та отримайте доступ до сотень курсів.
          </p>
          <Link
            className="bg-white text-blue-500 px-6 py-3 rounded-full text-lg font-semibold hover:bg-gray-200 transition duration-300"
            href="/register"
          >
            Зареєструватися зараз
          </Link>
        </div>
      </section>
    </main>
  );
}
