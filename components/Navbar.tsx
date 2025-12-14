import CardNav from "./CardNav";
import text from "@/public/text.png";
import image from "@/public/image.png";

export default function Navbar() {
  // Simplified array structure for standard navigation
  const items = [
    {
      label: "About",
      href: "/about",
      bgColor: "#0D0716",
      textColor: "#fff",
    },
    {
      label: "Projects",
      href: "/projects",
      bgColor: "#170D27",
      textColor: "#fff",
    },
    {
      label: "Contact",
      href: "/contact",
      bgColor: "#271E37",
      textColor: "#fff",
    },
    {
      label: "Careers",
      href: "/careers",
      bgColor: "#000000",
      textColor: "#fff",
    },
  ];

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <CardNav
        // Use text.src if importing, or just "/text.png" if in public folder
        logo={image.src} 
        logoAlt="Company Logo"
        items={items}
        // Ensure this color has transparency (last 2 digits '00' to '99')
        // Using '00' makes it fully transparent so blur is very visible
        baseColor="rgba(28, 240, 229, 1)" 
        menuColor="#000"
        buttonBgColor="#111"
        buttonTextColor="#fff"
        ease="power3.out"
        // 'backdrop-blur-md' works best with slight transparency
        className="backdrop-blur-md border-b border-white/10" 
      />
    </div>
  );
}