import ShowcaseCarousel from "../../components/ShowcaseCarousel";
import VerificationStatus from "../../components/VerificationStatus";

export default function VerificationPage() {
  return (
    <main className="flex-1 w-full min-h-screen bg-[#f4f4f5] flex items-center justify-center p-0 md:px-4 md:py-6 sm:px-6 lg:px-8">
      {/* Desktop Layout (>= md): Side-by-side Showcase & Verification Status */}
      <div className="hidden md:flex w-full max-w-6xl flex-row items-stretch justify-center gap-6 md:gap-10">
        <div className="w-1/2 flex justify-center order-1 items-stretch">
          <ShowcaseCarousel />
        </div>
        <div className="w-1/2 flex justify-center order-2 items-stretch">
          <VerificationStatus />
        </div>
      </div>

      {/* Mobile Layout (< md): Centered Verification Status */}
      <div className="flex md:hidden w-full min-h-screen px-4 py-8 items-center justify-center">
        <VerificationStatus />
      </div>
    </main>
  );
}
