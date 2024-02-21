"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/components/base/loading";

const Home = async () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/apps");
  });

  return (
    <div className="flex flex-col justify-center min-h-screen py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Loading type="area" />
      </div>
    </div>
  );
};

export default Home;
