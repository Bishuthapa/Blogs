import UnderDevelopment from "@/components/under-construction";

export default function Home() {

    //const isLive = true;
    const isLive = false;

    return isLive ?  (
        <>
            <div className="  bg-sky-600 rounded-4xl px-4 py-2 mx-4 flex justify-center iten-center">
                


                <div className="w-64">
                    Home page is on contruction;
                    asd
                    Home page is on contruction;
                    asd
                    Home page is on contruction;
                    asd
                    Home page is on contruction;
                    asd
                    Home page is on contruction;
                    asd
                    Home page is on contruction;
                    asd
                    Home page is on contruction;
                    asd
                    Home page is on contruction;
                    asd


                </div>
            </div>
        </>
    ) : <UnderDevelopment />
}