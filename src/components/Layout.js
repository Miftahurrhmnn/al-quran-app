import { Link, useLocation } from "react-router-dom";
import { FaHome, FaBook, FaChartBar } from "react-icons/fa";

function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#F5F1E8] flex justify-center">
      <div className="w-full max-w-md relative min-h-screen">

        <div className="pb-28">
          {children}
        </div>

        {/* Bottom Floating Nav */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2
                        w-[85%] bg-white rounded-full shadow-xl
                        flex justify-around py-4 z-50">

          <NavIcon to="/" active={location.pathname === "/"}>
            <FaHome />
          </NavIcon>

          <NavIcon to="/quran" active={location.pathname.includes("quran")}>
            <FaBook />
          </NavIcon>

          <NavIcon to="/tracker" active={location.pathname === "/tracker"}>
            <FaChartBar />
          </NavIcon>

        </div>

      </div>
    </div>
  );
}

function NavIcon({ to, active, children }) {
  return (
    <Link to={to}>
      <div className={`text-xl transition duration-300
        ${active 
          ? "text-purple-600 scale-110" 
          : "text-gray-400"}`}>
        {children}
      </div>
    </Link>
  );
}

export default Layout;
