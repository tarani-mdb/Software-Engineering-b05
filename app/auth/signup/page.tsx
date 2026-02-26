import SignupForm from '@/components/SignupForm';
import Navbar from '@/components/Navbar';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-600 mt-2">Join FoodWaste Manager today</p>
          </div>

          <SignupForm />

          <div className="mt-6 pt-6 border-t border-gray-300">
            <p className="text-center text-xs text-gray-500">
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
