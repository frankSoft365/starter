function NormalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex">
      <div className="lg:mx-20 w-2xl py-4">{children}</div>
    </div>
  );
}

export default NormalLayout;
