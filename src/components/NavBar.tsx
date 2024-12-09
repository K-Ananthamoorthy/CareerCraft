import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="p-4 text-white bg-gray-800">
      <div className="container flex items-center justify-between mx-auto">
        <Link href="/" className="text-xl font-bold">
          Career Explorer
        </Link>
        <ul className="flex space-x-4">
          <li><Link href="/career-recommendations" className="hover:text-gray-300">Recommendations</Link></li>
          <li><Link href="/assessments" className="hover:text-gray-300">Assessments</Link></li>
          <li><Link href="/resources" className="hover:text-gray-300">Resources</Link></li>
        </ul>
      </div>
    </nav>
  );
}
