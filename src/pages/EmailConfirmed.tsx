import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { CheckCircle } from "lucide-react";
import Navbar from "../components/HomeNavbar";

const EmailConfirmed = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center">
          <div className="mb-8 mt-16">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          </div>

          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Email Verified!
          </h1>

          <div className="space-y-4 mb-8">
            <p className="text-gray-300">
              Your email has been successfully verified. You can now log in to
              your account and start exploring.
            </p>
          </div>

          <div className="space-y-4">
            <Link to="/login">
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:from-purple-600 hover:to-pink-600 transition duration-300">
                Proceed to Login
              </Button>
            </Link>

            <Link to="/" className="block">
              <Button
                variant="ghost"
                className="w-full text-gray-400 hover:text-white transition-colors"
              >
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmed;
