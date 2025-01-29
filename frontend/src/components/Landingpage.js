import React from "react"

function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col justify-center items-center p-4">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-indigo-800 mb-2">SNS Learning platform</h1>
        <p className="text-xl text-indigo-600">Empowering Education, Inspiring Growth</p>
      </header>

      <main className="w-full max-w-4xl">
        <div className="grid md:grid-cols-2 gap-8">
          <LoginCard
            title="Instructor Login"
            description="Access your teaching dashboard, manage courses, and interact with students."
            linkHref="/login"
          />
          <LoginCard
            title="Student Login"
            description="Enter your learning portal, access courses, and track your progress."
            linkHref="/loginSt"
          />
        </div>
      </main>

      <footer className="mt-16 text-center text-indigo-600">
        <p>&copy; 2025 SNS Learn Crew. All rights reserved.</p>
      </footer>
    </div>
  )
}

function LoginCard({ title, description, imageSrc, linkHref }) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
      <div className="p-6">
        <div className="flex justify-center mb-4">
        </div>
        <h2 className="text-2xl font-semibold text-indigo-800 mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{description}</p>
        <a
          href={linkHref}
          className="block w-full text-center bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300"
        >
          Login
        </a>
      </div>
    </div>
  )
}

export default Dashboard

