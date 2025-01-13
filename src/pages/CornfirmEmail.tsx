import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { MailOpen } from "lucide-react";

const ConfirmEmail = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <MailOpen className="mx-auto h-16 w-16 text-purple-500" />
        </div>

        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Check Your Inbox
        </h1>

        <div className="space-y-4 mb-8">
          <p className="text-gray-300">
            We've sent you a confirmation email. Please check your inbox and
            click the verification link to complete your registration.
          </p>
          <p className="text-gray-400 text-sm">
            Don't see the email? Check your spam folder or try logging in again.
          </p>
        </div>

        <div className="space-y-4">
          <Link to="/login">
            <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:from-purple-600 hover:to-pink-600 transition duration-300">
              Return to Login
            </Button>
          </Link>

          <Link to="/" className="block">
            <Button
              variant="ghost"
              className="w-full text-gray-400 hover:text-white transition-colors"
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmail;
