const DemoBanner = () => {
  return (
    <div
      role="note"
      className="w-full bg-amber-100 text-amber-900 text-xs sm:text-sm text-center py-2 px-4"
    >
      <span className="font-semibold">Demo project.</span>{" "}
      <span className="hidden sm:inline">
        The figures and pricing on this site are sample data for illustration.
      </span>
      <span className="sm:hidden">Figures and pricing are sample data.</span>
    </div>
  );
};

export default DemoBanner;
