import fs from "fs";
import path from "path";
import Image from "next/image";

export const metadata = {
    title: "Screenshots",
};

export default function ScreenshotsPage() {
    const dir = path.join(process.cwd(), "public", "screenshots");
    const images = fs.readdirSync(dir).filter((f) => /\.(png|jpe?g|webp)$/.test(f));
    return (
        <main className="max-w-4xl mx-auto p-6 space-y-4">
            <h1 className="text-2xl font-semibold">Screenshots</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {images.map((img) => (
                    <Image
                        key={img}
                        src={`/screenshots/${img}`}
                        alt={img}
                        width={400}
                        height={300}
                        className="border shadow"
                    />
                ))}
            </div>
        </main>
    );
}