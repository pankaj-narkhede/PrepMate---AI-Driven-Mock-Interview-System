import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

interface BreadCrumbsProps {
  breadCrumbPage: string;
  breadCrumbItems?: { link: string; label: string }[];
}

export const BreadCrumbs = ({ breadCrumbPage, breadCrumbItems }: BreadCrumbsProps) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Home */}
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/"
            className="flex items-center gap-1 hover:text-primary"
          >
            <Home className="w-3 h-3" />
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Dynamic items */}
        {breadCrumbItems &&
          breadCrumbItems.map((item, i) => (
            <React.Fragment key={i}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={item.link}
                  className="hover:text-orange-400"
                >
                  {item.label}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          ))}

        {/* Current page */}
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="text-primary font-semibold">
            {breadCrumbPage}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumbs;