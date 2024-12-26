import { useState, useEffect } from "react";
import axios from "axios";

const DiseaseApi = () => {
  const [query, setQuery] = useState(""); // Search query
  const [results, setResults] = useState([]); // API results
  const [error, setError] = useState(null); // Error handling
  const [loading, setLoading] = useState(false); // Loading state
  const [debouncedQuery, setDebouncedQuery] = useState(""); // For debouncing

  // Debouncing the input query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300); // Adjust the time (500ms) based on your preference

    return () => {
      clearTimeout(timer); // Clear the timer if the query changes before the timeout
    };
  }, [query]);

  // Fetch results based on the debounced query
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `https://www.ebi.ac.uk/ols4/api/select?q=${debouncedQuery}&ontology=efo,mondo&rows=40&start=0&format=json`;
        const response = await axios.get(url);
        const data = response.data.response.docs; // Accessing the relevant data
        setResults(data);
        setLoading(false);
      } catch (err) {
        setError(
          err?.response?.data?.message || err.message || "An error occurred"
        );
        setResults([]);
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  return (
    <div className="bg-[#FBFADA] min-h-screen flex flex-col text-gray-800">
      {/* Title Section */}
      <div className="bg-gradient-to-r from-[#12372A] to-[#436850] p-10 text-center shadow-xl">
        <h1 className="text-6xl font-extrabold tracking-tight text-white">
          Disease Ontology Exploration
        </h1>
      </div>

      {/* Main Content Section */}
      <div className="p-6 flex-grow">
        <div className="max-w-screen-lg mx-auto bg-white p-8 rounded-xl mt-10 shadow-lg">
          <h2 className="text-3xl font-semibold text-center mb-6 text-gray-700">
            Exploring the Path to Disease Targets
          </h2>

          {/* Search bar inside the "Exploring the Path to Disease Targets" section */}
          <div className="flex justify-center mb-6">
          <form onSubmit={(e) => e.preventDefault()} className="rounded-lg">
  <input
    type="text"
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    placeholder="Search for disease (e.g., cancer)"
    className="border-2 border-gray-300 p-3 rounded-full w-80 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500  transition transform hover:translate-y-[-4px] hover:shadow-lg ease-in-out"
  />
</form>

          </div>

          {/* If no query is provided, display featured diseases */}
          {!query && (
            <>
              <p className="text-gray-700 m-8 text-md">
                Discover disease hierarchies, relationships, and recent research. Use the search bar above to find detailed information about specific diseases and their connections.
              </p>

              {/* Featured Disease Section with Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-blue-200 p-6 rounded-xl shadow-md flex flex-col gap-3 hover:shadow-xl transition-all duration-300 ease-in-out">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">COVID-19</h3>
                  <p className="text-gray-600">
                    A highly contagious respiratory illness caused by the SARS-CoV-2 virus, leading to severe respiratory issues.
                  </p>
                </div>

                <div className="bg-yellow-200 p-6 rounded-xl shadow-md flex flex-col gap-3 hover:shadow-xl transition-all duration-300 ease-in-out">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Cancer</h3>
                  <p className="text-gray-600">
                    A group of diseases characterized by abnormal cell growth that can spread to other parts of the body.
                  </p>
                </div>

                <div className="bg-green-200 p-6 rounded-xl shadow-md flex flex-col gap-3 hover:shadow-xl transition-all duration-300 ease-in-out">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Diabetes</h3>
                  <p className="text-gray-600">
                    A chronic condition where the body cannot effectively regulate blood sugar levels.
                  </p>
                </div>

                <div className="bg-purple-200 p-6 rounded-xl shadow-md flex flex-col gap-3 hover:shadow-xl transition-all duration-300 ease-in-out">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Hypertension</h3>
                  <p className="text-gray-600">
                    A condition where the force of the blood against the artery walls is consistently too high.
                  </p>
                </div>

                <div className="bg-red-200 p-6 rounded-xl shadow-md flex flex-col gap-3 hover:shadow-xl transition-all duration-300 ease-in-out">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Influenza</h3>
                  <p className="text-gray-600">
                    A viral infection affecting the respiratory system, causing fever, cough, and fatigue.
                  </p>
                </div>

                <div className="bg-teal-200 p-6 rounded-xl shadow-md flex flex-col gap-3 hover:shadow-xl transition-all duration-300 ease-in-out">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Thyroid Disorders</h3>
                  <p className="text-gray-600">
                    Conditions affecting the thyroid gland, which regulates metabolism.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {loading && <p className="text-blue-600 text-center">Loading...</p>}
        {error && <p className="text-red-600 text-center">{error}</p>}

        {/* Search Results Section */}
        <div className="mt-6">
          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 m-8">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-6 rounded-xl shadow-md flex flex-col gap-4 transition-all duration-300 ease-in-out hover:shadow-xl"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{result.label}</h3>
                  <div className="text-gray-700">
                    <strong>Latest Article: </strong>
                    <a
                      href={result.iri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 font-semibold"
                    >
                      {result.iri}
                    </a>
                  </div>
                  <p className="text-gray-600">
                    <strong>Description:</strong> {result.description}
                  </p>
                  <p className="text-gray-600">
                    <strong>OBO ID:</strong> {result.obo_id}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            !loading && <p className="text-center text-gray-600"></p>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#12372A] to-[#436850]  text-white text-center py-4 mt-auto">
        <p>&copy; {new Date().getFullYear()} Disease Ontology Exploration. All Rights Reserved. Developed by Sonia.</p>
      </footer>
    </div>
  );
};

export default DiseaseApi;
