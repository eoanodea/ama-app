// src/components/Navbar.tsx
import Link from "next/link";

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/trips">Trips</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
