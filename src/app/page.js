export default function Home() {
  return (
    <section className="flex flex-col items-center text-center space-y-6 py-16">
      <h1 className="text-4xl font-bold">
        Welcome to updated version of Barter {" "}
        <span className="text-blue-500 hover:text-blue-400 transition-colors">
          Barter
        </span>
      </h1>
      <p className="max-w-lg text-lg leading-relaxed">
        Trade items without monetary transactions. Sign up or log in to start swapping!
      </p>
      <div className="flex space-x-4">
        <a
          href="/auth/register"
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Get Started
        </a>
      </div>
    </section>
  );
}
