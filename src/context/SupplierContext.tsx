import { createContext, useContext, useState, ReactNode } from "react";

interface SupplierContextType {
  isSupplier: boolean;
  registerAsSupplier: () => void;
}

const SupplierContext = createContext<SupplierContextType | null>(null);

export function SupplierProvider({ children }: { children: ReactNode }) {
  const [isSupplier, setIsSupplier] = useState<boolean>(
    () => localStorage.getItem("ae_is_supplier") === "true"
  );

  const registerAsSupplier = () => {
    localStorage.setItem("ae_is_supplier", "true");
    setIsSupplier(true);
  };

  return (
    <SupplierContext.Provider value={{ isSupplier, registerAsSupplier }}>
      {children}
    </SupplierContext.Provider>
  );
}

export function useSupplier() {
  const ctx = useContext(SupplierContext);
  if (!ctx) throw new Error("useSupplier must be used inside SupplierProvider");
  return ctx;
}
