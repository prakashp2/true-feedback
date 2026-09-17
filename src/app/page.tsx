export default function Home() {
  const messages = [
    "What's your favorite movie?",
    "Do you have any pets?",
    "What's your dream job?",
  ];

  return (
    <main className="min-h-screen bg-white px-4 py-10 text-gray-900">
      <div className="mx-auto max-w-2xl">

        {/* Heading */}
        <h1 className="mb-8 text-center text-3xl font-bold">
          Public Profile Link
        </h1>

        {/* Message section */}
        <div>
          <h2 className="mb-2 text-sm font-semibold">
            Send Anonymous Message to @hc
          </h2>

          <textarea
            placeholder="Write your anonymous message here"
            className="h-28 w-full resize-none rounded-md border border-gray-200 p-3 text-sm outline-none focus:border-gray-400"
          />

          <div className="mt-4 flex justify-center">
            <button className="rounded-md bg-gray-500 px-5 py-2 text-sm font-medium text-white hover:bg-gray-600">
              Send It
            </button>
          </div>
        </div>

        {/* Suggest button */}
        <div className="mt-8">
          <button className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
            Suggest Messages
          </button>

          <p className="mt-5 text-sm text-gray-600">
            Click on any message below to select it.
          </p>
        </div>

        {/* Suggested messages */}
        <div className="mt-5 rounded-md border border-gray-200 p-4">
          <h2 className="mb-4 text-lg font-semibold">
            Messages
          </h2>

          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message}
                className="cursor-pointer rounded-md border border-gray-200 px-4 py-2 text-center text-sm hover:bg-gray-50"
              >
                {message}
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}