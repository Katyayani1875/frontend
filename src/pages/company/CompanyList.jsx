import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from '../../utils/axios';

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    try {
      const res = await api.get("/companies");
      setCompanies(res.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  if (loading) {
    return (
      <p className="text-center py-8 text-gray-500">Loading companies...</p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">Browse Companies</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {companies.map((company) => (
          <li
            key={company._id}
            className="border p-4 rounded-lg hover:shadow transition flex flex-col justify-between h-48"
          >
            <div>
              <Link
                to={`/company/${company._id}`}
                className="text-blue-600 hover:underline text-lg font-semibold block mb-2"
              >
                {company.name}
              </Link>
              {company.description && (
                <p className="text-gray-600 text-sm line-clamp-2">{company.description}</p>
              )}
            </div>
            <div className="mt-4">
              <Link to={`/company/${company._id}/jobs`}>
                <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200 text-sm">
                  View Jobs
                </button>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompanyList;
