"use client";
import Navbar from "../nav";
import Link from "next/link";

const Header = () => {
  return (
    <div className="flex bg-slate-100 h-14">
      <div className="flex items-center ml-10 py-5">
        <Link href="/">Logo</Link>
      </div>
      <div className="flex-grow flex items-center justify-center">
        <Navbar />
      </div>
      <div className="flex items-center justify-end mr-10 py-5">
        <h3>个人中心</h3>
      </div>
    </div>
  );
};

export default Header;
