import LoginForm from '@/components/LoginForm';
import Navbar from '@/components/Navbar';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Login to your FoodWaste Manager account</p>
          </div>

          <LoginForm />

          <div className="mt-6 pt-6 border-t border-gray-300">
            <p className="text-center text-xs text-gray-500 mb-4">
              Demo credentials: use any email and password
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
