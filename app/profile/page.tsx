import UnderDevelopment from "@/components/under-construction";


export default function Profile() {
    //const isLive = true;
    const isLive = false;

    return isLive ? <>
        <p>gojo</p>
        <>

        </>
    </>
        :
        <UnderDevelopment />
}