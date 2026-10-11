import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" aria-label="SmileWithSithar home">
          <Image
            className="header-logo"
            src="/smilewithsithar-logo.webp"
            alt="SmileWithSithar"
            width={742}
            height={336}
            priority
          />
        </Link>
      </div>
    </header>
  );
}
