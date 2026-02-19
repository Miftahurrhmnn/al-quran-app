import { Link } from "react-router-dom";
import { FaBookOpen, FaPray, FaCompass, FaMosque, FaRegClock } from "react-icons/fa";

function MenuGrid() {

  const menus = [
    { label: "Quran", icon: <FaBookOpen />, path: "/quran" },
    { label: "Doa", icon: <FaPray />, path: "/doa" },
    { label: "Tasbih", icon: <FaMosque />, path: "/tasbih" },
    { label: "Qibla", icon: <FaCompass />, path: "/qibla" },
    { label: "Hadits", icon: <FaRegClock />, path: "/hadits" }
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mt-6">

      {menus.map((m, i) => (
        <Link key={i} to={m.path}>
          <div className="bg-white/5 p-4 rounded-2xl text-center
                          hover:bg-white/10 transition">
            <div className="text-xl text-purple-400 mb-2">
              {m.icon}
            </div>
            <p className="text-xs">{m.label}</p>
          </div>
        </Link>
      ))}

    </div>
  );
}

export default MenuGrid;
