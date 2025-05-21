import { Link } from "react-router-dom";

const NoFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
            <p className="text-2xl text-gray-700 mb-6">Page Not Found</p>
            <Link
                to="/"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
                Начало
            </Link>
        </div>
    )
}

export default NoFound