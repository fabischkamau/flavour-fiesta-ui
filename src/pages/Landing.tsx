import { Link } from "react-router-dom";
import HomeNavbar from "../components/HomeNavbar";
import GithubIcon from "../components/icons/github";
import { useUser } from "../context/auth";
import { cn } from "../lib/utils";
import { buttonVariants } from "../components/ui/button";

export default function Landing() {
  const { userData } = useUser();
  return (
    <div className="container mx-auto w-full">
      <HomeNavbar />
      <section
        id="welcome"
        className=" text-center mt-5 flex flex-col justify-center items-center"
      >
        <h2 className="text-4xl">
          Welcome to <strong className="font-bold">Flavour Fiesta!</strong>
        </h2>
        <h3 className="text-3xl  mt-6 font-playwrite">
          Savoring life, one dish at a time!
        </h3>
        <p className="max-w-2xl mt-6 text-base leading-relaxed">
          This project is designed to manage recipes, meal plans, and user
          preferences, leveraging a Neo4j database and Modus Framework to create
          a robust and flexible backend. It enables functionalities such as
          recipe discovery, personalized recommendations, shopping list
          generation, and meal planning. This submission is tailored for the
          Hypermode Hackathon to demonstrate a seamless integration of advanced
          knowledge graph use case and intergration with LLM's.
        </p>
        {!userData?.userId && (
          <Link
            to="/signup"
            className={cn(buttonVariants({ variant: "outline" }), "mt-5")}
          >
            Get Started
          </Link>
        )}
      </section>
      <section className="flex justify-center  w-full space-x-5 mt-12 items-center">
        <div>
          <Link
            className="flex space-x-2 items-center text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm p-10 text-center"
            to="https://github.com/fabischkamau/flavour-fiesta-ui"
            target="_blank"
          >
            <GithubIcon /> Frontend
          </Link>
        </div>
        <div>
          <Link
            className="flex space-x-2 items-center text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm p-10 text-center"
            to="https://github.com/fabischkamau/flavour-fiesta-api"
            target="_blank"
          >
            <GithubIcon /> Backend
          </Link>
        </div>
      </section>
    </div>
  );
}
