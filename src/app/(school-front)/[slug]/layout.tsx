import Footer from "@/components/Footer";
import Header from "@/components/navbar/Header";
import { prisma } from "@/lib/connect";
import { Metadata } from "next";
import React from "react";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const school = await prisma.schoolInfo.findFirst({
    where: { domainPrefix: params.slug },
  });

  if (!school) {
    return {
      title: "School Not Found",
      description: "The requested school could not be found.",
    };
  }

  return {
    title: school.name,
    description: school.description || `${school.name} School Webpage`,
    icons: school.logoUrl
      ? {
          icon: [{ url: school.logoUrl, rel: "icon", type: "image/png" }],
        }
      : undefined,
  };
}

export default async function SchoolLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { slug: string };
}>) {
  const school = await prisma.schoolInfo.findFirst({
    where: { domainPrefix: params.slug },
  });

  if (!school) {
    return {
      title: "School Not Found",
      description: "The requested school could not be found.",
    };
  }

  return (
    <div className="bg-white text-black">
      <Header slug={params.slug} />
      {/* <Navbar pages={pages} school={params.slug} /> */}
      {children}
      <Footer />
    </div>
  );
}
