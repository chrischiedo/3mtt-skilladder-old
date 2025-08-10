import Link from "next/link";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-blue-500 text-white h-screen p-4">
      <nav>
        <ul className="space-y-4">
          <li>
            <Link href="/dashboard" className="block px-4 py-2 rounded hover:bg-gray-700">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/profile" className="block px-4 py-2 rounded hover:bg-gray-700">
              Profile
            </Link>
          </li>
          <li>
            <Link href="/settings" className="block px-4 py-2 rounded hover:bg-gray-700">
              Settings
            </Link>
          </li>
          <li>
            <Link href="/logout" className="block px-4 py-2 rounded hover:bg-gray-700">
              Logout
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
