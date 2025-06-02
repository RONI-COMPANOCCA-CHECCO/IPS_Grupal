import type { ReactNode } from "react";
import { Container } from "react-bootstrap";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="homepage min-vh-100 bg-light">
      <div className="page-wrapper">{children}</div>
    </div>
  );
};
