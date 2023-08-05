"use client"
import { useCompletion } from 'ai/react'
import { useRef, useEffect } from 'react'

export default function HomePage() {
  const {
    completion,
    input,
    stop,
    isLoading,
    handleInputChange,
    handleSubmit,
  } = useCompletion({
    api: '/api/chat'
  })

  const chatElement = useRef(null);

  useEffect(() => {
    chatElement.current.scrollTop = chatElement.current.scrollHeight;
  }, [completion]);

  return (
    <section className="flex justify-center items-center h-screen">

      <form className="px-5 md:p-0 md:max-w-3xl w-full" onSubmit={handleSubmit}>

        <h1 className="text-white text-4xl mb-5 font-bold text-center">Cohe-Chat</h1>

        <div
          className="text-white max-h-96 h-full overflow-auto mt-2 scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-slate-700 "
          ref={chatElement}
        >
          <output>
            {completion}
          </output>
        </div>

        <div className="flex justify-between my-4">
          <label className="text-white font-bold block my-2">
            Ask Something
          </label>
          <button
            className="bg-green-600 text-white px-3 py-2 rounded-md focus:outline-none disabled:opacity-50"
            type="submit"
            disabled={isLoading}
          >
            Send
          </button>
        </div>

        <textarea
          value={input}
          className="text-black bg-slate-300 px-3 py-2 w-full rounded-md focus:outline-none "
          placeholder="Type your message here..."
          rows="4"
          onChange={handleInputChange}
        ></textarea>

      </form>

    </section>
  )
}
