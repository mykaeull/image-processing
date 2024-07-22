import FunctionsSelect from "./components/FunctionsSelect";
import Header from "./components/Header";
import ImageUploader from "./components/ImageUploader";
import { ImageUploaderProvider } from "./contexts/ImageUploaderContext";
import "./page.scss";

export default function Home() {
    return (
        <main className="main">
            <ImageUploaderProvider>
                <Header />
                <ImageUploader />
            </ImageUploaderProvider>
        </main>
    );
}
