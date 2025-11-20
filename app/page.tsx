import Image from "next/image";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="relative h-screen w-full">
        <Image
          src="/cover.jpg"
          alt="Cover"
          fill
          priority
          unoptimized
          style={{ objectFit: "cover" }}
        />
        {/* Add your page content here, over the cover image */}
        <div className="absolute inset-0 flex flex-col items-start justify-center pl-20">
          <div className="mt-4 ">
            {/* TEXT SETUP APPLIED HERE */}
            <p className="font-bold text-[72px] text-[#F1F1F1] tracking-[0.03em] leading-[1.2em]" style={{ fontFamily: 'Europa Grotesk SH' }}>
              CHECK OUT
            </p>
            <p className="font-bold text-[72px] text-[#F1F1F1] tracking-[0.03em] leading-[1.2em]" style={{ fontFamily: 'Europa Grotesk SH' }}>
              WHATS NEW
            </p>
            <Button className="mt-2">Shop Now</Button>
          </div>
        </div>

        {/* Gradient Box Overlay */}
        <div
          className="absolute top-1/2 right-20 transform -translate-y-1/2 w-[300px] h-[300px] rounded-[30px]"
          style={{
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
        </div>
      </div>

      {/* New Section */}
      <div className="relative min-h-screen w-full p-10">
        <div className="absolute top-10 left-10">
          <p className="font-bold text-[72px] text-black tracking-[0.03em] leading-[1.2em]" style={{ fontFamily: 'Europa Grotesk SH' }}>
            WHAT'S HOT
          </p>
        </div>


        <div className="mt-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
          <Card
            title="This is a very long title that should span across multiple lines to test the text truncation feature. It needs to be at least four lines long to properly verify that the line-clamp-2 utility class is working as expected and truncating the text with an ellipsis."
            price="$4000.00"
            imageSrc="/cover.jpg"
          />
          <Card
            title="Pokémon Tripack ME02: Phantasmal Flames – English"
            price="$4000.00"
            imageSrc="/cover.jpg"
          />
          <Card
            title="Pokémon Tripack ME02: Phantasmal Flames – English"
            price="$4000.00"
            imageSrc="/cover.jpg"
          />
        </div>
      </div>
    </main>
  );
}